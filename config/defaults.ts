import { DefaultsInstance } from 'vuetify/lib/framework.mjs';
import { VBtn } from 'vuetify/components';

const VBtnPrimary = {
  flat: true,
  rounded: 'lg',
  color: 'secondary-0',
};

export const defaults: DefaultsInstance = {
  VTextField: {
    variant: 'outlined',
    rounded: 'lg',
  },
  VBreadcrumbs: {
    VBreadcrumbsDivider: {
      style: 'padding: 0',
    },
  },
  VChip: { rounded: 'lg' },
  VBtn: VBtnPrimary,
  VBtnSecondary: {
    ...VBtnPrimary,
    color: 'gray-blue',
    class: ['text-gray-600'],
  },
  VBtnTertiary: {
    ...VBtnPrimary,
    variant: 'outlined',
    color: 'primary-2',
    class: ['text-gray-600'],
  },
  VBtnError: { ...VBtnPrimary, color: 'error-0', class: ['text-white'] },
  VBtnInfo: { ...VBtnPrimary, color: 'info-0', class: ['text-white'] },
  VBtnWarning: { ...VBtnPrimary, color: 'warning-0', class: ['text-white'] },
  VBtnSuccess: { ...VBtnPrimary, color: 'success-0', class: ['text-white'] },
};

export const aliases = {
  VBtnSecondary: VBtn,
  VBtnTertiary: VBtn,
  VBtnError: VBtn,
  VBtnWarning: VBtn,
  VBtnInfo: VBtn,
  VBtnSuccess: VBtn,
};
