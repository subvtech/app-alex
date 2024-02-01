import { describe, it, expect, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { createI18n } from 'vue-i18n';
import { vuetify } from '@/plugins/vuetify';
import SocialsComponent from '@/components/alex/profile/cards/Socials.vue';
import ptSocialsRules from '@/assets/locales/pt/components/profile/socials.json';
import enSocialsRules from '@/assets/locales/en/components/profile/socials.json';

import ptCardRules from '@/assets/locales/pt/components/card.json';
import enCardRules from '@/assets/locales/en/components/card.json';

import ptGeneralRules from '@/assets/locales/pt/components/profile/general.json';
import enGeneralRules from '@/assets/locales/en/components/profile/general.json';
// Test suite for SocialsComponent

describe('SocialsComponent', () => {
  // Test case: Renders the component with title and description
  const i18n = createI18n({
    messages: {
      pt: {
        components: {
          profile: {
            general: ptGeneralRules,
            socials: ptSocialsRules,
          },
          ...ptCardRules,
        },
      },
      en: {
        components: {
          profile: {
            general: enGeneralRules,
            socials: enSocialsRules,
          },
          ...enCardRules,
        },
      },
    },
    locale: 'pt',
    legacy: false,
    missingWarn: false,
    globalInjection: true,
  });

  const socialsProps = {
    socials: [
      {
        id: 0,
        url: 'google.com',
        name: 'name',
      },
    ],
    canEdit: true,
    userId: 0,
  };
  let component: Element;
  let rerenderBind: (props: object) => Promise<void>;
  let emittedBind: {
    <T = unknown>(): Record<string, T[]>;
    <T = unknown>(name?: string | undefined): T[];
  };
  beforeEach(() => {
    const { emitted, rerender, container } = render(SocialsComponent, {
      props: { ...socialsProps },
      global: {
        plugins: [vuetify, i18n],
      },
    });
    component = container;
    rerenderBind = rerender;
    emittedBind = emitted;
  });

  it('renders the component with the proper title', async () => {
    const titleComponent = await screen.queryByText(ptSocialsRules.title);

    expect(titleComponent).not.toBeNull();
  });

  it('renders the component with the empty message', async () => {
    await rerenderBind({ ...socialsProps, socials: [] });

    const emptyComponent = await screen.queryByText(ptSocialsRules.empty);

    expect(emptyComponent).not.toBeNull();
  });

  it('renders the add button when can-edit is true', async () => {
    const btnComponent = await screen.queryByText(ptGeneralRules.addSocial);
    const addSocial = await screen.queryByText('add-social');

    console.log({ addSocial });
    expect(btnComponent).not.toBeNull();
  });

  it('does not render the add button when can-edit is false', async () => {
    await rerenderBind({
      ...socialsProps,
      canEdit: false,
    });
    const btnComponent = await screen.queryByText(ptGeneralRules.addSocial);
    expect(btnComponent).toBeNull();
  });
  /*
  it("the button shows 'link' when there's no wallet", async () => {
    await rerenderBind({
      ...socialsProps,
      wallet: undefined,
    });

    const btnComponent = await screen.queryByText(ptRules.link);
    expect(btnComponent).not.toBeNull();
  });

  it('emits "update:wallet" when wallet is defined and button is clicked', async () => {
    await rerenderBind({
      ...socialsProps,
    });

    const btnComponent = await screen.queryByText(ptRules.unlink);
    expect(btnComponent).not.toBeNull();

    // Simulate button click
    await fireEvent.click(btnComponent!);

    // Check if "update:wallet" event has been emitted
    expect(emittedBind()).toHaveProperty('update:wallet');
    expect(emittedBind()['update:wallet'][0]).toEqual([socialsProps.wallet.id]); // Check the emitted value
  });

  it('emits "remove:wallet" when wallet is undefined and button is clicked', async () => {
    await rerenderBind({ wallet: undefined });

    // Simulate button click

    const btnComponent = await screen.queryByText(ptRules.link);
    expect(btnComponent).not.toBeNull();

    await fireEvent.click(btnComponent!);

    // Check if "remove:wallet" event has been emitted
    expect(emittedBind()).toHaveProperty('remove:wallet');
    expect(emittedBind()['remove:wallet'][0]).toEqual([]);
  });

  it('sets button variant to "error" when wallet is defined', async () => {
    await rerenderBind({ ...socialsProps });

    const alexBtnComponent = component.querySelector('.small');
    expect(alexBtnComponent).not.toBeNull();

    expect(alexBtnComponent?.classList.value.split(' ')).toContain('error');
  });

  it('sets button variant to "secondary" when wallet is undefined', async () => {
    await rerenderBind({ wallet: undefined });

    const alexBtnComponent = component.querySelector('.small');
    expect(alexBtnComponent).not.toBeNull();
    expect(alexBtnComponent?.classList.value.split(' ')).toContain('secondary');
  });
  */
});
