import { describe, expect, it } from 'vitest';
import { renderSuspended } from '@nuxt/test-utils/runtime';
import { screen } from '@testing-library/vue';
import Checkbox from '../../components/alex/inputs/Checkbox.vue';

describe('Checkbox', () => {
  // it('should render a checkbox', async () => {
  //   renderSuspended(Checkbox, {
  //     props: {
  //       label: 'Checkbox',
  //       hint: '',
  //       indeterminate: true,
  //       disabled: false,
  //       readonly: false,
  //     },
  //   });

  //   const inputCheckbox = await screen.findByTestId('testing-checkbox');
  //   expect(inputCheckbox).toBeDefined();
  // });

  // it('should render a checkbox that is indeterminate', async () => {
  //   renderSuspended(Checkbox, {
  //     props: {
  //       label: 'Checkbox',
  //       hint: 'H',
  //       indeterminate: true,
  //     },
  //   });

  //   const inputCheckbox = await screen.findByTestId('testing-checkbox');
  //   expect(inputCheckbox.classList.contains('input-checkbox')).toBe(true);
  // });

  it('should render a checkbox that is disabled', async () => {
    renderSuspended(Checkbox, {
      props: {
        label: 'Checkbox',
        hint: 'H',
        disabled: true,
      },
    });

    const inputCheckbox = await screen.findByTestId('testing-checkbox');
    expect(inputCheckbox.getAttribute('disabled')).toBe('true');
  });
});