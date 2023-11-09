import { describe, it, expect, vi } from 'vitest';
import { renderSuspended, mockNuxtImport } from 'nuxt-vitest/utils';
import { screen } from '@testing-library/vue';
import Chip from '../../components/alex/custom/chip.vue';
import { vuetify } from '~/plugins/vuetify';

describe('Chip', async () => {
  it('Chip should be defined', async () => {
    const chipComponent = await renderSuspended(Chip, {
      attrs: {},
      global: {
        plugins: [vuetify],
      },
    });

    const chip = await screen.queryByTestId('chip');
    expect(chip).not.toBeNull();
    chipComponent.unmount();
  });

  it('text must be rendered', async () => {
    let text = 'Ich bin Jojo';
    const { unmount } = await renderSuspended(Chip, {
      attrs: {
        text,
      },
      global: {
        plugins: [vuetify],
      },
    });
    const textComponent = await screen.getByText(text);
    expect(textComponent).not.toBeNull();

    unmount();
  });

  it('Icon must be rendered', async () => {
    let text = 'Ich bin Jojo';
    const chipComponent = await renderSuspended(Chip, {
      attrs: {
        text,
        icon: 'mdi-account',
      },
      global: {
        plugins: [vuetify],
      },
    });
    const iconComponent = await chipComponent.getByTestId('icon');
    expect(iconComponent).not.toBeNull();

    chipComponent.unmount();
  });

  it('Icon shall not be rendered', async () => {
    let text = 'Ich bin Jojo';
    const chipComponent = await renderSuspended(Chip, {
      attrs: {
        text,
      },
      global: {
        plugins: [vuetify],
      },
    });
    try {
      const iconComponent = await chipComponent.getByTestId('icon');
      expect(iconComponent).toBeNull();
    } catch (err) {}

    chipComponent.unmount();
  });
});
