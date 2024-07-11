import { describe, expect, it } from 'vitest';
import { renderSuspended } from '@nuxt/test-utils/runtime';
import { screen } from '@testing-library/vue';
import Header from '~/components/alex/custom/Header.vue';

describe('Header', () => {
  it('should render a header with no Back Arrow', async () => {
    renderSuspended(Header, {
      props: {
        title: 'Hello world',
        text: 'Botão',
        btnIcon: 'mdi-plus',
        noBackArrow: true,
      },
    });
    const header = await screen.findByTestId('header');
    expect(header).not.toContainEqual('noBackArrow');
  });
});
