import { describe, it, expect } from 'vitest';
import { renderSuspended } from 'nuxt-vitest/utils';
import { screen, within, fireEvent } from '@testing-library/vue';
import { vuetify } from '../../plugins/vuetify';

import RadioButtonComponent from '../../components/Alex/inputs/RadioButton.vue';
let model = 'Test Value';

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
        'onUpdate:modelValue': (e) => (model = e),
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
  it('Should set the v-model value to 2', async () => {
    const radiogroup = await screen.findAllByRole('radiogroup');
    const button = await within(radiogroup[0]).findByLabelText('Opção 2');
    await fireEvent.click(button);
    expect(model).toBe('2');
  });
});
