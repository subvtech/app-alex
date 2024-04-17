import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { createI18n } from 'vue-i18n';
import { vuetify } from '@/plugins/vuetify';
import ptRules from '@/assets/locales/pt/components/appGeneralBoxes.json';
import enRules from '@/assets/locales/en/components/appGeneralBoxes.json';
import BoxItemComponent from '@/components/alex/profile/BoxItem.vue';
// Test suite for BoxItemComponent

describe('BoxItem', () => {
  const i18n = createI18n({
    messages: {
      pt: {
        components: {
          appGeneralBoxes: ptRules,
        },
      },
      en: {
        components: {
          appGeneralBoxes: enRules,
        },
      },
    },
    locale: 'pt',
    legacy: false,
    missingWarn: false,
    globalInjection: true,
  });
  const boxItemProps = {
    label: 'courses',
    icon: 'mdi-check-circle',
    number: 4,
  };
  let rerenderBind: (props: object) => Promise<void>;

  function getLabel(label, number) {
    return number === 1 ? ptRules[label].singular : ptRules[label].plural;
  }

  beforeEach(() => {
    const { rerender } = render(BoxItemComponent, {
      props: { ...boxItemProps },
      global: {
        plugins: [vuetify, i18n],
      },
    });

    rerenderBind = rerender;
  });

  it('renders the component with the proper number', async () => {
    const numberComponent = await screen.queryByText(boxItemProps.number);
    expect(numberComponent).not.toBeNull();
  });

  it('renders the component with the proper label', async () => {
    const labelComponent = await screen.queryByText(
      getLabel(boxItemProps.label, boxItemProps.number),
    );
    expect(labelComponent).not.toBeNull();
  });

  it('renders the component with the default number', async () => {
    await rerenderBind({ ...boxItemProps, number: undefined });
    const numberComponent = await screen.queryByText('0');
    expect(numberComponent).not.toBeNull();
  });

  it('renders the component with the proper label', async () => {
    const labelComponent = await screen.queryByText(
      getLabel(boxItemProps.label, 0),
    );
    expect(labelComponent).not.toBeNull();
  });
});
