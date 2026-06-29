/**
 * Renderer abstraction — documents future backend support.
 * Canvas is the only live renderer; others are not implemented.
 */

import type { RendererId } from '../language/types.ts';

export interface RendererCapabilities {
  id: RendererId;
  label: string;
  status: 'live' | 'planned';
  description: string;
  supportsTrails: boolean;
  supportsGlyphs: boolean;
  supportsExport: boolean;
}

/** Registered renderer backends and their status. */
export const RENDERER_REGISTRY: Record<RendererId, RendererCapabilities> = {
  canvas: {
    id: 'canvas',
    label: 'Canvas 2D',
    status: 'live',
    description: 'Default ASCII renderer via HTML Canvas — used by ascii-visual-engine.',
    supportsTrails: true,
    supportsGlyphs: true,
    supportsExport: true,
  },
  webgl: {
    id: 'webgl',
    label: 'WebGL',
    status: 'planned',
    description: 'GPU-accelerated glyph rendering for high-density scenes.',
    supportsTrails: true,
    supportsGlyphs: true,
    supportsExport: true,
  },
  pixi: {
    id: 'pixi',
    label: 'PixiJS',
    status: 'planned',
    description: '2D WebGL sprite batching for particle-heavy presets.',
    supportsTrails: true,
    supportsGlyphs: true,
    supportsExport: true,
  },
  three: {
    id: 'three',
    label: 'Three.js',
    status: 'planned',
    description: '3D glyph fields and camera movement.',
    supportsTrails: false,
    supportsGlyphs: true,
    supportsExport: true,
  },
  terminal: {
    id: 'terminal',
    label: 'Terminal',
    status: 'planned',
    description: 'Plain-text output for CLI and headless export.',
    supportsTrails: false,
    supportsGlyphs: true,
    supportsExport: true,
  },
  svg: {
    id: 'svg',
    label: 'SVG',
    status: 'planned',
    description: 'Vector glyph output for print and design tools.',
    supportsTrails: false,
    supportsGlyphs: true,
    supportsExport: true,
  },
};

/**
 * Contract for future renderer adapters.
 * PlantasiaAsciiAdapter implements this indirectly via ascii-visual-engine.
 */
export interface VisualRendererAdapter {
  readonly id: RendererId;
  init(mount: HTMLElement, width: number, height: number): Promise<void>;
  resize(width: number, height: number): void;
  setControl(name: string, value: number): void;
  destroy(): Promise<void>;
}

/** Resolves quality preset from viewport dimensions. */
export function resolveQualityForViewport(
  width: number,
  height: number,
): 'ultra' | 'high' | 'medium' | 'low' | 'batterySaver' {
  const pixels = width * height;
  if (width < 480 || height < 320) return 'low';
  if (width < 768) return 'medium';
  if (pixels > 1920 * 1080) return 'high';
  return 'medium';
}
