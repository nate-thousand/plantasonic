/**
 * Design system integration verification.
 * Run with: npm run verify:design-system
 */

import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function main(): void {
  const variablesEntry = require.resolve('plantasonic-design-system/css/variables.css');
  const pkgDir = dirname(dirname(variablesEntry));

  const variablesPath = join(pkgDir, 'css/variables.css');
  const bootstrapThemePath = join(pkgDir, 'scss/bootstrap-theme.scss');

  assert(existsSync(variablesPath), 'variables.css missing from design system package');
  assert(existsSync(bootstrapThemePath), 'bootstrap-theme.scss missing from design system package');

  const variables = readFileSync(variablesPath, 'utf8');
  assert(variables.includes('--ds-color-surface-app'), 'variables.css missing --ds-color-surface-app');
  assert(variables.includes('[data-theme="dark"]'), 'variables.css missing dark theme selector');
  assert(variables.includes('[data-theme="light"]'), 'variables.css missing light theme selector');

  const aliases = readFileSync('src/styles/_ps-aliases.scss', 'utf8');
  assert(aliases.includes('var(--ds-'), 'ps-aliases must reference --ds-* tokens');

  const indexScss = readFileSync('src/styles/index.scss', 'utf8');
  assert(
    indexScss.includes('plantasonic-design-system/scss/bootstrap-theme.scss'),
    'index.scss must import bootstrap-theme from design system package',
  );

  console.info('Design system integration: OK');
}

main();
