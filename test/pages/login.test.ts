import { describe, it, expect } from 'vitest';

import { renderSuspended } from '@nuxt/test-utils/runtime';
import { vuetify } from '~/plugins/vuetify';
import { createI18n } from 'vue-i18n';
import Login from '@/pages/login/index.vue';
import ptRules from '@/assets/locales/pt/rules.json';
import ptLogin from '@/assets/locales/pt/pages/login.json';
import enRules from '@/assets/locales/en/rules.json';
import enLogin from '@/assets/locales/en/pages/login.json';
describe('Login', () => {
  const i18n = createI18n({
    messages: {
      pt: { ptRules, ptLogin },
      en: { enRules, enLogin },
    },
    locale: 'pt',
    legacy: false,
    missingWarn: false,
    globalInjection: true,
  });

  it('Login should be defined', async () => {
    const loginComponent = await renderSuspended(Login, {
      attrs: {},
      global: {
        plugins: [vuetify, i18n],
      },
    });

    const login = await loginComponent.queryAllByTestId('login');
    console.log({ login: login.length });
    expect(login).not.toBeNull();
    loginComponent.unmount();
  });

  it(`should show 'Bem-vindo a plataforma Alex!'`, async () => {
    const loginComponent = await renderSuspended(Login, {
      attrs: {},
      global: {
        plugins: [vuetify, i18n],
      },
    });
    expect(
      loginComponent.getAllByText('Bem-vindo a plataforma Alex!'),
    ).toBeDefined();
  });

  it(`should show 'Acesse sua conta e continue com seus estudos'`, async () => {
    const loginComponent = await renderSuspended(Login, {
      attrs: {},
      global: {
        plugins: [vuetify, i18n],
      },
    });
    expect(
      loginComponent.getAllByText(
        'Acesse sua conta e continue com seus estudos',
      ),
    ).toBeDefined();
  });
});
