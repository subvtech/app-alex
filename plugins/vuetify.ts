import { createVuetify } from 'vuetify';

import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    defaults: {
      VTextField: {
        variant: 'outlined',
        rounded: 'lg',
      },
    },
    components,
    directives,
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#001529',
            accent: '#00B8CC',
            secondary: '#F1F5F9',
            info: '#26A69A',
            warning: '#FFC107',
            error: '#FF5252',
            success: '#38C976',
          },
        },
        dark: {
          dark: true,
          colors: {
            primary: '#F1F5F9',
            accent: '#00B8CC',
            secondary: '#001529',
            warning: '#FCC132',
            error: '#FF5252',
            success: '#38C976',
          },
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
