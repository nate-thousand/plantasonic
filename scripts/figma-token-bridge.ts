/**
 * Shared Figma ↔ Plantasonic token bridge utilities.
 */

import { readFileSync } from 'node:fs';

export type FigmaVariableEntry = {
  name: string;
  collection?: string;
  type: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN' | string;
  value: unknown;
};

export type FigmaSnapshot = {
  source?: 'figma-mcp' | 'figma-rest' | 'figma-get_variable_defs';
  fileKey?: string;
  pulledAt?: string;
  mode?: string;
  variables: Record<string, unknown> | FigmaVariableEntry[];
};

/** Maps token JSON dot-path → SCSS variable name */
export const SCSS_NAME: Record<string, string> = {
  'color.primary': '$ds-color-primary',
  'color.secondary': '$ds-color-secondary',
  'color.accent': '$ds-color-accent',
  'color.surface.default': '$ds-color-surface-default',
  'color.surface.raised': '$ds-color-surface-raised',
  'color.surface.sunken': '$ds-color-surface-sunken',
  'color.surface.overlay': '$ds-color-surface-overlay',
  'color.text.primary': '$ds-color-text-primary',
  'color.text.secondary': '$ds-color-text-secondary',
  'color.text.muted': '$ds-color-text-muted',
  'color.text.link': '$ds-color-text-link',
  'color.border.default': '$ds-color-border-default',
  'color.border.subtle': '$ds-color-border-subtle',
  'color.border.strong': '$ds-color-border-strong',
  'color.border.focus': '$ds-color-border-focus',
  'color.status.success': '$ds-color-success',
  'color.status.warning': '$ds-color-warning',
  'color.status.error': '$ds-color-error',
  'color.status.info': '$ds-color-info',
  'font.family.sans': '$ds-font-family-sans',
  'font.family.mono': '$ds-font-family-mono',
  'font.size.base': '$ds-font-size-base',
  'font.size.display': '$ds-font-size-display',
  'font.size.h1': '$ds-font-size-h1',
  'font.size.h2': '$ds-font-size-h2',
  'font.size.h3': '$ds-font-size-h3',
  'font.size.h4': '$ds-font-size-h4',
  'font.size.body': '$ds-font-size-body',
  'font.size.body-sm': '$ds-font-size-body-sm',
  'font.size.caption': '$ds-font-size-caption',
  'font.size.label': '$ds-font-size-label',
  'font.line-height.base': '$ds-line-height-base',
  'font.weight.headings': '$ds-headings-font-weight',
  'space.0': '$ds-space-0',
  'space.1': '$ds-space-1',
  'space.2': '$ds-space-2',
  'space.3': '$ds-space-3',
  'space.4': '$ds-space-4',
  'space.5': '$ds-space-5',
  'space.6': '$ds-space-6',
  'space.8': '$ds-space-8',
  'space.spacer': '$ds-spacer',
  'radius.sm': '$ds-radius-sm',
  'radius.default': '$ds-radius-default',
  'radius.lg': '$ds-radius-lg',
  'shadow.none': '$ds-shadow-none',
  'shadow.sm': '$ds-shadow-sm',
  'shadow.md': '$ds-shadow-md',
  'shadow.lg': '$ds-shadow-lg',
  'shadow.focus': '$ds-shadow-focus',
  'transition.fast': '$ds-transition-fast',
  'transition.base': '$ds-transition-base',
  'transition.slow': '$ds-transition-slow',
  'ease.out': '$ds-ease-out',
  'ease.in': '$ds-ease-in',
  'ease.in-out': '$ds-ease-in-out',
  'product.nav-height': '$ps-nav-height',
  'product.dock-height': '$ps-dock-height',
  'product.sidebar-width': '$ps-sidebar-width',
  'product.shadow-overlay': '$ps-shadow-overlay',
  'product.shadow-sidebar': '$ps-shadow-sidebar',
  'product.touch-target': '$ps-touch-target',
};

/** Figma variable name → token JSON path */
export const FIGMA_NAME_TO_PATH: Record<string, string> = Object.fromEntries(
  Object.entries(SCSS_NAME).map(([path]) => [path.replace(/\./g, '-'), path]),
);

export const REFERENCE_PATHS = new Set([
  'color.text.link',
  'color.border.focus',
  'space.spacer',
  'product.shadow-overlay',
]);

export function parseFigmaUrl(input: string): { fileKey: string; nodeId: string } {
  const trimmed = input.trim();

  const designMatch = trimmed.match(
    /figma\.com\/design\/([A-Za-z0-9]+)(?:\/branch\/([A-Za-z0-9]+))?[^?]*(?:\?[^#]*)?/,
  );
  if (!designMatch) {
    throw new Error(
      'Invalid Figma URL. Paste a design file link like https://www.figma.com/design/FILEKEY/Name?node-id=0-1',
    );
  }

  const fileKey = designMatch[2] ?? designMatch[1]!;
  const nodeMatch = trimmed.match(/node-id=([\d]+)-([\d]+)/);
  const nodeId = nodeMatch ? `${nodeMatch[1]}:${nodeMatch[2]}` : '0:1';

  return { fileKey, nodeId };
}

export function figmaNameToPath(name: string): string | undefined {
  const normalized = name.trim().replace(/\//g, '-').toLowerCase();
  if (FIGMA_NAME_TO_PATH[normalized]) {
    return FIGMA_NAME_TO_PATH[normalized];
  }

  const parts = normalized.split('-');
  if (parts.length < 2) return undefined;

  for (let i = 1; i < parts.length; i += 1) {
    const path = `${parts.slice(0, i).join('.')}.${parts.slice(i).join('-')}`;
    if (SCSS_NAME[path]) return path;
  }

  for (let i = 1; i < parts.length - 1; i += 1) {
    for (let j = i + 1; j < parts.length; j += 1) {
      const path = `${parts.slice(0, i).join('.')}.${parts.slice(i, j).join('-')}.${parts.slice(j).join('-')}`;
      if (SCSS_NAME[path]) return path;
    }
  }

  return undefined;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function colorToHex(color: { r: number; g: number; b: number; a?: number }): string {
  const r = Math.round(clamp01(color.r) * 255);
  const g = Math.round(clamp01(color.g) * 255);
  const b = Math.round(clamp01(color.b) * 255);
  const a = color.a !== undefined ? clamp01(color.a) : 1;

  if (a < 1) {
    return `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(3))})`;
  }
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

export function normalizeFigmaValue(type: string, value: unknown): unknown {
  if (value === null || value === undefined) return value;

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;

    if ('type' in obj && obj.type === 'VARIABLE_ALIAS' && typeof obj.id === 'string') {
      return { $alias: obj.id };
    }

    if ('r' in obj && 'g' in obj && 'b' in obj) {
      return colorToHex(obj as { r: number; g: number; b: number; a?: number });
    }
  }

  if (type === 'FLOAT' && typeof value === 'number') {
    if (Number.isInteger(value) || value > 4) {
      return `${value}px`;
    }
    return value;
  }

  return value;
}

export function snapshotToVariableMap(snapshot: FigmaSnapshot): Map<string, unknown> {
  const map = new Map<string, unknown>();

  if (Array.isArray(snapshot.variables)) {
    for (const entry of snapshot.variables) {
      const path = figmaNameToPath(entry.name);
      if (!path) continue;
      map.set(path, normalizeFigmaValue(entry.type, entry.value));
    }
    return map;
  }

  for (const [name, value] of Object.entries(snapshot.variables)) {
    const path = figmaNameToPath(name);
    if (!path) continue;
    map.set(path, value);
  }

  return map;
}

type TokenLeaf = { $type?: string; $value: unknown };

function isTokenLeaf(node: unknown): node is TokenLeaf {
  return (
    typeof node === 'object' &&
    node !== null &&
    '$value' in node &&
    !Array.isArray(node)
  );
}

function setTokenValue(tree: Record<string, unknown>, path: string, value: unknown): void {
  const parts = path.split('.');
  let node: Record<string, unknown> = tree;

  for (let i = 0; i < parts.length - 1; i += 1) {
    const key = parts[i]!;
    if (!(key in node) || typeof node[key] !== 'object' || node[key] === null) {
      node[key] = {};
    }
    node = node[key] as Record<string, unknown>;
  }

  const leafKey = parts[parts.length - 1]!;
  const existing = node[leafKey];

  if (isTokenLeaf(existing)) {
    if (REFERENCE_PATHS.has(path) && typeof existing.$value === 'string' && existing.$value.startsWith('{')) {
      return;
    }
    node[leafKey] = { ...existing, $value: value };
  }
}

export function applyVariableMapToTokens(
  tokensJson: Record<string, unknown>,
  variables: Map<string, unknown>,
): { updated: Record<string, unknown>; applied: string[]; skipped: string[] } {
  const applied: string[] = [];
  const skipped: string[] = [];

  for (const [path, value] of variables) {
    if (!SCSS_NAME[path]) {
      skipped.push(path);
      continue;
    }
    if (REFERENCE_PATHS.has(path)) {
      skipped.push(path);
      continue;
    }
    if (value && typeof value === 'object' && '$alias' in (value as object)) {
      skipped.push(path);
      continue;
    }
    setTokenValue(tokensJson, path, value);
    applied.push(path);
  }

  return { updated: tokensJson, applied, skipped };
}

export function loadJson(path: string): Record<string, unknown> {
  return JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>;
}

export function restApiToVariableMap(
  meta: {
    variables: Record<
      string,
      {
        id: string;
        name: string;
        resolvedType: string;
        valuesByMode: Record<string, unknown>;
        variableCollectionId: string;
      }
    >;
    variableCollections: Record<
      string,
      {
        name: string;
        defaultModeId: string;
        modes: { modeId: string; name: string }[];
      }
    >;
  },
  preferredMode?: string,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const variable of Object.values(meta.variables)) {
    const collection = meta.variableCollections[variable.variableCollectionId];
    if (!collection) continue;

    let modeId = collection.defaultModeId;
    if (preferredMode) {
      const match = collection.modes.find(
        (m) => m.name.toLowerCase() === preferredMode.toLowerCase(),
      );
      if (match) modeId = match.modeId;
    }

    const raw = variable.valuesByMode[modeId];
    result[variable.name] = normalizeFigmaValue(variable.resolvedType, raw);
  }

  return result;
}

export function mcpVariableDefsToSnapshot(
  defs: Record<string, unknown>,
  fileKey: string,
): FigmaSnapshot {
  return {
    source: 'figma-get_variable_defs',
    fileKey,
    pulledAt: new Date().toISOString(),
    variables: defs,
  };
}
