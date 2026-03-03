import { registerSW } from 'virtual:pwa-register';

// Register the service worker
const updateSW = registerSW({
  onNeedRefresh() {
    // New content available - could trigger UI update
  },
  onOfflineReady() {
    // App is ready to work offline
  },
});

export { updateSW };
