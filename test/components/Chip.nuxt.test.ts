import { describe, it, expect } from 'vitest';
import { renderSuspended } from '@nuxt/test-utils/runtime';
import { screen } from '@testing-library/vue';
import Chip from '../../components/alex/custom/chip.vue';
import { vuetify } from '~/plugins/vuetify';

describe('Chip', async () => {
  const text = 'Ich bin ein Seelenjäger';
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

  it('Its text must be rendered', async () => {
    const chipComponent = await renderSuspended(Chip, {
      attrs: {
        text,
      },
      global: {
        plugins: [vuetify],
      },
    });
    const textComponent = await chipComponent.getByText(text);
    expect(textComponent).not.toBeNull();

    chipComponent.unmount();
  });

  it('Its icon must be rendered', async () => {
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

  it('Its icon shall not be rendered', async () => {
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

      const tag = await chipComponent.getByTestId('chip');
      expect(tag).not.toBeNull();

      expect(tag.className.split(' ')).not.toContain('icon');
    } catch (err) {}

    chipComponent.unmount();
  });

  it('It shall have the status class', async () => {
    const status = 'primary';
    const chipComponent = await renderSuspended(Chip, {
      attrs: {
        text,
        icon: 'mdi-account',
        status,
      },
      global: {
        plugins: [vuetify],
      },
    });
    const tag = await chipComponent.getByTestId('chip');
    expect(tag).not.toBeNull();

    expect(tag.className.split(' ')).toContain(status);

    chipComponent.unmount();
  });

  it('It shall have the size class', async () => {
    const size = 'small';
    const chipComponent = await renderSuspended(Chip, {
      attrs: {
        text,
        icon: 'mdi-account',
        size,
      },
      global: {
        plugins: [vuetify],
      },
    });
    const tag = await chipComponent.getByTestId('chip');
    expect(tag).not.toBeNull();

    expect(tag.className.split(' ')).toContain(size);

    chipComponent.unmount();
  });

  it('It shall have the icon class', async () => {
    const chipComponent = await renderSuspended(Chip, {
      attrs: {
        text,
        icon: 'mdi-account',
      },
      global: {
        plugins: [vuetify],
      },
    });
    const tag = await chipComponent.getByTestId('chip');
    expect(tag).not.toBeNull();

    expect(tag.className.split(' ')).toContain('icon');

    chipComponent.unmount();
  });

  it('it shall have the disabled class', async () => {
    const chipComponent = await renderSuspended(Chip, {
      attrs: {
        text: text,
        isActive: false,
      },
      global: {
        plugins: [vuetify],
      },
    });

    const tag = await chipComponent.getByTestId('chip');
    expect(tag).not.toBeNull();

    expect(tag.className.split(' ')).toContain('disabled');

    chipComponent.unmount();
  });

  it('it shall have the clickable class', async () => {
    const chipComponent = await renderSuspended(Chip, {
      attrs: {
        text: text,
        clickable: true,
      },
      global: {
        plugins: [vuetify],
      },
    });

    const tag = await chipComponent.getByTestId('chip');
    expect(tag).not.toBeNull();

    expect(tag.className.split(' ')).toContain('clickable');

    chipComponent.unmount();
  });
});
