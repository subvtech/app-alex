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
          card: ptCardRules,
        },
      },
      en: {
        components: {
          profile: {
            general: enGeneralRules,
            socials: enSocialsRules,
          },
          card: enCardRules,
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

  it('renders the component with the different title', async () => {
    await rerenderBind({ ...socialsProps, title: 'title2' });

    const titleComponent = await screen.queryByText('title2');

    expect(titleComponent).not.toBeNull();
  });

  it('renders the component with the empty message', async () => {
    await rerenderBind({ ...socialsProps, socials: [] });

    const emptyComponent = await screen.queryByText(ptSocialsRules.empty);

    expect(emptyComponent).not.toBeNull();
  });

  it('renders the add button when can-edit is true', async () => {
    const editButton = await component.querySelector('.mdi-pencil-outline');

    expect(editButton).not.toBeNull();
    // Simulate button click
    await fireEvent.click(editButton!);

    const btnComponent = await screen.queryByText(ptGeneralRules.addSocial);

    expect(btnComponent).not.toBeNull();
    expect(btnComponent!.textContent).toBe(ptGeneralRules.addSocial);
  });

  it('does not render the add button when can-edit is false', async () => {
    await rerenderBind({
      ...socialsProps,
      canEdit: false,
    });
    const editButton = await component.querySelector('.mdi-pencil-outline');
    expect(editButton).toBeNull();

    const btnComponent = await screen.queryByText(ptGeneralRules.addSocial);
    expect(btnComponent).toBeNull();
  });

  it('does not emit "update" when the save button is clicked and there are no changes', async () => {
    const editButton = await component.querySelector('.mdi-pencil-outline');

    expect(editButton).not.toBeNull();
    await fireEvent.click(editButton!);

    const btnComponent = await screen.queryByText(ptCardRules.save);
    expect(btnComponent).not.toBeNull();

    await fireEvent.click(btnComponent!);

    expect(emittedBind()).not.toHaveProperty('update');
  });
});
