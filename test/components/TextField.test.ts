import { describe, it, expect } from 'vitest';
import { renderSuspended } from 'nuxt-vitest/utils';
import { screen, within, render, fireEvent } from '@testing-library/vue';
import { vuetify } from '../../plugins/vuetify';

import TextFieldComponent from '../../components/Alex/inputs/TextField.vue';
let modelValue = 'Test Value';
describe('TextField component', () => {
  const { rerender } = render(TextFieldComponent, {
    props: {
      placeholder: 'johndoe@gmail.com',
      hint: 'Enter your email',
      label: 'Email Input',
      persistentHint: true,
      modelValue: '',
      'onUpdate:modelValue': (e) => {
        modelValue = e;
        rerender({ modelValue: e });
      },
    },
    global: {
      plugins: [vuetify],
    },
  });
  it('should render the TextField component', async () => {
    const textfield = await screen.findByRole('textfield');
    expect(textfield).not.toBeNull();
  });

  it('Should change the v-model value as the user types', async () => {
    const input = await screen.findByPlaceholderText('johndoe@gmail.com');
    await fireEvent.update(input, 'alex@gmail.com');
    expect(modelValue).toBe('alex@gmail.com');
  });

  it("Should show 'johndoe@gmail.com' as a placeholder", async () => {
    const textfield = await screen.findByRole('textfield');
    const placeHolder =
      await within(textfield).findByPlaceholderText('johndoe@gmail.com');
    expect(placeHolder).not.toBeNull();
  });

  it("Should show the hint 'Enter your email' ", async () => {
    const hint = await screen.findByText('Enter your email');
    expect(hint).not.toBeNull();
  });

  it('Should show the error message instead of the hint message', async () => {
    await rerender({ 'error-messages': 'This field is required' });
    const error = await screen.findByText('This field is required');
    const hint = await screen.queryByText('Enter your email');
    expect(error).not.toBeNull();
    expect(hint).toBeNull();
  });
});