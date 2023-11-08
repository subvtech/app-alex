import { describe, it, expect, vi } from 'vitest';
import { renderSuspended, mockNuxtImport } from 'nuxt-vitest/utils';
import { screen } from '@testing-library/vue';
import { vuetify } from '../../plugins/vuetify';
import AppUserAvatar from '../../components/AppUserAvatar.vue';

describe('AppUserAvatar', async () => {
  it('AppUserAvatar should be defined', async () => {
    const { unmount } = await renderSuspended(AppUserAvatar, {
      attrs: {
        userId: 2,
        placeholder: 'Jojo',
        canEdit: true,
      },
      global: {
        plugins: [vuetify],
      },
    });
    const avatar = await screen.queryByRole('avatar');
    expect(avatar).not.toBeNull();
    unmount();
  });

  it('edit option should be displayed', async () => {
    const { unmount } = await renderSuspended(AppUserAvatar, {
      attrs: {
        userId: 2,
        placeholder: 'Jojo',
        canEdit: true,
      },
      global: {
        plugins: [vuetify],
      },
    });
    const edit = await screen.queryByRole('edit');
    expect(edit).not.toBeNull();
    const input = await screen.queryByRole('input');
    expect(input).not.toBeNull();
    unmount();
  });

  it('should display the user initials', async () => {
    const { unmount } = await renderSuspended(AppUserAvatar, {
      attrs: {
        userId: 2,
        placeholder: 'Jojo Doe',
        canEdit: true,
      },
      global: {
        plugins: [vuetify],
      },
    });
    const profilePicture = await screen.queryByTestId('img-avatar');
    expect(profilePicture).toBeNull();
    const initials = await screen.queryByText('JD');

    expect(initials).not.toBeNull();
    unmount();
  });
});

describe('AppUserAvatar', () => {
  it('should display the profile picture if available', async () => {
    const size = 40;
    const { unmount } = await renderSuspended(AppUserAvatar, {
      attrs: {
        userId: 2,
        placeholder: 'Jojo Doe',
        size,
        profilePicture: {
          id: 1,
          url: '../../public/icon.png',
        },
      },
      global: {
        plugins: [vuetify],
      },
    });

    const profilePicture = await screen.queryByTestId('img-avatar');
    expect(profilePicture).not.toBeNull();

    const initials = await screen.queryByText('JD');
    expect(initials).toBeNull();
    expect(profilePicture?.attributes.getNamedItem('width')?.value).toBe(
      size.toString(),
    );
    expect(profilePicture?.attributes.getNamedItem('height')?.value).toBe(
      size.toString(),
    );
    unmount();
  });

  it('edit option should not be displayed', async () => {
    const { unmount } = await renderSuspended(AppUserAvatar, {
      attrs: {
        userId: 2,
        placeholder: 'Jojo Doe',
        profilePicture: {
          id: 1,
          url: '../../public/icon.png',
        },
      },
      global: {
        plugins: [vuetify],
      },
    });
    const edit = await screen.queryByRole('edit');
    expect(edit).toBeNull();

    const input = await screen.queryByRole('input');
    expect(input).toBeNull();
    unmount();
  });
});
