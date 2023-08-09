import { createVuetify } from 'vuetify';

import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#001529',
            accent: '#00B8CC',
            secondary: '#F1F5F9',
            info: '#26A69A',
            warning: '#FFC107',
            error: '#DD2C00',
            success: '#00E676',
          },
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
