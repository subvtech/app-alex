import { describe, it, expect } from 'vitest';
import { renderSuspended } from 'nuxt-vitest/utils';
import { screen } from '@testing-library/vue';
import { vuetify } from '../../plugins/vuetify';
import { createI18n } from 'vue-i18n';
import Banner from '../../components/alex/custom/Banner.vue';
import ptRules from '@/assets/locales/pt/rules.json';
import ptLogin from '@/assets/locales/pt/pages/login.json';
import enRules from '@/assets/locales/en/rules.json';
import enLogin from '@/assets/locales/en/pages/login.json';
describe('Banner', async () => {
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
    startDate = '05/10/2025',
    endDate = '05/10/2025',
    copyObject = { label: 'Code', copyText: 'dasdasda' },
    isProfessor = false;

  describe('info component related', async () => {
    it('endDate should be displayed correctly', async () => {
      const { unmount } = await renderSuspended(Banner, {
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

    it('startDate should be displayed correctly', async () => {
      const bannerComponent = await renderSuspended(Banner, {
        attrs: {
          userId: 2,
          canEdit: true,
          isProfessor: false,
          showRole: true,
          startDate,
        },
        global: {
          plugins: [vuetify, i18n],
        },
      });
      const startDateComponent = await bannerComponent.queryByText(startDate);
      expect(startDateComponent).not.toBeNull();
      bannerComponent.unmount();
    });

    it('there should be a code', async () => {
      const { unmount } = await renderSuspended(Banner, {
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

    it('there should not be a role', async () => {
      const { unmount } = await renderSuspended(Banner, {
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
      const { unmount } = await renderSuspended(Banner, {
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

    it('Banner should be defined', async () => {
      const { unmount } = await renderSuspended(Banner, {
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
          isProfessor,
        },
        global: {
          plugins: [vuetify, i18n],
        },
      });
      const component = await screen.queryByTestId('banner');
      expect(component).not.toBeNull();
      unmount();
    });

    it('there should be a fullname', async () => {
      const { unmount } = await renderSuspended(Banner, {
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

    it('there should be a username', async () => {
      const { unmount } = await renderSuspended(Banner, {
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
      const { unmount } = await renderSuspended(Banner, {
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
      const { unmount } = await renderSuspended(Banner, {
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
  });


  it('shade styling should be displayed', async () => {
    const bannerComponent = await renderSuspended(Banner, {
      attrs: {
        userId: 2,
        canEdit: true,
        isProfessor: false,
        showShade: true,
        showRole: true,
        startDate,
      },
      global: {
        plugins: [vuetify, i18n],
      },
    });
    const shadeComponent = await bannerComponent.findByRole('shade');

    expect(shadeComponent.className.split(' ')).toContain('shade');
    bannerComponent.unmount();
  });

  it('settings should be displayed next to the menu', async () => {
    const { unmount } = await renderSuspended(Banner, {
      attrs: {
        userId: 2,
        title,
        settingsMenu: true,
        showSettings: true,
        showMenu: true,
        canEdit: true,
      },
      global: {
        plugins: [vuetify, i18n],
      },
    });
    const settingsComponent = await screen.queryByRole('settings');
    expect(settingsComponent).toBeNull();

    const menuSettings = await screen.queryByTestId('settings-menu');
    expect(menuSettings).not.toBeNull();
    unmount();
  });

  it('settings should be displayed on the cover', async () => {
    const { unmount } = await renderSuspended(Banner, {
      attrs: {
        userId: 2,
        title,
        settingsMenu: false,
        showSettings: true,
        canEdit: true,
      },
      global: {
        plugins: [vuetify, i18n],
      },
    });
    const settingsComponent = await screen.queryByRole('settings');
    expect(settingsComponent).not.toBeNull();

    const menuSettings = await screen.queryByTestId('settings-menu');
    expect(menuSettings).toBeNull();
    unmount();
  });

  it('Cover image should be displayed when it exists', async () => {
    const { unmount } = await renderSuspended(Banner, {
      attrs: {
        userId: 2,
        title: 'Sample Title',
        fullname: 'Sample Fullname',
        imgFromStrapi: false,
        coverPicture: {
          id: 1,
          url: '../../public/images/default-cover.png',
        },
        canEdit: true,
      },
      global: {
        plugins: [vuetify, i18n],
      },
    });

    const defaultCoverImage = await screen.queryByRole('default-cover');
    expect(defaultCoverImage).toBeNull();
    const customCoverImage = await screen.queryByRole('custom-cover');
    expect(customCoverImage).not.toBeNull();
    unmount();
  });

  it('Default cover image should be displayed when the custom one is not provided', async () => {
    const { unmount } = await renderSuspended(Banner, {
      attrs: {
        userId: 2,
        title: 'Sample Title',
        fullname: 'Sample Fullname',
        canEdit: true,
      },
      global: {
        plugins: [vuetify, i18n],
      },
    });

    const defaultCoverImage = await screen.queryByRole('default-cover');
    expect(defaultCoverImage).not.toBeNull();
    const customCoverImage = await screen.queryByRole('custom-cover');
    expect(customCoverImage).toBeNull();
    unmount();
  });

  it('Edit button should be displayed when the user can edit', async () => {
    const { unmount } = await renderSuspended(Banner, {
      attrs: {
        userId: 2,
        title: 'Sample Title',
        fullname: 'Sample Fullname',

        canEdit: true,
      },
      global: {
        plugins: [vuetify, i18n],
      },
    });
    const editButton = await screen.queryByTestId('edit-cover');
    expect(editButton).not.toBeNull();
    unmount();
  });

  it('Delete button should be displayed when the user can edit and theres a cover', async () => {
    const { unmount } = await renderSuspended(Banner, {
      attrs: {
        userId: 2,
        title: 'Sample Title',
        fullname: 'Sample Fullname',
        coverPicture: {
          id: 1,
          url: '../../public/icon.png',
        },
        canEdit: true,
      },
      global: {
        plugins: [vuetify, i18n],
      },
    });
    const editButton = await screen.queryByTestId('edit-cover');
    expect(editButton).not.toBeNull();

    const removeButton = await screen.queryByRole('delete-cover');
    expect(removeButton).not.toBeNull();
    unmount();
  });

  it('Edit button shall not be displayed when the user cannot edit', async () => {
    const { unmount } = await renderSuspended(Banner, {
      attrs: {
        userId: 2,
        title: 'Sample Title',
        fullname: 'Sample Fullname',
        coverPicture: {
          id: 1,
          url: '../../public/icon.png',
        },
        canEdit: false,
      },
      global: {
        plugins: [vuetify, i18n],
      },
    });
    const editButton = await screen.queryByTestId('edit-cover');
    expect(editButton).toBeNull();

    const removeButton = await screen.queryByRole('delete-cover');
    expect(removeButton).toBeNull();
    unmount();
  });
});
