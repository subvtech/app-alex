import { describe, it, expect, beforeEach } from 'vitest';
import { screen, within, render, fireEvent } from '@testing-library/vue';
import { vuetify } from '@/plugins/vuetify';
import TextFieldComponent from '@/components/alex/inputs/TextField.vue';

let modelValue = 'Test Value';
let rerenderBind: (props: object) => Promise<void>;
describe('TextField component', () => {
  beforeEach(() => {
    const { rerender } = render(TextFieldComponent, {
      props: {
        placeholder: 'johndoe@gmail.com',
        hint: 'Enter your email',
        label: 'Email Input',
        persistentHint: true,
        name: 'test',
        role: 'textfield',
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
    rerenderBind = rerender;
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
    await rerenderBind({ 'error-messages': 'This field is required' });
    const error = await screen.findByText('This field is required');
    const hint = screen.queryByText('Enter your email');
    expect(error).not.toBeNull();
    expect(hint).toBeNull();
  });
});
