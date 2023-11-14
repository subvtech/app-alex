import { describe, it, expect } from 'vitest';
import { renderSuspended } from 'nuxt-vitest/utils';
import { screen, within } from '@testing-library/vue';
import { vuetify } from '../../plugins/vuetify';

import RadioButtonComponent from '../../components/Alex/inputs/radio-button.vue';

describe('Pagination component', () => {
  it('should render the radio button component', async () => {
    renderSuspended(RadioButtonComponent, {
      props: {
        buttons: [
          {
            label: 'Opção 1',
            value: '1',
            hint: 'hint opção 1',
          },
          {
            label: 'Opção 2',
            value: '2',
            hint: 'hint opção 2',
          },
          {
            label: 'Opção 3',
            value: '3',
            disabled: true,
            hint: 'hint opção 3',
          },
          {
            label: 'Opção 4',
            value: '4',
            hint: 'hint opção 4',
          },
        ],
      },
      global: {
        plugins: [vuetify],
      },
    });
    const radiogroup = await screen.findByRole('radiogroup');
    expect(radiogroup).not.toBeNull();
  });

  it('should have 4 buttons', async () => {
    const radiogroup = await screen.findByRole('radiogroup');
    const buttons = await within(radiogroup).findAllByRole('button-radio');
    expect(buttons).toHaveLength(4);
  });

  it("Should have a hint with the text 'hint opção 3' ", async () => {
    const radiogroup = await screen.findByRole('radiogroup');
    const hint = await within(radiogroup).findByText('hint opção 3');
    expect(hint).not.toBeNull();
  });
});
