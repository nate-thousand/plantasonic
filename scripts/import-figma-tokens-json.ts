/**
 * Parse native Figma Variables .tokens.json exports and map to Plantasonic tokens.
 *
 * Usage:
 *   npm run tokens:import-json -- foundation.json semantic/Theme\ 1.tokens.json
 *   npm run tokens:import-json -- --foundation "/path/Mode 1.tokens.json" --semantic "/path/Theme 1.tokens.json"
 */

import { readFileSync, writeFileSync, copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { applyVariableMapToTokens, loadJson } from './figma-token-bridge.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TOKENS_JSON = join(ROOT, 'src/design-system/tokens/figma/tokens.json');
const IMPORTS_DIR = join(ROOT, 'src/design-system/tokens/figma/imports');

type TokenLeaf = {
  $type?: string;
  $value: unknown;
  $extensions?: {
    'com.figma.aliasData'?: { targetVariableName?: string };
  };
};

/** Semantic collection (Theme 1) → Plantasonic token path */
const SEMANTIC_MAP: Record<string, string> = {
  'background.primary': 'color.surface.default',
  'content.primary': 'color.text.primary',
  'content.secondary': 'color.text.secondary',
  'border.primary': 'color.border.focus',
  'border.secondary': 'color.border.strong',
};

/** Foundation primitives → Plantasonic token path */
const FOUNDATION_MAP: Record<string, string> = {
  'color.green-500': 'color.primary',
  'color.green-700': 'color.secondary',
  'color.green-900': 'color.surface.sunken',
  'color.neutral.900': 'color.surface.raised',
  'color.neutral.800': 'color.surface.overlay',
  'color.neutral.400': 'color.text.muted',
  'color.neutral.700': 'color.border.default',
  'radius.S': 'radius.sm',
  'radius.M': 'radius.default',
  'radius.L': 'radius.lg',
  'scale.4': 'space.1',
  'scale.8': 'space.2',
  'scale.16': 'space.3',
  'scale.24': 'space.4',
  'scale.32': 'space.5',
  'scale.48': 'space.6',
  'scale.64': 'space.8',
};

function isTokenLeaf(node: unknown): node is TokenLeaf {
  return (
    typeof node === 'object' &&
    node !== null &&
    '$value' in node &&
    !Array.isArray(node)
  );
}

function flattenFigmaExport(node: unknown, prefix = ''): Map<string, TokenLeaf> {
  const result = new Map<string, TokenLeaf>();

  if (isTokenLeaf(node)) {
    result.set(prefix, node);
    return result;
  }

  if (typeof node !== 'object' || node === null || Array.isArray(node)) {
    return result;
  }

  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    const path = prefix ? `${prefix}.${key}` : key;
    for (const [childPath, leaf] of flattenFigmaExport(value, path)) {
      result.set(childPath, leaf);
    }
  }

  return result;
}

function extractHex(leaf: TokenLeaf): string | undefined {
  const value = leaf.$value;
  if (typeof value === 'string' && value.startsWith('#')) return value;
  if (typeof value === 'object' && value !== null && 'hex' in value) {
    return (value as { hex: string }).hex;
  }
  return undefined;
}

function extractNumber(leaf: TokenLeaf, resolved: Map<string, unknown>): number | undefined {
  const value = leaf.$value;
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
    const ref = value.slice(1, -1);
    const resolvedVal = resolved.get(ref);
    if (typeof resolvedVal === 'number') return resolvedVal;
  }
  return undefined;
}

function pxToRem(px: number): string {
  return `${px / 16}rem`;
}

function resolveFoundationValues(flat: Map<string, TokenLeaf>): Map<string, unknown> {
  const resolved = new Map<string, unknown>();

  // First pass: raw numbers and colors
  for (const [path, leaf] of flat) {
    const hex = extractHex(leaf);
    if (hex) {
      resolved.set(path, hex);
      continue;
    }
    if (typeof leaf.$value === 'number') {
      resolved.set(path, leaf.$value);
    }
  }

  // Second pass: resolve references
  for (const [path, leaf] of flat) {
    if (resolved.has(path)) continue;
    if (typeof leaf.$value === 'string' && leaf.$value.startsWith('{')) {
      const ref = leaf.$value.slice(1, -1);
      const refVal = resolved.get(ref);
      if (refVal !== undefined) {
        resolved.set(path, refVal);
      }
    }
  }

  return resolved;
}

function mapExportsToPlantasonic(
  foundation: Map<string, TokenLeaf>,
  semantic: Map<string, TokenLeaf>,
): Map<string, unknown> {
  const foundationResolved = resolveFoundationValues(foundation);
  const plantasonic = new Map<string, unknown>();

  // Foundation → Plantasonic
  for (const [figmaPath, targetPath] of Object.entries(FOUNDATION_MAP)) {
    const value = foundationResolved.get(figmaPath);
    if (value === undefined) continue;

    if (figmaPath.startsWith('color.')) {
      plantasonic.set(targetPath, value);
    } else if (figmaPath.startsWith('radius.') || figmaPath.startsWith('scale.')) {
      if (typeof value === 'number') {
        plantasonic.set(targetPath, pxToRem(value));
      }
    }
  }

  // Semantic overrides (Theme 1)
  for (const [figmaPath, targetPath] of Object.entries(SEMANTIC_MAP)) {
    const leaf = semantic.get(figmaPath);
    if (!leaf) continue;
    const hex = extractHex(leaf);
    if (hex) plantasonic.set(targetPath, hex);
  }

  // Derived tokens from semantic theme
  const accent = plantasonic.get('color.text.primary') ?? foundationResolved.get('color.green-700');
  if (accent) {
    plantasonic.set('color.accent', accent);
    plantasonic.set('color.secondary', accent);
  }

  const surfaceDefault = plantasonic.get('color.surface.default');
  if (surfaceDefault) {
    plantasonic.set('color.border.subtle', plantasonic.get('color.border.default') ?? surfaceDefault);
  }

  // Focus ring tuned to accent green
  if (typeof accent === 'string' && accent.startsWith('#')) {
    const r = parseInt(accent.slice(1, 3), 16);
    const g = parseInt(accent.slice(3, 5), 16);
    const b = parseInt(accent.slice(5, 7), 16);
    plantasonic.set('shadow.focus', `0 0 0 0.2rem rgba(${r}, ${g}, ${b}, 0.35)`);
  }

  return plantasonic;
}

function parseArgs(): { foundation: string; semantic: string; theme?: string } {
  const args = process.argv.slice(2);
  let foundation = '';
  let semantic = '';
  let theme: string | undefined;

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]!;
    if (arg === '--foundation' && args[i + 1]) {
      foundation = args[++i]!;
    } else if (arg === '--semantic' && args[i + 1]) {
      semantic = args[++i]!;
    } else if (arg === '--theme' && args[i + 1]) {
      theme = args[++i]!;
    } else if (!arg.startsWith('-') && !foundation) {
      foundation = arg;
    } else if (!arg.startsWith('-') && foundation && !semantic) {
      semantic = arg;
    }
  }

  if (!foundation || !semantic) {
    throw new Error(
      'Usage: npm run tokens:import-json -- --foundation "Mode 1.tokens.json" --semantic "Theme 1.tokens.json"',
    );
  }

  return { foundation, semantic, theme };
}

function archiveImport(sourcePath: string): void {
  mkdirSync(IMPORTS_DIR, { recursive: true });
  const dest = join(IMPORTS_DIR, basename(sourcePath));
  copyFileSync(sourcePath, dest);
}

function main(): void {
  const { foundation, semantic, theme } = parseArgs();

  if (!existsSync(foundation)) throw new Error(`Foundation file not found: ${foundation}`);
  if (!existsSync(semantic)) throw new Error(`Semantic file not found: ${semantic}`);

  archiveImport(foundation);
  archiveImport(semantic);

  const foundationFlat = flattenFigmaExport(JSON.parse(readFileSync(foundation, 'utf8')));
  const semanticFlat = flattenFigmaExport(JSON.parse(readFileSync(semantic, 'utf8')));

  const mapped = mapExportsToPlantasonic(foundationFlat, semanticFlat);
  const tokens = loadJson(TOKENS_JSON);
  const { updated, applied, skipped } = applyVariableMapToTokens(tokens, mapped);

  writeFileSync(TOKENS_JSON, `${JSON.stringify(updated, null, 2)}\n`, 'utf8');

  console.log(`✓ Imported Figma tokens (${theme ?? 'Theme 1'})`);
  console.log(`  Foundation: ${basename(foundation)}`);
  console.log(`  Semantic:   ${basename(semantic)}`);
  console.log(`  Applied ${applied.length} Plantasonic tokens:`);
  for (const path of applied) {
    console.log(`    ${path} → ${mapped.get(path)}`);
  }
  if (skipped.length) {
    console.log(`  Skipped ${skipped.length} (references or unmapped)`);
  }

  execSync('npm run tokens:sync', { cwd: ROOT, stdio: 'inherit' });
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
