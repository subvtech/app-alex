import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/vue';
import { vuetify } from '@/plugins/vuetify';
import Autocomplete from '@/components/alex/inputs/Autocomplete.vue';

const items = [
  'Joanderson',
  'Robert',
  'Zignago',
  'Eliezir',
  'Cris',
  'Angelo',
  'Berta',
  'Breno',
  'Luiz',
];
let rerenderBind;
describe('Autocomplete component', () => {
  beforeEach(() => {
    const { rerender } = render(Autocomplete, {
      props: {
        name: 'integrante',
        placeholder: 'Integrante',
        hint: 'Digite algo',
        label: 'Quem Participara?',
        persistentHint: true,
        items,
      },
      global: {
        plugins: [vuetify],
      },
    });
    rerenderBind = rerender;
  });

  it('should render the Autocomplete component', async () => {
    const autocomplete = await screen.findByRole('select');
    expect(autocomplete).not.toBeNull();
  });

  it("Should show 'Integrante' as a placeholder", async () => {
    const autocomplete = await screen.findByRole('select');
    await fireEvent.focus(autocomplete);
    const placeHolder = screen.findByPlaceholderText('Integrante');
    expect(placeHolder).not.toBeNull();
  });

  it("Should show the hint 'Digite algo' ", async () => {
    const hint = await screen.findByText('Digite algo');
    expect(hint).not.toBeNull();
  });

  it('Should show the error message instead of the hint message', async () => {
    rerenderBind({ 'error-messages': 'This field is required' });
    const error = await screen.findByText('This field is required');
    expect(error).not.toBeNull();
  });
});
