import { describe, it, expect, beforeEach } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { render, fireEvent, screen } from '@testing-library/vue';
import { vuetify } from '@/plugins/vuetify';
import Autocomplete from '@/components/alex/inputs/Autocomplete.vue';
const items = ['Joanderson', 'Robert', 'Zignago'];
let rerenderBind: (props: object) => Promise<void>;
let modelValue: string | null | undefined;
describe('Autocomplete component', () => {
  beforeEach(() => {
    const mockWindow = window;
    mockWindow.devicePixelRatio = 1;
    const { rerender } = render(Autocomplete, {
      props: {
        name: 'integrante',
        placeholder: 'Integrante',
        hint: 'Digite algo',
        label: 'Quem Participara?',
        persistentHint: true,
        items,
        modelValue: '',
        'onUpdate:modelValue': (e) => {
          modelValue = e;
          rerender({ modelValue: e });
        },
      },
      global: {
        plugins: [vuetify],
        mocks: {
          window: mockWindow,
        },
      },
    });
    rerenderBind = rerender;
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

  it('Should show the error message instead of the hint message', async () => {
    rerenderBind({ 'error-messages': 'This field is required' });
    const error = await screen.findByText('This field is required');
    expect(error).not.toBeNull();
  });
});
