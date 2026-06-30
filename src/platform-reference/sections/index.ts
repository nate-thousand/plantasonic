import {
  AI_WORKFLOW_STEPS,
  APP_VERSION,
  EXAMPLE_THEMES,
  NAV,
  PLATFORM_INHERITS,
} from '../catalog.ts';
import { docBlock, escapeHtml, inheritGrid, sectionHeader, workflowDiagram } from '../lib/ui.ts';
import { PLANTASONIC_BRANDING } from '@/platform-consumer/content/branding.ts';

function renderOverview(): string {
  return `
    ${sectionHeader('Platform Overview', PLANTASONIC_BRANDING.platformSubtitle)}
    <div class="alert alert-primary ps-ref-hero mb-4" role="status">
      <div class="ps-ref-equation fw-semibold mb-1">${escapeHtml(PLANTASONIC_BRANDING.platformEquation)}</div>
      <p class="mb-0 small">${escapeHtml(PLANTASONIC_BRANDING.referencePurpose)}</p>
    </div>
    ${docBlock({
      purpose:
        'This application is the official reference implementation of the Plantasonic AI First Application Platform.',
      usage:
        'Explore each section in the sidebar to understand how applications inherit platform capabilities. Launch the Live Instrument to experience the full audiovisual demo.',
      items: [
        'Test and demonstrate engines, design system, themes, AI workflows, templates, and components',
        'Validate future platform features before they ship to consumer applications',
        'Serve as the canonical example for AI-assisted product development',
      ],
    })}
    <h2 class="h5 mb-3">Applications inherit</h2>
    ${inheritGrid(PLATFORM_INHERITS)}
    <div class="row g-3 mt-4">
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <div class="text-muted small mb-1">Version</div>
            <div class="h4 font-monospace mb-0">v${APP_VERSION}</div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <div class="text-muted small mb-1">Sections</div>
            <div class="h4 mb-0">${String(NAV.length)}</div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <div class="text-muted small mb-1">Live demo</div>
            <a href="#instrument" class="btn btn-sm btn-outline-primary" data-route="instrument">Open Instrument →</a>
          </div>
        </div>
      </div>
    </div>`;
}

function renderDesignSystem(): string {
  return `
    ${sectionHeader('Design System', 'Tokens, Bootstrap theme, shell, and instrument UI from plantasonic-design-system.')}
    ${docBlock({
      purpose:
        'Every Plantasonic application consumes the design system — never duplicates tokens or shell infrastructure.',
      usage:
        'Import css/variables.css, initShellTheme(), and SCSS layers from the workspace package.',
      items: [
        'Semantic tokens (--ds-*, --ps-*) generated from tokens/*.json',
        'Bootstrap 5.0.2 bridge with platform components and motion system',
        'Application shell, navigation framework, and instrument workspace',
      ],
    })}
    <div class="table-responsive">
      <table class="table table-sm">
        <thead><tr><th>Layer</th><th>Location</th><th>Owned by</th></tr></thead>
        <tbody>
          <tr><td>CSS variables</td><td><code>plantasonic-design-system/css/variables.css</code></td><td>Design System</td></tr>
          <tr><td>App styles</td><td><code>src/styles/index.scss</code></td><td>This app (imports only)</td></tr>
          <tr><td>Shell config</td><td><code>src/platform-consumer/config/shellConfig.ts</code></td><td>App content</td></tr>
          <tr><td>Visual reference</td><td>DS Showcase (<code>npm run showcase:dev</code> in DS repo)</td><td>Design System</td></tr>
        </tbody>
      </table>
    </div>`;
}

function renderThemeSystem(): string {
  const themeCards = EXAMPLE_THEMES.map((theme) => {
    const badge =
      theme.status === 'active'
        ? '<span class="badge bg-success">Active</span>'
        : theme.status === 'supported'
          ? '<span class="badge bg-info text-dark">Supported</span>'
          : '<span class="badge bg-secondary">Planned</span>';
    return `
      <div class="col-md-6">
        <div class="card h-100 ${theme.status === 'active' ? 'border-success' : ''}">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h3 class="h6 mb-0">${escapeHtml(theme.name)}</h3>
              ${badge}
            </div>
            <p class="small text-muted mb-0">${escapeHtml(theme.description)}</p>
          </div>
        </div>
      </div>`;
  }).join('');

  return `
    ${sectionHeader('Theme System', 'Applications inherit themes from the platform — swap manifests without rewriting UI.')}
    ${docBlock({
      purpose:
        'Demonstrate that the platform supports multiple theme identities while this reference app runs the Default theme.',
      usage:
        'Set theme in ApplicationShellConfig and document theme manifest in platform.json. Do not hardcode hex values in application code.',
      items: [
        'Default — dark/light mode via data-theme and initShellTheme()',
        'Signal 9, Plantasia — supported by platform; not implemented in this reference app',
        'Future Theme — reserved extension point for new platform themes',
      ],
    })}
    <div class="row g-3">${themeCards}</div>
    <p class="small text-muted mt-3 mb-0">
      Theme flash prevention: <code>src/services/appSettingsStore.ts</code> restores user preference before first paint.
    </p>`;
}

function renderComponents(): string {
  return `
    ${sectionHeader('Shared Components', 'Reusable UI from the design system and platform SDK.')}
    ${docBlock({
      purpose:
        'Consumer applications compose platform-provided components — they do not rebuild shell chrome.',
      items: [
        'Layout primitives — stack, grid, cluster, split, layer',
        'Shell components — sidebar, rail, dock, inspector, command palette',
        'Instrument components — transport bar, creative workspace, preset browser',
        'Bootstrap bridge — buttons, forms, cards, dialogs',
      ],
    })}
    <p class="mb-0">Full component catalog: <code>plantasonic-design-system/showcase</code> → Components section.</p>`;
}

function renderTemplates(): string {
  return `
    ${sectionHeader('Templates', 'CLI scaffolds for new Plantasonic applications.')}
    ${docBlock({
      purpose:
        'The design system CLI generates starter projects that already inherit platform architecture.',
      usage:
        'Run from the plantasonic-design-system repository: <code>node cli/index.mjs create &lt;archetype&gt; &lt;name&gt;</code>',
      items: [
        'react-vite, generative-art, audio-app, and other archetypes',
        'Pre-wired shell config, token imports, and platform manifest stub',
        'AI context exports for Cursor and v0',
      ],
    })}`;
}

function renderAudioEngine(): string {
  return `
    ${sectionHeader('Audio Engine', 'plantasia-sound-engine via @plantasonic/platform adapter.')}
    ${docBlock({
      purpose: 'Generative sound synthesis for the living ecosystem metaphor — not a DAW.',
      usage:
        'Mounted only on the Live Instrument route. Platform owns adapter lifecycle and audio-reactive bridge.',
      items: [
        'Package: plantasia-sound-engine (1.0.0-beta.1)',
        'Engine ID: engine.sound',
        'Preset worlds map to engine presets via src/platform-consumer/worldToBundle.ts',
      ],
    })}
    <a href="#instrument" class="btn btn-outline-primary btn-sm" data-route="instrument">Try in Live Instrument →</a>`;
}

function renderAsciiEngine(): string {
  return `
    ${sectionHeader('ASCII Engine', 'ascii-visual-engine via @plantasonic/platform adapter.')}
    ${docBlock({
      purpose: 'Terminal-aesthetic visuals driven by audio and ecological parameters.',
      usage:
        'Paired with the audio engine on the instrument route. Brightness, Density, and world presets shape output.',
      items: [
        'Package: ascii-visual-engine (v0.1.0)',
        'Engine ID: engine.visual',
        'Canvas stage rendered inside creative workspace',
      ],
    })}
    <a href="#instrument" class="btn btn-outline-primary btn-sm" data-route="instrument">Try in Live Instrument →</a>`;
}

function renderVisualEngine(): string {
  return `
    ${sectionHeader('Visual Engine', 'Application-level visual identity taxonomy.')}
    ${docBlock({
      purpose:
        'Creative applications define visual language — glyph families, motion, patterns — consumed by presets and plugins.',
      usage: 'src/visuals/language/ documents identity without modifying engine internals.',
      items: [
        'Glyph families and motion language',
        'Pattern vocabulary aligned with ecological metaphor',
        'World-specific visual plugins via platform plugin manager',
      ],
    })}
    <p class="mb-0">Verify: <code>npm run verify:visual</code></p>`;
}

function renderVideoEngine(): string {
  return `
    ${sectionHeader('Video Engine', 'Platform video and recording capabilities.')}
    ${docBlock({
      purpose:
        'The platform architecture supports video export and capture workflows — Phase 11 (Recording & Sharing) on the roadmap.',
      usage:
        'Applications register video engine plugins through platform.json when the engine package ships.',
      items: [
        'Engine slot: engine.video (platform manifest)',
        'Recording/sharing aligned with creative vision — not decorative export',
        'This reference app documents the slot; implementation follows platform release',
      ],
    })}`;
}

function renderMidi(): string {
  return `
    ${sectionHeader('MIDI', 'Web MIDI performance controls via platform.')}
    ${docBlock({
      purpose:
        'Hardware controllers map to ecological parameters (Bloom, Mold, Chaos) — not synthesis jargon.',
      usage:
        'MIDI routing, learn, and hot-plug are owned by @plantasonic/platform — not reimplemented in consumer apps.',
      items: [
        'Engine ID: engine.midi',
        'CC mapping and MIDI Learn in instrument workspace',
        'Keyboard and touch input also platform-managed',
      ],
    })}
    <a href="#instrument" class="btn btn-outline-primary btn-sm" data-route="instrument">Connect in Live Instrument →</a>`;
}

function renderAiWorkflow(): string {
  return `
    ${sectionHeader('AI Workflow', 'Official toolchain from design to deployed application.')}
    ${docBlock({
      purpose:
        'Plantasonic applications are built AI-first — design tokens and platform boundaries enable reliable automation.',
      usage:
        'Follow this pipeline for new applications. This repo is the output of the final step.',
    })}
    ${workflowDiagram(AI_WORKFLOW_STEPS)}
    <div class="alert alert-secondary mt-4 mb-0 small">
      Each step has authoritative docs in <code>plantasonic-design-system/docs/platform/</code> and <code>docs/product-framework/</code>.
    </div>`;
}

function renderDeveloperTools(): string {
  return `
    ${sectionHeader('Developer Tools', 'Verification and architecture guards for platform consumers.')}
    <div class="table-responsive">
      <table class="table table-sm">
        <thead><tr><th>Script</th><th>Purpose</th></tr></thead>
        <tbody>
          <tr><td><code>npm run validate:app</code></td><td>Assert thin-app architecture</td></tr>
          <tr><td><code>npm run verify:integration</code></td><td>Boot instrument shell in happy-dom</td></tr>
          <tr><td><code>npm run verify:platform-sdk</code></td><td>Platform dependency wiring</td></tr>
          <tr><td><code>npm run verify:design-system</code></td><td>DS integration</td></tr>
          <tr><td><code>npm run verify:presets</code></td><td>World → engine preset mapping</td></tr>
          <tr><td><code>npm run verify:visual</code></td><td>Visual language taxonomy</td></tr>
          <tr><td><code>npm run lint</code> / <code>npm run build</code></td><td>Quality gate before ship</td></tr>
        </tbody>
      </table>
    </div>`;
}

function renderSettings(): string {
  return `
    ${sectionHeader('Settings', 'User preferences and persistence patterns.')}
    ${docBlock({
      purpose:
        'Platform services provide settings, autosave, and notifications — apps supply domain-specific keys.',
      items: [
        'Theme preference — src/services/appSettingsStore.ts (flash prevention)',
        'Platform settings service — key-value persistence via @plantasonic/platform',
        'Interaction preferences — owned by platform on instrument route',
      ],
    })}`;
}

function renderDocumentation(): string {
  return `
    ${sectionHeader('Documentation', 'Authoritative docs for the platform and this reference application.')}
    <div class="row g-2">
      ${[
        ['README.md', 'Project overview and quick start'],
        ['docs/REFERENCE_APP.md', 'Reference application philosophy'],
        ['docs/CREATIVE_VISION.md', 'Creative north star'],
        ['docs/PLATFORM.md', 'Platform manifest'],
        ['ARCHITECTURE.md', 'System design'],
        ['ROADMAP.md', 'Development milestones'],
        ['CHANGELOG.md', 'Release history'],
        ['docs/REPO_BOUNDARIES.md', 'Ecosystem ownership map'],
      ]
        .map(
          ([file, desc]) => `
        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-body py-3">
              <code class="small">${escapeHtml(file)}</code>
              <div class="small text-muted">${escapeHtml(desc)}</div>
            </div>
          </div>
        </div>`,
        )
        .join('')}
    </div>`;
}

function renderInstrument(): string {
  return `
    ${sectionHeader('Live Instrument', 'Full audiovisual reference demo — engines load on this route only.')}
    ${docBlock({
      purpose:
        'Experience the complete Plantasonic ecosystem: five preset worlds, ecological controls, MIDI, and ASCII stage.',
      usage:
        'Click Launch below. Engines initialize via mountInstrumentApp() — the same path as v0.3.0, now lazy-loaded from the platform overview.',
    })}
    <button type="button" class="btn btn-primary btn-lg" id="ps-launch-instrument">Launch Instrument</button>
    <p class="small text-muted mt-3 mb-0">Shortcut: navigate to <code>#instrument</code> or use the sidebar link.</p>`;
}

export type SectionRenderer = () => string;

export const SECTIONS: Record<string, SectionRenderer> = {
  overview: renderOverview,
  'design-system': renderDesignSystem,
  'theme-system': renderThemeSystem,
  components: renderComponents,
  templates: renderTemplates,
  'audio-engine': renderAudioEngine,
  'ascii-engine': renderAsciiEngine,
  'visual-engine': renderVisualEngine,
  'video-engine': renderVideoEngine,
  midi: renderMidi,
  'ai-workflow': renderAiWorkflow,
  'developer-tools': renderDeveloperTools,
  settings: renderSettings,
  documentation: renderDocumentation,
  instrument: renderInstrument,
};

export function renderSection(id: string): string {
  const fn = SECTIONS[id] ?? SECTIONS.overview;
  return fn();
}
