import 'plantasonic-design-system/css/variables.css';
import '@/styles/index.scss';
import { bootstrapDocumentTheme } from '@/services/appSettingsStore.ts';
import { createPlantasonicApp } from '@/app/index.ts';

bootstrapDocumentTheme();

const container = document.querySelector<HTMLDivElement>('#app');

if (!container) {
  throw new Error('Application root element #app not found');
}

void createPlantasonicApp(container);
