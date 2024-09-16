import { ganttastic } from '@infectoone/vue-ganttastic';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ganttastic);
});
