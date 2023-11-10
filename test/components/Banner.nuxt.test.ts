import { describe, it, expect } from 'vitest';
import { renderSuspended } from 'nuxt-vitest/utils';
import { screen } from '@testing-library/vue';
import { vuetify } from '../../plugins/vuetify';
import Banner from '../../components/alex/custom/Banner.vue';

describe('Banner', async () => {
  const title = 'title',
    fullname = 'Jojo Per',
    username = 'dasdas',
    startDate = '05/10/2025',
    endDate = '05/10/2025',
    code = 'dsds',
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
          plugins: [vuetify],
        },
      });
      const endDateComponent = await screen.queryByText(endDate);
      expect(endDateComponent).not.toBeNull();
      unmount();
    });

    it('startDate should be displayed correctly', async () => {
      const bannerComponent= await renderSuspended(Banner, {
        attrs: {
          userId: 2,
          canEdit: true,
          isProfessor: false,
          showRole: true,
          startDate,
        },
        global: {
          plugins: [vuetify],
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
          code,
        },
        global: {
          plugins: [vuetify],
        },
      });
      const codeComponent = await screen.queryByText(code);
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
          plugins: [vuetify],
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
          plugins: [vuetify],
        },
      });
      const avatar = await screen.queryByRole('avatar');
      expect(avatar).toBeNull();
      unmount();
    });

    it('Banner shoul be defined', async () => {
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
          code,
          isProfessor,
        },
        global: {
          plugins: [vuetify],
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
          plugins: [vuetify],
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
          plugins: [vuetify],
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
          plugins: [vuetify],
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
          plugins: [vuetify],
        },
      });
      const roleComponent = await screen.queryByRole('role');
      expect(roleComponent).toBeNull();
      unmount();
    });
  });

  it('menu should be displayed', async () => {
    const { unmount } = await renderSuspended(Banner, {
      attrs: {
        userId: 2,
        title,
        showMenu: true,
        canEdit: true,
      },
      global: {
        plugins: [vuetify],
      },
    });
    const settingsComponent = await screen.queryByTestId('menu');
    expect(settingsComponent).not.toBeNull();
    unmount();
  });

  it('settings should be displayed next to the menu', async () => {
    const { unmount } = await renderSuspended(Banner, {
      attrs: {
        userId: 2,
        title,
        settingsMenu: true,
        showMenu: true,
        canEdit: true,
      },
      global: {
        plugins: [vuetify],
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
        canEdit: true,
      },
      global: {
        plugins: [vuetify],
      },
    });
    const settingsComponent = await screen.queryByRole('settings');
    expect(settingsComponent).not.toBeNull();

    const menuSettings = await screen.queryByTestId('settings-menu');
    expect(menuSettings).toBeNull();
    unmount();
  });

  it('settings should be displayed on the cover', async () => {
    const { unmount } = await renderSuspended(Banner, {
      attrs: {
        userId: 2,
        title,
        settingsMenu: false,
        canEdit: true,
      },
      global: {
        plugins: [vuetify],
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
        coverPicture: {
          id: 1,
          url: '../../public/icon.png',
        },
        canEdit: true,
      },
      global: {
        plugins: [vuetify],
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
        plugins: [vuetify],
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
        plugins: [vuetify],
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
        plugins: [vuetify],
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
        plugins: [vuetify],
      },
    });
    const editButton = await screen.queryByTestId('edit-cover');
    expect(editButton).toBeNull();

    const removeButton = await screen.queryByRole('delete-cover');
    expect(removeButton).toBeNull();
    unmount();
  });
});
