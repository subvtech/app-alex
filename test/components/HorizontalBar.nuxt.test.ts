import { describe, it, expect, vi } from 'vitest';
import { renderSuspended, mockNuxtImport } from 'nuxt-vitest/utils';
import { screen } from '@testing-library/vue';
import { vuetify } from '../../plugins/vuetify';
import HorizontalBar from '../../components/alex/custom/horizontalBar.vue';

describe('HorizontalBar', async () => {
  it('HorizontalBar should be defined', async () => {
    const { unmount } = await renderSuspended(HorizontalBar, {
      attrs: {
        user: {
          fullname: 'John Dew',
        },
      },
      global: {
        plugins: [vuetify],
      },
    });
    const bar = await screen.queryByTestId('horizontal-bar');
    expect(bar).not.toBeNull();
    unmount();
  });

 
  it('active bell shall be displayed', async () => {
    const { unmount } = await renderSuspended(HorizontalBar, {
      attrs: {
        user: {
          fullname: 'John Dew',
        },
        isBellActive: true,
      },
      global: {
        plugins: [vuetify],
      },
    });
    const activeBell = await screen.queryByRole('bell-active');
    expect(activeBell).not.toBeNull();

    unmount();
  });

  it('active chat shall be be displayed', async () => {
    const { unmount } = await renderSuspended(HorizontalBar, {
      attrs: {
        user: {
          fullname: 'John Dew',
        },
        isChatActive: true,
      },
      global: {
        plugins: [vuetify],
      },
    });
    const activeChat = await screen.queryByRole('chat-active');
    expect(activeChat).not.toBeNull();

    unmount();
  });


  it('active bell shall be displayed', async () => {
    const { unmount } = await renderSuspended(HorizontalBar, {
      attrs: {
        user: {
          fullname: 'John Dew',
        },
      },
      global: {
        plugins: [vuetify],
      },
    });
    const activeBell = await screen.queryByRole('bell-active');
    expect(activeBell).toBeNull();

    unmount();
  });

  it('active chat shall not be displayed', async () => {
    const { unmount } = await renderSuspended(HorizontalBar, {
      attrs: {
        user: {
          fullname: 'John Dew',
        },
      },
      global: {
        plugins: [vuetify],
      },
    });
    const activeChat = await screen.queryByRole('chat-active');
    expect(activeChat).toBeNull();

    unmount();
  });


  it('should display revert the items', async () => {
    const { unmount } = await renderSuspended(HorizontalBar, {
      attrs: {
        user: {
          fullname: 'John Dew',
        },
        isChatActive: true,
        reverse: true,
      },
      global: {
        plugins: [vuetify],
      },
    });
    const reversed = await screen.queryByRole('reversed');
    expect(reversed).not.toBeNull();

    unmount();
  });
});
