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
  const dsPackageJson = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8')) as {
    version: string;
  };

  assert(existsSync(variablesPath), 'variables.css missing from design system package');
  assert(existsSync(bootstrapThemePath), 'bootstrap-theme.scss missing from design system package');
  assert(existsSync(shellPath), 'shell API missing from design system package');
  assert(shellEntry.includes('shell'), 'shell package export must resolve');
  assert(
    dsPackageJson.version.startsWith('1.'),
    `design system must be v1.x (got ${dsPackageJson.version})`,
  );

  const variables = readFileSync(variablesPath, 'utf8');
  assert(variables.includes('--ds-color-surface-app'), 'variables.css missing --ds-color-surface-app');
  assert(variables.includes('[data-theme="dark"]'), 'variables.css missing dark theme selector');
  assert(variables.includes('[data-theme="light"]'), 'variables.css missing light theme selector');

  const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
    dependencies?: Record<string, string>;
    workspaces?: string[];
  };
  assert(
    packageJson.dependencies?.['plantasonic-design-system'],
    'package.json must depend on plantasonic-design-system',
  );
  assert(
    packageJson.dependencies?.['@plantasonic/platform'],
    'package.json must depend on @plantasonic/platform',
  );
  assert(
    packageJson.workspaces?.includes('plantasonic-design-system'),
    'package.json must list plantasonic-design-system workspace',
  );

  const mainTs = readFileSync('src/main.ts', 'utf8');
  assert(
    mainTs.includes('plantasonic-design-system/css/variables.css'),
    'main.ts must import design system CSS variables',
  );
  assert(mainTs.includes('initShellTheme'), 'main.ts must initialize design system theme');
  assert(
    mainTs.includes('createPlantasonicPlatformApp'),
    'main.ts must bootstrap via platform consumer',
  );
  assert(!mainTs.includes('createPlantasonicApp'), 'main.ts must not use legacy app bootstrap');

  const indexScss = readFileSync('src/styles/index.scss', 'utf8');
  assert(
    indexScss.includes('application-shell.scss'),
    'index.scss must import application shell styles',
  );
  assert(indexScss.includes('./platform-instrument.scss'), 'index.scss must import platform instrument styles');
  assert(!indexScss.includes('navigation-framework'), 'index.scss must not import legacy nav shell');
  assert(!indexScss.includes('./app-layout.scss'), 'index.scss must not import legacy app layout');

  const bootstrapTs = readFileSync('src/platform-consumer/bootstrap.ts', 'utf8');
  assert(
    bootstrapTs.includes('mountInstrumentApp'),
    'platform consumer must mount via @plantasonic/platform-demo',
  );
  assert(existsSync('src/platform-consumer/appContent.ts'), 'platform consumer content must exist');
  assert(existsSync('src/platform-consumer/content/presetBundles.ts'), 'preset bundles must exist');
  assert(!existsSync('src/shell'), 'legacy local shell removed');
  assert(!existsSync('src/runtime'), 'legacy runtime removed');
  assert(!existsSync('src/ui'), 'legacy UI removed');

  const srcFiles = walk('src');
  const forbidden = [
    'CommandPalette.ts',
    'createCommandPalette',
    'showcase/',
    'from \'@/design-system/tokens',
    'platform-services.ts',
    'engine-catalog.ts',
    'renderAppLayout',
    'bindAppUi',
    'createRuntime',
  ];
  for (const file of srcFiles) {
    const rel = file.replace(/\\/g, '/');
    const content = readFileSync(file, 'utf8');
    for (const needle of forbidden) {
      if (needle.endsWith('.ts') && rel.endsWith(needle)) {
        throw new Error(`Removed local platform mirror still present: ${rel}`);
      }
      if (content.includes(needle)) {
        throw new Error(`Forbidden legacy infrastructure in ${rel}: ${needle}`);
      }
    }
  }

  console.info(`Design system integration: OK (plantasonic-design-system@${dsPackageJson.version})`);
}

main();
