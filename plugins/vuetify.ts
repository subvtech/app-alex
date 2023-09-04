import { createVuetify } from 'vuetify';
import { mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { alexIcons } from 'assets/icons';

const newColors = {
  'primary--2': '#2E74B8',
  'primary--1': '#1B5B98',
  'primary-0': '#001529',
  'primary-1': '#042749',
  'primary-2': '#001A33',
  'secondary--2': '#A3EDF5',
  'secondary--1': '#47D9EB',
  'secondary-0': '#00B7CC',
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
  'success--2': '#6AE19F',
  'success--1': '#40D984',
  'success-0': '#26BF6B',
  'success-1': '#1E9553',
  'success-2': '#156A3B',
  'error--2': '#F4A4A4',
  'error--1': '#EE7777',
  'error-0': '#E9494A',
  'error-1': '#E31B1D',
  'error-2': '#B61617',
  'warning--2': '#FFCB99',
  'warning--1': '#FFB166',
  'warning-0': '#FF9733',
  'warning-1': '#FF7D00',
  'warning-2': '#CC6400',
  'info--2': '#99DDFF',
  'info--1': '#66CCFF',
  'info-0': '#33BBFF',
  'info-1': '#00AAFF',
  'info-2': '#0088CC',
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
