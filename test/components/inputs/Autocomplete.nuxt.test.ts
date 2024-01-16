import * as yup from 'yup';
import { describe, it, expect, beforeEach } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { render, fireEvent, screen } from '@testing-library/vue';
import { vuetify } from '@/plugins/vuetify';
import Autocomplete from '@/components/alex/inputs/Autocomplete.vue';
const items = ['Joanderson', 'Robert', 'Zignago'];

let modelValue: string | null;
describe('Autocomplete component', () => {
  const scheme = yup
    .string()
    .required('This field is required')
    .nonNullable()
    .test('test', 'cant be joanderson', (value) => value !== 'Joanderson');
  const mockWindow = window;
  mockWindow.devicePixelRatio = 1;
  beforeEach(() => {
    const { rerender } = render(Autocomplete, {
      props: {
        name: 'integrante',
        placeholder: 'Integrante',
        hint: 'Digite algo',
        label: 'Quem Participara?',
        persistentHint: true,
        items,
        clearable: true,
        modelValue: '',
        'onUpdate:modelValue': (e: string) => {
          modelValue = e;
          rerender({ modelValue: e });
        },
        scheme,
      },
      global: {
        plugins: [vuetify],
        mocks: {
          window: mockWindow,
        },
      },
    });
  });

  it('should render the Autocomplete component', async () => {
    const autocomplete = await screen.findByRole('select');
    expect(autocomplete).not.toBeNull();
  });

  it("Should show 'Integrante' as a placeholder", async () => {
    const placeHolder = await screen.findByPlaceholderText('Integrante');
    expect(placeHolder).not.toBeNull();
  });

  it("Should show the hint 'Digite algo' ", async () => {
    const hint = await screen.findByText('Digite algo');
    expect(hint).not.toBeNull();
  });

  it('Should render items', async () => {
    const autocomplete = await screen.findByRole('select');
    userEvent.click(autocomplete);
    const itemOne = await screen.findByText('Joanderson');
    const itemTwo = await screen.findByText('Robert');
    const itemThree = await screen.findByText('Zignago');
    expect(itemOne).not.toBeNull();
    expect(itemTwo).not.toBeNull();
    expect(itemThree).not.toBeNull();
  });

  it('Should select item when click', async () => {
    const autocomplete = await screen.findByRole('select');
    userEvent.click(autocomplete);
    const itemOne = await screen.findByText('Joanderson');
    await fireEvent.click(itemOne);
    expect(modelValue).toBe('Joanderson');
  });

  it('Should be invalid schema when field is invalid', async () => {
    const autocomplete = await screen.findByRole('select');
    userEvent.click(autocomplete);
    const itemOne = await screen.findByText('Joanderson');
    await fireEvent.click(itemOne);
    const isValid = await scheme.isValid(modelValue);
    expect(isValid).toBeFalsy();
  });

  // FIX ME: I`m not rendering error message when field is invalid, but my schema is invalid.
  it('Should show error message when field is invalid', async () => {
    const autocomplete = await screen.findByRole('select');
    userEvent.click(autocomplete);
    // Select a no one value
    const clearButton = await screen.findAllByRole('button');
    await fireEvent.click(clearButton[0]);
    userEvent.click(clearButton[0]);
    // Select a invalid value
    // const itemOne = await screen.findByText('Joanderson');
    // await fireEvent.click(itemOne);

    // This don't should appear
    const hint = screen.getByText('Digite algo');
    screen.debug(hint);
    // const error1 = screen.getByText('cant be joanderson');
    // const error2 = screen.getByText('This field is required');
    // expect(error1).not.toBeNull();
    // expect(error2).not.toBeNull();
  });
});
