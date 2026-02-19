import { registerSW } from 'virtual:pwa-register';

// Register the service worker
const updateSW = registerSW({
  onNeedRefresh() {
    // We could trigger a toast or UI update here
    console.log('New content available. Reload to update.');
  },
  onOfflineReady() {
    console.log('App is ready to work offline.');
  },
});

export { updateSW };
