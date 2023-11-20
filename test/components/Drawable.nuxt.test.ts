import { describe, it, expect } from 'vitest';
import { renderSuspended } from 'nuxt-vitest/utils';
import { screen } from '@testing-library/vue';
import Drawable from '../../components/alex/custom/drawable.vue';

describe('Drawable', async () => {
  const menus = [
    {
      title: 'title',
      items: [
        {
          icon: 'mdi-account-multiple-outline',
          title: 'single',
          to: '/classes',
        },
        {
          icon: 'mdi-account-multiple-outline',
          title: 'userlist',
          to: '/classes',
        },
        {
          icon: 'mdi-lock-outline',
          title: 'access',
          to: '/classes',
        },
        {
          icon: 'mdi-cog-outline',
          title: 'setting',
          to: '/projects',
        },
      ],
    },

    {
      title: 'title2',
      items: [
        {
          icon: 'mdi-account-multiple-outline',
          title: 'single2',
          to: '/classes',
        },
        {
          icon: 'mdi-account-multiple-outline',
          title: 'userlist2',
          to: '/classes',
        },
        {
          icon: 'mdi-lock-outline',
          title: 'access2',
          to: '/classes',
        },
        {
          icon: 'mdi-cog-outline',
          title: 'settings2',
          to: '/projects',
        },
      ],
    },
  ];
  it('Drawable should be defined', async () => {
    const { unmount } = await renderSuspended(Drawable, {
      attrs: {},
    });
    const bar = await screen.queryByTestId('drawable');
    expect(bar).not.toBeNull();
    unmount();
  });

  it('Must display list-item', async () => {
    const { unmount } = await renderSuspended(Drawable, {
      attrs: {
        blocks: menus,
        clipped: true,
        show: true,
        permanent: true,
      },
    });
    const activeBell = await screen.getAllByRole('list-item');
    expect(activeBell.length).toBeGreaterThan(0);

    unmount();
  });

  it('Must display icons', async () => {
    const { unmount } = await renderSuspended(Drawable, {
      attrs: {
        blocks: menus,
        clipped: true,
        show: true,
        permanent: true,
      },
    });
    const activeBell = await screen.getAllByRole('icon');
    expect(activeBell.length).toBeGreaterThan(0);

    unmount();
  });
  it('Must display dots instead of the title', async () => {
    const { unmount } = await renderSuspended(Drawable, {
      attrs: {
        blocks: menus,
        clipped: true,
        show: true,
        permanent: true,
      },
    });
    const activeBell = await screen.getAllByText('...');
    expect(activeBell.length).toBeGreaterThan(0);

    unmount();
  });
});
