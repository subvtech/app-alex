import { describe, it, expect, vi } from 'vitest';
import { renderSuspended, mockNuxtImport } from 'nuxt-vitest/utils';
import { screen } from '@testing-library/vue';
import Dialog from '../../components/alex/custom/dialog.vue';

describe('Dialog', async () => {
  it('Default should not be defined', async () => {
    const { unmount } = await renderSuspended(Dialog, {
      attrs: { overwriteDefault: true },
    });
    const defaultComponent = await screen.queryByRole('default');
    expect(defaultComponent).toBeNull();
    unmount();
  });
});
describe('Dialog', async () => {
  it('Dialog should be defined', async () => {
    const { unmount } = await renderSuspended(Dialog, {
      attrs: {},
    });
    const bar = await screen.queryByTestId('dialog');
    expect(bar).not.toBeNull();
    unmount();
  });

  it('Title must be rendered', async () => {
    let title = 'Ich bin Jojo';
    const { unmount } = await renderSuspended(Dialog, {
      attrs: {
        title,
      },
    });
    const titleComponent = await screen.getByText(title);
    expect(titleComponent).not.toBeNull();

    unmount();
  });

  it('Icon must be rendered', async () => {
    let title = 'Ich bin Jojo';
    const { unmount } = await renderSuspended(Dialog, {
      attrs: {
        title,
        prependIcon: true,
      },
    });
    const iconComponent = await screen.getByRole('prepend');
    expect(iconComponent).not.toBeNull();

    unmount();
  });
});
