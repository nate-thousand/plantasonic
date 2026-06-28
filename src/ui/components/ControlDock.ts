/**
 * Bottom control dock component.
 * Shell only — actual controls will be added in future phases.
 */

export function createControlDock(): HTMLElement {
  const dock = document.createElement('footer');
  dock.className = 'ps-dock';
  dock.id = 'ps-control-dock';
  dock.setAttribute('role', 'contentinfo');
  dock.setAttribute('aria-label', 'Control dock');

  dock.innerHTML = `
    <div class="ps-dock__section">
      <span class="ps-dock__label">Transport</span>
      <button class="btn btn-primary btn-sm" type="button" disabled aria-disabled="true">
        Play
      </button>
      <button class="btn btn-outline-secondary btn-sm" type="button" disabled aria-disabled="true">
        Stop
      </button>
    </div>

    <div class="ps-dock__section">
      <span class="ps-dock__label">Preset</span>
      <span class="text-secondary small">No preset loaded</span>
    </div>

    <div class="ps-dock__section ms-auto">
      <span class="ps-dock__label">Performance</span>
      <span class="text-secondary small">60 fps</span>
    </div>
  `;

  return dock;
}
