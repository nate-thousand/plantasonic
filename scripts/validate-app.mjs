#!/usr/bin/env node
/**
 * Validates the Plantasonic production app is a thin platform consumer.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, '..');
const srcRoot = path.join(appRoot, 'src');

const failures = [];

function walk(dir) {
  const entries = [];
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) entries.push(...walk(full));
    else entries.push(full);
  }
  return entries;
}

const forbiddenDirs = [
  'src/app',
  'src/runtime',
  'src/ui',
  'src/interaction',
  'src/platform',
  'src/audio',
  'src/midi',
  'src/keyboard',
  'src/mouse',
  'src/touch',
];

for (const dir of forbiddenDirs) {
  if (existsSync(path.join(appRoot, dir))) {
    failures.push(`Legacy infrastructure still present: ${dir}`);
  }
}

const mainTs = readFileSync(path.join(srcRoot, 'main.ts'), 'utf8');
if (!mainTs.includes('createPlantasonicPlatformApp')) {
  failures.push('main.ts must bootstrap via createPlantasonicPlatformApp()');
}
if (mainTs.includes('createPlantasonicApp')) {
  failures.push('main.ts must not use legacy createPlantasonicApp()');
}

const packageJson = JSON.parse(readFileSync(path.join(appRoot, 'package.json'), 'utf8'));
for (const dep of [
  '@plantasonic/platform',
  '@plantasonic/platform-types',
  '@plantasonic/platform-demo',
  'plantasonic-design-system',
  'plantasia-sound-engine',
  'ascii-visual-engine',
]) {
  if (!packageJson.dependencies?.[dep]) {
    failures.push(`package.json missing dependency: ${dep}`);
  }
}

const requiredPaths = [
  'src/platform-consumer/bootstrap.ts',
  'src/platform-consumer/appContent.ts',
  'src/platform-consumer/content/presetBundles.ts',
  'src/presets/worlds/index.ts',
];

for (const rel of requiredPaths) {
  if (!existsSync(path.join(appRoot, rel))) {
    failures.push(`Missing required file: ${rel}`);
  }
}

const srcFiles = walk(srcRoot);
for (const file of srcFiles) {
  const rel = path.relative(appRoot, file);
  const content = readFileSync(file, 'utf8');
  if (content.includes('createPlantasonicApp')) {
    failures.push(`${rel} must not reference legacy createPlantasonicApp()`);
  }
  if (content.includes('createRuntime(')) {
    failures.push(`${rel} must not reference legacy createRuntime()`);
  }
}

if (failures.length) {
  console.error('Plantasonic app validation failed:\n');
  for (const failure of failures) console.error(`  ✗ ${failure}`);
  process.exit(1);
}

console.log('Plantasonic app validation passed');
console.log(`  Source files: ${srcFiles.filter((f) => f.endsWith('.ts')).length}`);
console.log('  Architecture: thin platform consumer');
