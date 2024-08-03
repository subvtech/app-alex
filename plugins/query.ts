import {
  QueryClient,
  QueryClientConfig,
  VueQueryPlugin,
  VueQueryPluginOptions,
} from '@tanstack/vue-query';
const queryClientConfig: QueryClientConfig = {};
export const queryClient = new QueryClient(queryClientConfig);
export default defineNuxtPlugin(({ vueApp }) => {
  const vueQueryPluginOptions: VueQueryPluginOptions = {
    queryClient,
  };
  vueApp.use(VueQueryPlugin, vueQueryPluginOptions);
});
