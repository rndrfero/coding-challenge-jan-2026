import { createApp } from 'vue';
import App from './App.vue';
import './assets/tailwind.css';

if (import.meta.env.DEV) {
  import('./mocks/browser').then(({ worker }) => {
    worker.start();
  });
}

createApp(App).mount('#app');

