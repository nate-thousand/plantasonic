export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function sectionHeader(title: string, subtitle: string): string {
  return `
    <header class="ps-ref-header mb-4">
      <h1 class="h3 mb-1">${escapeHtml(title)}</h1>
      <p class="text-muted mb-0">${escapeHtml(subtitle)}</p>
    </header>`;
}

export function docBlock(opts: { purpose: string; usage?: string; items?: string[] }): string {
  const list =
    opts.items && opts.items.length
      ? `<ul class="mb-0">${opts.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
      : '';
  return `
    <div class="card mb-4 ps-ref-doc">
      <div class="card-body">
        <p class="mb-2"><strong>Purpose.</strong> ${escapeHtml(opts.purpose)}</p>
        ${opts.usage ? `<p class="mb-2"><strong>Usage.</strong> ${escapeHtml(opts.usage)}</p>` : ''}
        ${list}
      </div>
    </div>`;
}

export function workflowDiagram(steps: ReadonlyArray<{ label: string; detail: string }>): string {
  return `
    <div class="ps-ref-workflow" role="list" aria-label="AI workflow">
      ${steps
        .map(
          (step, index) => `
        <div class="ps-ref-workflow__step" role="listitem">
          <div class="ps-ref-workflow__node">
            <div class="fw-semibold">${escapeHtml(step.label)}</div>
            <div class="small text-muted">${escapeHtml(step.detail)}</div>
          </div>
          ${index < steps.length - 1 ? '<div class="ps-ref-workflow__arrow" aria-hidden="true">↓</div>' : ''}
        </div>`,
        )
        .join('')}
    </div>`;
}

export function inheritGrid(items: ReadonlyArray<string>): string {
  return `
    <div class="row g-2">
      ${items
        .map(
          (item) => `
        <div class="col-sm-6 col-lg-4">
          <div class="card h-100 ps-ref-inherit-card">
            <div class="card-body py-3">
              <span class="badge bg-secondary me-2">inherits</span>
              <span class="fw-medium">${escapeHtml(item)}</span>
            </div>
          </div>
        </div>`,
        )
        .join('')}
    </div>`;
}
