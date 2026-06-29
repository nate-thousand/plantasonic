/** Updates the live runtime status pill injected into the design-system top bar. */
export function setNavStatus(status: string): void {
  const el = document.querySelector('#ps-runtime-status');
  if (el) el.textContent = status;
}
