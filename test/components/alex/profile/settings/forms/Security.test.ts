import { describe, it, expect, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import * as yup from 'yup';
import { vuetify } from '@/plugins/vuetify';
import SecurityFormComponent from '@/components/alex/profile/settings/forms/security.vue';
// Test suite for SecurityFormComponent

describe('SecurityForm', () => {
  const securityProps = {
    label: 'label',
    value: 'value',
    placeholder: 'placeholder',
    isPassword: false,
    buttonText: 'btn-text',
    schema: yup.string(),
  };

  let rerenderBind: (props: object) => Promise<void>;
  let emittedBind: {
    <T = unknown>(): Record<string, T[]>;
    <T = unknown>(name?: string | undefined): T[];
  };

  beforeEach(() => {
    const { rerender, emitted } = render(SecurityFormComponent, {
      props: { ...securityProps },
      global: {
        plugins: [vuetify],
      },
    });

    emittedBind = emitted;
    rerenderBind = rerender;
  });

  it('renders the component with the proper label', async () => {
    const labelComponent = await screen.queryByText(securityProps.label);
    expect(labelComponent).not.toBeNull();
  });

  it('renders the component with the updated proper label', async () => {
    await rerenderBind({ ...securityProps, label: 'label2' });
    const labelComponent = await screen.queryByText('label2');
    expect(labelComponent).not.toBeNull();
  });

  it('renders the component with the proper value', async () => {
    const valueComponent = await screen.queryByDisplayValue(
      securityProps.value,
    );
    expect(valueComponent).not.toBeNull();
  });

  it('renders the component with the proper btn text', async () => {
    const btnComponent = await screen.queryByText(securityProps.buttonText);
    expect(btnComponent).not.toBeNull();
  });

  it('renders the component with the proper placeholder', async () => {
    const placeholder = await screen.queryByPlaceholderText(
      securityProps.placeholder,
    );
    expect(placeholder).not.toBeNull();
  });

  it('emits "click" when button is clicked', async () => {
    const btnComponent = await screen.queryByText(securityProps.buttonText);
    expect(btnComponent).not.toBeNull();
    // Simulate button click
    await fireEvent.click(btnComponent!);

    // Check if "click" event has been emitted
    expect(emittedBind()).toHaveProperty('click');
    expect(emittedBind().click[0]).toEqual([]); // Check the emitted value
  });
});
