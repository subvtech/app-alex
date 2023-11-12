import { describe, it, expect } from 'vitest';
import { renderSuspended } from 'nuxt-vitest/utils';
import HorizontalBar from '../../components/alex/custom/horizontalBar.vue';

describe('HorizontalBar', async () => {
  it('HorizontalBar should be defined', async () => {
    const barComponent = await renderSuspended(HorizontalBar, {
      attrs: {
        user: {
          fullname: 'John Dew',
          notFixed: 'true',
        },
      },
    });
    const bar = await barComponent.queryByTestId('horizontal-bar');
    expect(bar).not.toBeNull();
    barComponent.unmount();
  });

  it('active bell shall be displayed', async () => {
    const barComponent = await renderSuspended(HorizontalBar, {
      attrs: {
        user: {
          fullname: 'John Dew',
          notFixed: true,
        },
        isBellActive: true,
      },
    });
    const activeBell = await barComponent.queryByRole('bell-active');
    expect(activeBell).not.toBeNull();

    barComponent.unmount();
  });

  it('active chat shall be be displayed', async () => {
    const barComponent = await renderSuspended(HorizontalBar, {
      attrs: {
        user: {
          fullname: 'John Dew',
        },
        isChatActive: true,
      },
    });
    const activeChat = await barComponent.queryByRole('chat-active');
    expect(activeChat).not.toBeNull();

    barComponent.unmount();
  });

  it('active bell shall not be displayed', async () => {
    const barComponent = await renderSuspended(HorizontalBar, {
      attrs: {
        user: {
          fullname: 'John Dew',
        },
      },
    });
    const activeBell = await barComponent.queryByRole('bell-active');
    expect(activeBell).toBeNull();

    barComponent.unmount();
  });

  it('should display revert the items', async () => {
    const barComponent = await renderSuspended(HorizontalBar, {
      attrs: {
        user: {
          fullname: 'John Dew',
        },
        isChatActive: true,
        reverse: true,
      },
    });
    const reversed = await barComponent.queryByRole('reversed');
    expect(reversed).not.toBeNull();

    barComponent.unmount();
  });
});
