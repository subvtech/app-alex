export default defineNuxtPlugin(async () => {
  if (process.env.NODE_ENV === 'development') {
    const { worker } = await import('~/mocks/browser');

    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: { url: '/mockServiceWorker.js' },
    });
  }
});
