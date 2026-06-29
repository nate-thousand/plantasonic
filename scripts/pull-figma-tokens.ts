/**
 * Pull Figma variables without manual JSON export.
 *
 * Option A — paste link + personal access token (CLI):
 *   FIGMA_ACCESS_TOKEN=xxx npm run tokens:pull -- "https://www.figma.com/design/FILEKEY/..."
 *
 * Option B — Cursor MCP (recommended, no token):
 *   Paste your Figma link in chat and ask to pull tokens.
 *   Agent uses Figma MCP → writes figma/figma.snapshot.json → npm run tokens:import
 *
 * Option C — import an existing snapshot:
 *   npm run tokens:import
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  applyVariableMapToTokens,
  loadJson,
  parseFigmaUrl,
  restApiToVariableMap,
  snapshotToVariableMap,
  type FigmaSnapshot,
} from './figma-token-bridge.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG_PATH = join(ROOT, 'src/design-system/tokens/figma/figma.config.json');
const SNAPSHOT_PATH = join(ROOT, 'src/design-system/tokens/figma/figma.snapshot.json');
const TOKENS_JSON = join(ROOT, 'src/design-system/tokens/figma/tokens.json');

type FigmaConfig = {
  fileKey?: string;
  nodeId?: string;
  modes?: string[];
  figmaUrl?: string;
};

function loadConfig(): FigmaConfig {
  if (!existsSync(CONFIG_PATH)) return {};
  return JSON.parse(readFileSync(CONFIG_PATH, 'utf8')) as FigmaConfig;
}

function saveConfig(config: FigmaConfig): void {
  writeFileSync(CONFIG_PATH, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
}

async function fetchFigmaVariables(
  fileKey: string,
  token: string,
  preferredMode?: string,
): Promise<Record<string, unknown>> {
  const response = await fetch(`https://api.figma.com/v1/files/${fileKey}/variables/local`, {
    headers: { 'X-Figma-Token': token },
  });

  if (!response.ok) {
    const body = await response.text();
    if (response.status === 403) {
      throw new Error(
        'Figma Variables API requires Enterprise + file_variables:read scope. Use Cursor MCP instead — paste your Figma link in chat.',
      );
    }
    throw new Error(`Figma API ${response.status}: ${body}`);
  }

  const data = (await response.json()) as {
    meta?: Parameters<typeof restApiToVariableMap>[0];
  };

  if (!data.meta) {
    throw new Error('Unexpected Figma API response — missing meta');
  }

  return restApiToVariableMap(data.meta, preferredMode);
}

function importSnapshot(snapshotPath: string): void {
  const snapshot = JSON.parse(readFileSync(snapshotPath, 'utf8')) as FigmaSnapshot;
  const variableMap = snapshotToVariableMap(snapshot);
  const tokens = loadJson(TOKENS_JSON);
  const { updated, applied, skipped } = applyVariableMapToTokens(tokens, variableMap);

  writeFileSync(TOKENS_JSON, `${JSON.stringify(updated, null, 2)}\n`, 'utf8');

  console.log(`✓ Imported ${applied.length} tokens from ${snapshotPath.replace(`${ROOT}/`, '')}`);
  if (skipped.length) {
    console.log(`  Skipped ${skipped.length} (aliases, references, or unmapped)`);
  }
}

async function cmdPull(): Promise<void> {
  const urlArg = process.argv.slice(3).find((a) => a.startsWith('http'));
  const config = loadConfig();
  const token = process.env.FIGMA_ACCESS_TOKEN;

  let fileKey = config.fileKey;
  let nodeId = config.nodeId ?? '0:1';

  if (urlArg) {
    const parsed = parseFigmaUrl(urlArg);
    fileKey = parsed.fileKey;
    nodeId = parsed.nodeId;
    config.fileKey = fileKey;
    config.nodeId = nodeId;
    config.figmaUrl = urlArg;
    saveConfig(config);
    console.log(`✓ Saved file key to figma.config.json`);
  }

  if (!fileKey) {
    throw new Error(
      'No Figma file configured. Pass a URL:\n  npm run tokens:pull -- "https://www.figma.com/design/FILEKEY/..."\nOr paste the link in Cursor chat for MCP pull.',
    );
  }

  if (!token) {
    throw new Error(
      'FIGMA_ACCESS_TOKEN not set.\n\nRecommended: paste your Figma link in Cursor chat and ask to pull tokens via MCP (no export, no token).\n\nCLI alternative: create a token at figma.com/developers with file_variables:read scope.',
    );
  }

  const preferredMode = config.modes?.[0];
  const variables = await fetchFigmaVariables(fileKey, token, preferredMode);

  const snapshot: FigmaSnapshot = {
    source: 'figma-rest',
    fileKey,
    pulledAt: new Date().toISOString(),
    mode: preferredMode,
    variables,
  };

  writeFileSync(SNAPSHOT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
  console.log(`✓ Pulled ${Object.keys(variables).length} variables from Figma`);
  console.log(`  Snapshot: ${SNAPSHOT_PATH.replace(`${ROOT}/`, '')}`);

  importSnapshot(SNAPSHOT_PATH);

  // Run sync via subprocess-free inline — import already updated tokens.json
  const { execSync } = await import('node:child_process');
  execSync('npm run tokens:sync', { cwd: ROOT, stdio: 'inherit' });
}

async function cmdImport(): Promise<void> {
  const snapshotArg = process.argv[3];
  const snapshotPath = snapshotArg ?? SNAPSHOT_PATH;

  if (!existsSync(snapshotPath)) {
    throw new Error(
      `Snapshot not found: ${snapshotPath}\nUse Cursor MCP to pull variables, or run tokens:pull with a Figma URL.`,
    );
  }

  importSnapshot(snapshotPath);

  const { execSync } = await import('node:child_process');
  execSync('npm run tokens:sync', { cwd: ROOT, stdio: 'inherit' });
}

async function main(): Promise<void> {
  const command = process.argv[2] ?? 'import';

  switch (command) {
    case 'pull':
      await cmdPull();
      break;
    case 'import':
      await cmdImport();
      break;
    default:
      throw new Error(`Unknown command: ${command}. Use pull or import.`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
