import { createVuetify } from 'vuetify';
import { mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { alexIcons } from 'assets/icons';

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    aliases,
    components,
    directives,
    defaults,
    theme: {
      defaultTheme: MAIN_THEME,
      themes: {
        mainTheme,
        mainDarkTheme,
      },
    },
    icons: {
      defaultSet: 'mdi',
      sets: {
        mdi,
        alex: alexIcons,
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
