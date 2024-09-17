export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig();

  if (config.public.useMock) {
    const { worker } = await import('~/mocks/browser');

    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: { url: '/mockServiceWorker.js' },
    });
  }
});
