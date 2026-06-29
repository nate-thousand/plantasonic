/**
 * Tooltip helper — sets title and aria-describedby for accessible tooltips.
 */

export interface TooltipOptions {
  text: string;
  id?: string;
}

/** Applies tooltip attributes to an element (native title + aria). */
export function applyTooltip(element: HTMLElement, options: TooltipOptions): void {
  element.title = options.text;
  if (options.id) {
    element.setAttribute('aria-describedby', options.id);
  }
}
