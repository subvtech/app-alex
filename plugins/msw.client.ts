export default defineNuxtPlugin(async () => {
  if (process.env.USE_MOCK) {
    const { worker } = await import('~/mocks/browser');

    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: { url: '/mockServiceWorker.js' },
    });
  }
});
