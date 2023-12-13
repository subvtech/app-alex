import { ThemeDefinition } from 'vuetify';

export const AlexThemeColors = {
  'primary--2': '#2E74B8',
  'primary--1': '#1B5B98',
  'primary-0': '#001529',
  'primary-1': '#042749',
  'primary-2': '#001A33',
  'secondary--2': '#D1F6FA',
  'secondary--1': '#75E3F0',
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
  'success--2': '#BFF2D6',
  'success--1': '#40D984',
  'success-0': '#26BF6B',
  'success-1': '#1E9553',
  'success-2': '#156A3B',
  'error--2': '#F9D1D1',
  'error--1': '#EE7777',
  'error-0': '#E9494A',
  'error-1': '#E31B1D',
  'error-2': '#B61617',
  'warning--2': '#FFE5CC',
  'warning--1': '#FFB166',
  'warning-0': '#FF9733',
  'warning-1': '#FF7D00',
  'warning-2': '#CC6400',
  'info--2': '#CCEEFF',
  'info--1': '#66CCFF',
  'info-0': '#33BBFF',
  'info-1': '#00AAFF',
  'info-2': '#0088CC',
  'tag-green-light': '#72E38B',
  'tag-orange-light': '#FFB775',
  'tag-yellow-light': '#FFE660',
  'tag-red-light': '#FF8484',
  'tag-blue-light': '#9EBBDA',
};
export type AlexColors = keyof typeof AlexThemeColors;
// String that represents the name of the theme I am using
export const MAIN_THEME = 'mainTheme';
// Light mode theme
export const mainTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: AlexThemeColors['primary-2'],
    accent: AlexThemeColors['secondary-0'],
    secondary: AlexThemeColors['gray-blue'],
    info: AlexThemeColors['info-0'],
    warning: AlexThemeColors['warning-0'],
    error: AlexThemeColors['error-0'],
    success: AlexThemeColors['success-0'],
    ...AlexThemeColors,
  },
};

// String that represents the name of the dark theme I am using
export const MAIN_DARK_THEME = 'mainDarkTheme';
// Dark mode theme
export const mainDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: AlexThemeColors['gray-blue'],
    accent: AlexThemeColors['secondary-0'],
    secondary: AlexThemeColors['primary-2'],
    warning: AlexThemeColors['warning-0'],
    error: AlexThemeColors['error-0'],
    success: AlexThemeColors['success-0'],
    ...AlexThemeColors,
  },
};
