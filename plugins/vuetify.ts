import { createVuetify } from 'vuetify';

import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const newColors = {
  'primary--2': '#2E74B8',
  'primary--1': '#1B5B98',
  'primary-0': '#001529',
  'primary-1': '#042749',
  'primary-2': '#001A33',
  'secondary--2': '#A3EDF5',
  'secondary--1': '#47D9EB',
  'secondary--0': '#00B7CC',
  'secondary-1': '#008A99',
  'secondary-2': '#005C66',
  white: '#fff',
  black: '#000',
  'gray-blue': '#F1F5F9',
  'gray-100': '#EBEDEF',
  'gray-200': '#D2D6DA',
  'gray-300': '#B9BFC6',
  'gray-400': '#A0A8B1',
  'gray-500': '#8291A1',
  'gray-600': '#6E7A87',
  'gray-700': '#5A636D',
  'gray-800': '#454D54',
  'gray-900': '#30363B',
};

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
            ...newColors,
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
            ...newColors,
          },
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
