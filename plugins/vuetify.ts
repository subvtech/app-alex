import ptBR from 'date-fns/locale/pt-BR';
import enUS from 'date-fns/locale/en-US';
import { createVuetify } from 'vuetify';
import { mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { alexIcons } from 'assets/icons';
import DateFnsAdapter from '@date-io/date-fns';

export const vuetify = createVuetify({
  locale: { locale: 'pt' },
  date: {
    adapter: DateFnsAdapter,
    locale: {
      pt: ptBR,
      en: enUS,
    },
  },
  components,
  directives,
  defaults,
  display: {
    mobileBreakpoint: 'md',
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
