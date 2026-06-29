/**
 * Platform client verification — manifest, engine packages, AI context.
 * Run: npm run verify:platform
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildProjectContext, installEngine } from '../plantasonic-design-system/src/platform/index.ts';
import type { ProjectManifest } from '../plantasonic-design-system/src/platform/types.ts';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function main(): void {
  const root = resolve(import.meta.dirname, '..');
  const manifest = JSON.parse(
    readFileSync(resolve(root, 'platform.json'), 'utf8'),
  ) as ProjectManifest;
  const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')) as {
    dependencies: Record<string, string>;
    version: string;
  };
  const dsPkg = JSON.parse(
    readFileSync(resolve(root, 'plantasonic-design-system/package.json'), 'utf8'),
  ) as { version: string };

  assert(manifest.id === 'plantasonic', 'platform.json id must be plantasonic');
  assert(manifest.engines.includes('engine.sound'), 'engine.sound required');
  assert(manifest.engines.includes('engine.visual'), 'engine.visual required');
  assert(manifest.version === pkg.version, 'platform.json version must match package.json');
  assert(
    manifest.dependencies['plantasonic-design-system']?.includes('1.0'),
    'platform.json must pin plantasonic-design-system to v1.0.x',
  );
  assert(dsPkg.version.startsWith('1.'), `design system must be v1.x (got ${dsPkg.version})`);

  for (const engineId of manifest.engines) {
    const { package: npmName } = installEngine(engineId);
    if (npmName) {
      assert(
        pkg.dependencies[npmName] !== undefined,
        `package.json missing dependency for ${engineId} (${npmName})`,
      );
    }
  }

  const platformServices = readFileSync(resolve(root, 'src/platform/services.ts'), 'utf8');
  assert(
    platformServices.includes('plantasonic-design-system/platform/services'),
    'src/platform/services.ts must consume design system createPlatformServices',
  );

  const context = buildProjectContext(manifest);
  assert(context.architecture.engines.length >= 2, 'AI context must list installed engines');
  assert(context.manifest.type === 'music-instrument', 'project type must be music-instrument');

  const aiContextPath = resolve(root, 'docs/AI_CONTEXT.json');
  const existing = JSON.parse(readFileSync(aiContextPath, 'utf8')) as { manifest: { id: string } };
  assert(existing.manifest.id === manifest.id, 'docs/AI_CONTEXT.json out of sync — regenerate');

  console.log('✓ Platform client verified');
  console.log(`  design system: ${dsPkg.version}`);
  console.log(`  engines: ${manifest.engines.join(', ')}`);
  console.log(`  services: ${manifest.services.join(', ')}`);
}

main();
