import {
  VueQueryPlugin,
  QueryClient,
  hydrate,
  dehydrate,
  DehydratedState,
  QueryClientConfig,
  VueQueryPluginOptions,
} from '@tanstack/vue-query';
export default defineNuxtPlugin((nuxt) => {
  const vueQueryState = useState<DehydratedState | null>('vue-query');

  const queryClientConfig: QueryClientConfig = {
    defaultOptions: { queries: {} },
  };
  const queryClient = new QueryClient(queryClientConfig);
  const vueQueryPluginOptions: VueQueryPluginOptions = {
    queryClient,
  };
  nuxt.vueApp.use(VueQueryPlugin, vueQueryPluginOptions);

  if (import.meta.server) {
    nuxt.hooks.hook('app:rendered', () => {
      vueQueryState.value = dehydrate(queryClient);
    });
  }

  if (import.meta.client) {
    hydrate(queryClient, vueQueryState.value);
  }
  return {
    provide: {
      queryClient,
    },
  };
});
