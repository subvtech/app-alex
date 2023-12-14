import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/vue';
import { vuetify } from '@/plugins/vuetify';
import Select from '@/components/alex/inputs/Select.vue';

const items = ['Joanderson', 'Robert', 'Zignago'];
let rerenderBind: (props: object) => Promise<void>;
let modelValue: string;
describe('Select component', () => {
  beforeEach(() => {
    const { rerender } = render(Select, {
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
        menuProps: { modelValue: true },
      },
      global: {
        plugins: [vuetify],
      },
    });
    rerenderBind = rerender;
  });

  it('should render the Select component', async () => {
    const select = await screen.findByRole('select');
    expect(select).not.toBeNull();
  });

  it("Should show 'Integrante' as a placeholder", async () => {
    const select = await screen.findByRole('select');
    await fireEvent.focus(select);
    const placeHolder = screen.findByPlaceholderText('Integrante');
    expect(placeHolder).not.toBeNull();
  });

  it("Should show the hint 'Digite algo' ", async () => {
    const hint = await screen.findByText('Digite algo');
    expect(hint).not.toBeNull();
  });

  it('Should render items', async () => {
    const autocomplete = await screen.findByRole('select');
    await fireEvent.focus(autocomplete);
    screen.debug(autocomplete);
    const itemOne = await screen.findByText('Joanderson');
    const itemTwo = await screen.findByText('Robert');
    const itemThree = await screen.findByText('Zignago');
    expect(itemOne).not.toBeNull();
    expect(itemTwo).not.toBeNull();
    expect(itemThree).not.toBeNull();
  });

  it('Should select item when click', async () => {
    const autocomplete = await screen.findByRole('select');
    await fireEvent.focus(autocomplete);
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
