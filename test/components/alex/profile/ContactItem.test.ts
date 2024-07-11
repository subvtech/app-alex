import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { vuetify } from '@/plugins/vuetify';
import ContactItem from '@/components/alex/profile/ContactItem.vue';
// Test suite for ContactItem

describe('BoxItem', () => {
  const contactItemProps = {
    label: 'courses',
    icon: 'mdi-check-circle',
    value: 'value',
  };
  let rerenderBind: (props: object) => Promise<void>;

  beforeEach(() => {
    const { rerender } = render(ContactItem, {
      props: { ...contactItemProps },
      global: {
        plugins: [vuetify, i18n],
      },
    });

    rerenderBind = rerender;
  });

  it('renders the component with the proper value', async () => {
    const valueComponent = await screen.queryByText(contactItemProps.value);
    expect(valueComponent).not.toBeNull();
  });

  it('renders the component with the proper label', async () => {
    const labelComponent = await screen.queryByText(contactItemProps.label);
    expect(labelComponent).not.toBeNull();
  });

  it('renders the component with the proper label', async () => {
    await rerenderBind({ ...contactItemProps, label: 'label2' });
    const labelComponent = await screen.queryByText('label2');
    expect(labelComponent).not.toBeNull();
  });
});
