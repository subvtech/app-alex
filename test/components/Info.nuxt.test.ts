import { describe, it, expect } from 'vitest';
import { renderSuspended } from 'nuxt-vitest/utils';
import { screen } from '@testing-library/vue';
import { vuetify } from '../../plugins/vuetify';
import Info from '../../components/alex/custom/Info.vue';

describe('Info', async () => {
  const title = 'title',
    fullname = 'Jojo Per',
    username = 'dasdas',
    startDate = '05/10/2025',
    code = 'dsds',
    isProfessor = false,
    showSettings = true;

  it('Info shoul be defined', async () => {
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
        code,
        showSettings,
        isProfessor,
      },
      global: {
        plugins: [vuetify],
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
        plugins: [vuetify],
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
        plugins: [vuetify],
      },
    });
    const titleComponent = await infoComponent.queryByText(title);
    expect(titleComponent).not.toBeNull();
    infoComponent.unmount();
  });

  it('there should be a title above the user information', async () => {
    const infoComponent = await renderSuspended(Info, {
      attrs: {
        userId: 2,
        title,
        titleAbove: true,
        fullname,
      },
      global: {
        plugins: [vuetify],
      },
    });
    const titleComponent = await infoComponent.queryByRole('above');
    expect(titleComponent).not.toBeNull();
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
        plugins: [vuetify],
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
        plugins: [vuetify],
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
        plugins: [vuetify],
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
        plugins: [vuetify],
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
        plugins: [vuetify],
      },
    });
    const settingsComponent = await screen.queryByRole('settings');
    expect(settingsComponent).not.toBeNull();
    unmount();
  });

  it('there should be a code', async () => {
    const { unmount } = await renderSuspended(Info, {
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
        plugins: [vuetify],
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
        plugins: [vuetify],
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
        plugins: [vuetify],
      },
    });
    const avatar = await screen.queryByRole('avatar');
    expect(avatar).toBeNull();
    unmount();
  });
});
