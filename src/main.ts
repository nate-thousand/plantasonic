import 'plantasonic-design-system/css/variables.css';
import { initShellTheme } from 'plantasonic-design-system/shell';
import '@/styles/index.scss';
import { bootstrapDocumentTheme } from '@/services/appSettingsStore.ts';
import { createPlantasonicPlatformApp } from '@/platform-consumer/bootstrap.ts';

function renderBootError(container: HTMLElement, error: unknown): void {
  const detail = error instanceof Error ? error.message : String(error);
  container.innerHTML = `
    <div class="ps-boot ps-boot--error" role="alert">
      <strong>Plantasonic could not start</strong>
      <p>${detail.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
      <button type="button" onclick="location.reload()">Reload</button>
    </div>
  `;
}

bootstrapDocumentTheme();
initShellTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

const container = document.querySelector<HTMLDivElement>('#app');

if (!container) {
  throw new Error('Application root element #app not found');
}

createPlantasonicPlatformApp(container).catch((error: unknown) => {
  console.error('[Plantasonic] boot failed:', error);
  renderBootError(container, error);
});
