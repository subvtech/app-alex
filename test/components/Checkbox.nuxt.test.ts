import { describe, expect, it } from 'vitest';
import { mountSuspended } from 'nuxt-vitest/utils';
import { screen } from '@testing-library/vue';
import Checkbox from '../../components/alex/inputs/Checkbox.vue';

describe('Checkbox', () => {
  it('should render a true checkbox', () => {
    mountSuspended(Checkbox, {
      props: {
        value: true,
        indeterminate: true,
        label: 'Checkbox',
      },
      
    });


    const inputCheckbox = screen.getByTestId('input_da_chris')
    expect(inputCheckbox).toHaveClass('input-checkbox')
  });
});
