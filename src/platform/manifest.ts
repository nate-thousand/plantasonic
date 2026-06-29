/**
 * Platform manifest — authoritative project metadata for the creative ecosystem.
 * Kept in sync with root `platform.json` (verify: npm run verify:platform).
 */
import type { ProjectManifest } from 'plantasonic-design-system/platform/types';
import raw from '../../platform.json';

export const platformManifest = raw as ProjectManifest;
