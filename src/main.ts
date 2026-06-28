import '@/styles/index.scss';
import { createPlantasonicApp } from '@/app/index.ts';

const container = document.querySelector<HTMLDivElement>('#app');

if (!container) {
  throw new Error('Application root element #app not found');
}

void createPlantasonicApp(container);
