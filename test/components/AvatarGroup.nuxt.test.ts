import { describe, it, expect } from 'vitest';
import { renderSuspended } from 'nuxt-vitest/utils';
import { screen } from '@testing-library/vue';
import AvatarGroup from '../../components/alex/custom/AvatarGroup.vue';

describe('AvatarGroup component', () => {
  it('should render the AvatarGroup component', async () => {
    const { unmount } = await renderSuspended(AvatarGroup, {
      props: {
        size: 36,
        avatarItems: [
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Woman_at_Lover%27s_Bridge_Tanjung_Sepat_%28cropped%29.jpg',
            },
          },
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://plus.unsplash.com/premium_photo-1675080431524-3e7c85323972?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFuJTIwZmFjZXxlbnwwfHwwfHx8MA%3D%3D',
            },
          },
          {
            name: 'Jorge Lima',
          },
          {
            name: 'Jorge Lima',
          },
          {
            name: 'Jorge Lima',
          },
          {
            name: 'Jorge Lima',
          },
        ],
      },
    });
    const avatar = await screen.findByTestId('alex-avatar-group');
    expect(avatar).toBeDefined();
    unmount();
  });

  it('should render the to way direction when props order is equals "LAST_ON_TOP" ', async () => {
    const { unmount } = await renderSuspended(AvatarGroup, {
      props: {
        size: 36,
        avatarItems: [
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Woman_at_Lover%27s_Bridge_Tanjung_Sepat_%28cropped%29.jpg',
            },
          },
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://plus.unsplash.com/premium_photo-1675080431524-3e7c85323972?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFuJTIwZmFjZXxlbnwwfHwwfHx8MA%3D%3D',
            },
          },
          {
            name: 'Jorge Lima',
          },
        ],
      },
    });
    const avatar = await screen.findByTestId('alex-avatar-group');
    expect(avatar.getAttribute('class')).not.toContain('flex-row-reverse');
    unmount();
  });

  it('should render the to way direction when props order is equals "FIRST_ON_TOP"', async () => {
    const { unmount } = await renderSuspended(AvatarGroup, {
      props: {
        size: 36,
        order: 'FIRST_ON_TOP',
        avatarItems: [
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Woman_at_Lover%27s_Bridge_Tanjung_Sepat_%28cropped%29.jpg',
            },
          },
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://plus.unsplash.com/premium_photo-1675080431524-3e7c85323972?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFuJTIwZmFjZXxlbnwwfHwwfHx8MA%3D%3D',
            },
          },
          {
            name: 'Jorge Lima',
          },
        ],
      },
    });
    const avatar = await screen.findByTestId('alex-avatar-group');
    expect(avatar.getAttribute('class')).toContain('flex-row-reverse');
    unmount();
  });

  it('should render the right number of childs', async () => {
    const { unmount } = await renderSuspended(AvatarGroup, {
      props: {
        size: 36,
        avatarItems: [
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Woman_at_Lover%27s_Bridge_Tanjung_Sepat_%28cropped%29.jpg',
            },
          },
          {
            name: 'Jorge Lima',
            image: {
              url: 'https://plus.unsplash.com/premium_photo-1675080431524-3e7c85323972?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFuJTIwZmFjZXxlbnwwfHwwfHx8MA%3D%3D',
            },
          },
          {
            name: 'Jorge Lima',
          },
          {
            name: 'Jorge Lima',
          },
          {
            name: 'Jorge Lima',
          },
        ],
        max: 4,
      },
    });
    const avatar = await screen.findAllByTestId('alex-avatar');
    expect(avatar.length).equals(4);
    unmount();
  });

  it('should throw no error when no avatars was passed in props', async () => {
    const { unmount } = await renderSuspended(AvatarGroup, {
      props: {},
    });
    const avatar = await screen.findByTestId('alex-avatar-group');
    expect(avatar);
    unmount();
  });
});
