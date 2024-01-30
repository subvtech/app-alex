import { describe, it, expect } from 'vitest';
import { renderSuspended } from '@nuxt/test-utils/runtime';
import { screen, fireEvent } from '@testing-library/vue';
import { vuetify } from '../../plugins/vuetify';
import { createI18n } from 'vue-i18n';
import Info from '../../components/alex/custom/Info.vue';
import ptRules from '@/assets/locales/pt/rules.json';
import ptLogin from '@/assets/locales/pt/pages/login.json';
import enRules from '@/assets/locales/en/rules.json';
import enLogin from '@/assets/locales/en/pages/login.json';

describe('Info', async () => {
  const i18n = createI18n({
    messages: {
      pt: { ptRules, ptLogin },
      en: { enRules, enLogin },
    },
    locale: 'pt',
    legacy: false,
    missingWarn: false,
    globalInjection: true,
  });

  const title = 'title',
    fullname = 'Jojo Per',
    username = 'dasdas',
    description = 'description',
    startDate = '05/10/2025',
    copyObject = { label: 'Code', copyText: 'dasdasda' },
    isProfessor = false,
    showSettings = true;

  it('Info should be defined', async () => {
    const { unmount } = await renderSuspended(Info, {
      attrs: {
        userId: 2,
        title,
        fullname,
        profilePicture: {
          id: 1,
          url: '../../public/icon.png',
        },
        username,
        startDate,
        canEdit: true,
        copyObject,
        showSettings,
        isProfessor,
      },
      global: {
        plugins: [vuetify, i18n],
      },
    });
    const info = await screen.queryByTestId('info');
    expect(info).not.toBeNull();
    unmount();
  });

  it('there should be a fullname', async () => {
    const { unmount } = await renderSuspended(Info, {
      attrs: {
        userId: 2,
        title,
        fullname,
      },
      global: {
        plugins: [vuetify, i18n],
      },
    });
    const fullnameComponent = await screen.queryByText(fullname);
    expect(fullnameComponent).not.toBeNull();
    unmount();
  });

  it('there should be a title', async () => {
    const infoComponent = await renderSuspended(Info, {
      attrs: {
        userId: 2,
        title,
        fullname,
      },
      global: {
        plugins: [vuetify, i18n],
      },
    });
    const titleComponent = await infoComponent.queryByText(title);
    expect(titleComponent).not.toBeNull();
    infoComponent.unmount();
  });

  it('there should be a description above the user information', async () => {
    const infoComponent = await renderSuspended(Info, {
      attrs: {
        userId: 2,
        title,
        descriptionAbove: true,
        description,
        fullname,
      },
      global: {
        plugins: [vuetify, i18n],
      },
    });
    const descriptionComponent = await infoComponent.queryByRole('above');
    expect(descriptionComponent).not.toBeNull();
    expect(descriptionComponent?.textContent).toBe(description);
    infoComponent.unmount();
  });

  it('there should not be a title above the user information', async () => {
    const infoComponent = await renderSuspended(Info, {
      attrs: {
        userId: 2,
        title,
        fullname,
      },
      global: {
        plugins: [vuetify, i18n],
      },
    });
    const titleComponent = await infoComponent.queryByRole('above');
    expect(titleComponent).toBeNull();
    infoComponent.unmount();
  });

  it('there should be a username', async () => {
    const { unmount } = await renderSuspended(Info, {
      attrs: {
        userId: 2,

        username,
      },
      global: {
        plugins: [vuetify, i18n],
      },
    });
    const usernameComponent = await screen.queryByText('@' + username);
    expect(usernameComponent).not.toBeNull();
    unmount();
  });

  it('there should be a startDate', async () => {
    const { unmount } = await renderSuspended(Info, {
      attrs: {
        userId: 2,
        title,
        startDate,
      },
      global: {
        plugins: [vuetify, i18n],
      },
    });
    const startDateComponent = await screen.queryByText(startDate);
    expect(startDateComponent).not.toBeNull();
    unmount();
  });

  it('there should not be a role', async () => {
    const { unmount } = await renderSuspended(Info, {
      attrs: {
        userId: 2,
        title,
        fullname,
      },
      global: {
        plugins: [vuetify, i18n],
      },
    });
    const roleComponent = await screen.queryByRole('role');
    expect(roleComponent).toBeNull();
    unmount();
  });

  it('settings should be displayed', async () => {
    const { unmount } = await renderSuspended(Info, {
      attrs: {
        userId: 2,
        title,
        showSettings,
        canEdit: true,
      },
      global: {
        plugins: [vuetify, i18n],
      },
    });
    const settingsComponent = await screen.queryByRole('settings');
    expect(settingsComponent).not.toBeNull();

    unmount();
  });

  it('settings should emit an event when clicked', async () => {
    const { unmount, emitted } = await renderSuspended(Info, {
      attrs: {
        userId: 2,
        title,
        showSettings,
        canEdit: true,
      },
      global: {
        plugins: [vuetify, i18n],
      },
    });
    const settingsComponent = await screen.queryByRole('settings');
    expect(settingsComponent).not.toBeNull();
    await fireEvent.click(settingsComponent!);

    const settingsEvent = await emitted('display:settings');
    expect(settingsEvent).not.toBeNull();

    unmount();
  });

  it('there should be a code', async () => {
    const { unmount } = await renderSuspended(Info, {
      attrs: {
        userId: 2,
        title,
        copyObject,
      },
      global: {
        plugins: [vuetify, i18n],
      },
    });
    const codeComponent = await screen.queryByText(copyObject.label);
    expect(codeComponent).not.toBeNull();

    unmount();
  });
});

describe('Info', async () => {
  const endDate = '05/10/2025';

  it('endDate should be displayed correctly', async () => {
    const { unmount } = await renderSuspended(Info, {
      attrs: {
        userId: 2,
        canEdit: true,
        isProfessor: false,
        showRole: true,
        endDate,
      },
      global: {
        plugins: [vuetify, i18n],
      },
    });
    const endDateComponent = await screen.queryByText(endDate);
    expect(endDateComponent).not.toBeNull();
    unmount();
  });

  it('there should not be a role', async () => {
    const { unmount } = await renderSuspended(Info, {
      attrs: {
        userId: 2,
        canEdit: true,
      },
      global: {
        plugins: [vuetify, i18n],
      },
    });
    const roleComponent = await screen.queryByRole('role');
    expect(roleComponent).toBeNull();
    unmount();
  });

  it('AppUserAvatar should not be defined', async () => {
    const { unmount } = await renderSuspended(Info, {
      attrs: {
        userId: 2,
        canEdit: true,
      },
      global: {
        plugins: [vuetify, i18n],
      },
    });
    const avatar = await screen.queryByRole('avatar');
    expect(avatar).toBeNull();
    unmount();
  });
});
