/**
 * Design system integration verification.
 * Run with: npm run verify:design-system
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (/\.(ts|tsx|scss|css)$/.test(entry.name)) acc.push(full);
  }
  return acc;
}

function main(): void {
  const variablesEntry = require.resolve('plantasonic-design-system/css/variables.css');
  const shellEntry = require.resolve('plantasonic-design-system/shell');
  const pkgDir = dirname(dirname(variablesEntry));

  const variablesPath = join(pkgDir, 'css/variables.css');
  const bootstrapThemePath = join(pkgDir, 'scss/bootstrap-theme.scss');
  const shellPath = join(pkgDir, 'src/shell/index.ts');

  assert(existsSync(variablesPath), 'variables.css missing from design system package');
  assert(existsSync(bootstrapThemePath), 'bootstrap-theme.scss missing from design system package');
  assert(existsSync(shellPath), 'shell API missing from design system package');
  assert(shellEntry.includes('shell'), 'shell package export must resolve');

  const variables = readFileSync(variablesPath, 'utf8');
  assert(variables.includes('--ds-color-surface-app'), 'variables.css missing --ds-color-surface-app');
  assert(variables.includes('[data-theme="dark"]'), 'variables.css missing dark theme selector');
  assert(variables.includes('[data-theme="light"]'), 'variables.css missing light theme selector');

  const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
    dependencies?: Record<string, string>;
  };
  assert(
    packageJson.dependencies?.['plantasonic-design-system'],
    'package.json must depend on plantasonic-design-system',
  );

  const mainTs = readFileSync('src/main.ts', 'utf8');
  assert(
    mainTs.includes('plantasonic-design-system/css/variables.css'),
    'main.ts must import design system CSS variables',
  );
  assert(mainTs.includes('initShellTheme'), 'main.ts must initialize shell theme from design system');

  const aliases = readFileSync('src/styles/_ps-aliases.scss', 'utf8');
  assert(aliases.includes('var(--ds-'), 'ps-aliases must reference --ds-* tokens');
  assert(!/--ps-color-[a-z-]+:\s*#/.test(aliases), 'ps-aliases must not define raw hex token values');

  const indexScss = readFileSync('src/styles/index.scss', 'utf8');
  for (const fragment of [
    'plantasonic-design-system/scss/bootstrap-theme.scss',
    'plantasonic-design-system/scss/css-theme-bridge.scss',
    'plantasonic-design-system/scss/application-shell.scss',
    'plantasonic-design-system/scss/navigation-framework.scss',
  ]) {
    assert(indexScss.includes(fragment), `index.scss must import ${fragment}`);
  }

  const installShell = readFileSync('src/shell/installApplicationShell.ts', 'utf8');
  assert(installShell.includes('renderApplicationShell'), 'installApplicationShell must render via public API');
  assert(installShell.includes('bindApplicationShell'), 'installApplicationShell must bind via public API');

  const shellConfig = readFileSync('src/shell/shell-config.ts', 'utf8');
  assert(shellConfig.includes('persistState: true'), 'shell-config must enable shell persistence');
  assert(shellConfig.includes('routes:'), 'shell-config must declare routes');

  const srcFiles = walk('src');
  const forbidden = [
    'CommandPalette.ts',
    'createCommandPalette',
    'showcase/',
    'from \'@/design-system/tokens',
  ];
  for (const file of srcFiles) {
    const rel = file.replace(/\\/g, '/');
    const content = readFileSync(file, 'utf8');
    for (const needle of forbidden) {
      if (needle.endsWith('.ts') && rel.endsWith(needle)) {
        throw new Error(`Removed local shell file still present: ${rel}`);
      }
      if (content.includes(needle)) {
        throw new Error(`Forbidden design-system duplication in ${rel}: ${needle}`);
      }
    }
  }

  console.info('Design system integration: OK');
}

main();
