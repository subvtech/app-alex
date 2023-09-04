import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/vue';

import { renderSuspended } from 'nuxt-vitest/utils';
import Login from '~/login/index.vue';

describe('Login', () => {
  it(`should show 'Bem vindo ao projeto ALEX!`, async () => {
    await renderSuspended(Login);
    expect(screen.getAllByText('Bem vindo a plataforma ALEX!')).toBeDefined();
  });
});
