import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import Login from '../../pages/login/index.vue';

describe('Login', () => {
  it(`should show 'Bem vindo ao projeto ALEX!`, () => {
    const wrapper = mount(Login);
    expect(wrapper).toContain('Bem vindo ao projeto ALEX!');
  });
});
