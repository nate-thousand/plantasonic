/**
 * Platform SDK cutover verification.
 * Run: npm run verify:platform-sdk
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function main(): void {
  const root = resolve(import.meta.dirname, '..');
  const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')) as {
    dependencies: Record<string, string>;
  };

  for (const dep of [
    '@plantasonic/platform',
    '@plantasonic/platform-types',
    '@plantasonic/platform-demo',
  ]) {
    assert(pkg.dependencies[dep]?.startsWith('file:'), `package.json must link ${dep} via file:`);
  }

  const platformRoot = resolve(root, '../plantasonic-platform');
  assert(existsSync(platformRoot), 'sibling plantasonic-platform repo must exist');
  assert(
    existsSync(resolve(platformRoot, 'apps/demo/src/instrumentApp.ts')),
    'platform demo instrumentApp.ts must exist',
  );

  const presetBundles = readFileSync(
    resolve(root, 'src/platform-consumer/content/presetBundles.ts'),
    'utf8',
  );
  assert(presetBundles.includes('PRESET_WORLDS'), 'preset bundles must import production worlds');

  const appContent = readFileSync(resolve(root, 'src/platform-consumer/appContent.ts'), 'utf8');
  assert(appContent.includes('plantasonicAppContent'), 'app content export must exist');
  assert(appContent.includes('PLANTASONIC_PRESET_BUNDLES'), 'app content must wire preset bundles');

  console.log('✓ Platform SDK cutover verified');
  console.log('  bootstrap: mountInstrumentApp via platform-consumer');
  console.log('  worlds: src/presets/worlds → PresetBundle[]');
}

main();
