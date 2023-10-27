import { describe, expect, it } from 'vitest';
import { renderSuspended } from 'nuxt-vitest/utils';
import { screen } from '@testing-library/vue';
import Checkbox from '../../components/alex/inputs/Checkbox.vue';

describe('Checkbox', () => {
  it('should render a checkbox', async () => {
    renderSuspended(Checkbox, {
      props: {
        label: 'Checkbox',
        hint: '',
        indeterminate: true,
        disabled: false,
        readonly: false,
      },
    });

    const inputCheckbox = await screen.findByTestId('input_da_chris');
    expect(inputCheckbox).toBeDefined();
  });
});
