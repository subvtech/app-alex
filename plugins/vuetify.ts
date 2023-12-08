import { createVuetify } from 'vuetify';
import { mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { alexIcons } from 'assets/icons';

export const vuetify = createVuetify({
  components,
  directives,
  defaults,
  display:{
    mobileBreakpoint: 'md'
  },
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

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(vuetify);
});
