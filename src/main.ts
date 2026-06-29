import 'plantasonic-design-system/css/variables.css';
import { initShellTheme } from 'plantasonic-design-system/shell';
import '@/styles/index.scss';
import { bootstrapDocumentTheme } from '@/services/appSettingsStore.ts';
import { createPlantasonicApp } from '@/app/index.ts';

bootstrapDocumentTheme();
initShellTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

const container = document.querySelector<HTMLDivElement>('#app');

if (!container) {
  throw new Error('Application root element #app not found');
}

void createPlantasonicApp(container);
