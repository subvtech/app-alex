import { describe, expect, it } from 'vitest';
import { renderSuspended } from 'nuxt-vitest/utils';
import { screen } from '@testing-library/vue';
import Header from '~/components/Header.vue';

describe('Header', () => {
  it('should render a header with no Back Arrow', async () => {
    renderSuspended(Header, {
      props: {
        title: 'Hello world',
        text: 'Botão',
        btnIcon: 'mdi-plus',
        // isTerciary: true,
        noBackArrow: true,
      },
    });
    const header = await screen.findByTestId('header');
    // expect(header).toBeDefined();
    // const button = await screen.findByTestId('btn');
    // expect(button.classList.contains('terciary')).toBe(true);
    expect(header).not.toContainEqual('noBackArrow');
  });
});
