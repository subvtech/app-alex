import { describe, it, expect, vi } from 'vitest';
import { renderSuspended, mockNuxtImport } from 'nuxt-vitest/utils';
import { screen } from '@testing-library/vue';
import Chip from '../../components/alex/custom/chip.vue';
import vuetify from '~/plugins/vuetify';

describe('Chip', async () => {
  it('Chip should be defined', async () => {
    const { unmount } = await renderSuspended(Chip, {
      attrs: {},
    });
    const bar = await screen.queryByTestId('chip');
    expect(bar).not.toBeNull();
    unmount();
  });

  it('text must be rendered', async () => {
    let text = 'Ich bin Jojo';
    const { unmount } = await renderSuspended(Chip, {
      attrs: {
        text,
      },
    });
    const textComponent = await screen.getByText(text);
    expect(textComponent).not.toBeNull();

    unmount();
  });

  it('Icon must be rendered', async () => {
    let text = 'Ich bin Jojo';
    const { unmount } = await renderSuspended(Chip, {
      attrs: {
        text,
        icon: 'mdi-account',
      },
    });
    const iconComponent = await screen.getByTestId('icon');
    expect(iconComponent).not.toBeNull();

    unmount();
  });

  it('Icon shall not be rendered', async () => {
    let text = 'Ich bin Jojo';
    const { unmount } = await renderSuspended(Chip, {
      attrs: {
        text,
      },
    });
    const iconComponent = await screen.getByTestId('icon');
    expect(iconComponent).toBeNull();

    unmount();
  });

  it('Dot shall not be rendered', async () => {
    const { unmount } = await renderSuspended(Chip, {
      attrs: {
        icon: 'mdi-account',
      },
    });
    const iconComponent = await screen.getByTestId('dot');
    expect(iconComponent).toBeNull();

    unmount();
  });

  it('Dot shall be rendered', async () => {
    let text = 'Ich bin Jojo';
    const { unmount } = await renderSuspended(Chip, {
      attrs: {
        text,
      },
    });
    const iconComponent = await screen.getByTestId('dot');
    expect(iconComponent).not.toBeNull();

    unmount();
  });
});
