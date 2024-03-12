import { describe, it, expect } from 'vitest';
import { renderSuspended } from '@nuxt/test-utils/runtime';
import { screen, within, configure, fireEvent } from '@testing-library/vue';
import { vuetify } from '../../plugins/vuetify';

import Pagination from '../../components/alex/custom/Pagination.vue';

configure({
  testIdAttribute: 'data-test',
});

describe('Pagination component', () => {
  it('should render a pagination', async () => {
    renderSuspended(Pagination, {
      props: {
        length: 10,
      },
      global: {
        plugins: [vuetify],
      },
    });
    const component = await screen.findByTestId('v-pagination-root');
    expect(component).toBeDefined();
  });

  it('should render Pagination with 10 buttons', async () => {
    const component = await screen.findByTestId('v-pagination-root');
    const buttons =
      await within(component).findAllByTestId('v-pagination-item');
    expect(buttons).toHaveLength(10);
  });

  it('A button should receive the active class when clicked and should lose it when another button is clicked', async () => {
    const clickedButton = 3;
    const component = await screen.findByTestId('v-pagination-root');
    const buttons =
      await within(component).findAllByTestId('v-pagination-item');
    await fireEvent.click(
      await within(buttons[clickedButton]).findByRole('button'),
    );
    expect(buttons[clickedButton].getAttribute('class')).toContain(
      'v-pagination__item--is-active',
    );
    await fireEvent.click(await within(buttons[2]).findByRole('button'));
    expect(buttons[clickedButton].getAttribute('class')).not.toContain(
      'v-pagination__item--is-active',
    );
  });
});
