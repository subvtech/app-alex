import { describe, it, expect } from 'vitest';
import { renderSuspended } from 'nuxt-vitest/utils';
import { screen } from '@testing-library/vue';
import Button from '../../components/alex/custom/Button.vue';
import { vuetify } from '~/plugins/vuetify';

describe('Button component', () => {
  it('should render button component', async () => {
    const text = 'adicionar';
    const buttonComponent = await renderSuspended(Button, {
      attrs: { text },
      global: {
        plugins: [vuetify],
      },
    });
    const button = screen.queryByTestId('alexButton');
    expect(button).not.toBeNull();

    buttonComponent.unmount();
  });

  it('should render icon button component', async () => {
    const buttonComponent = await renderSuspended(Button, {
      attrs: {
        icon: 'mdi-plus',
      },
      global: {
        plugins: [vuetify],
      },
    });
    const button = screen.queryByTestId('alexButton');
    expect(button).not.toBeNull();

    buttonComponent.unmount();
  });

  it('Left icon must be rendered', async () => {
    const text = 'adicionar';
    const buttonComponent = await renderSuspended(Button, {
      attrs: {
        text,
        'prepend-icon': 'mdi-plus',
      },
      global: {
        plugins: [vuetify],
      },
    });
    const button = screen.queryByTestId('alexButton');
    expect(
      button?.getElementsByClassName('v-btn__prepend'),
    ).length.greaterThanOrEqual(1);

    buttonComponent.unmount();
  });

  it('Right icon must be rendered', async () => {
    const text = 'adicionar';
    const buttonComponent = await renderSuspended(Button, {
      attrs: {
        text,
        'append-icon': 'mdi-plus',
      },
      global: {
        plugins: [vuetify],
      },
    });
    const button = screen.queryByTestId('alexButton');
    expect(
      button?.getElementsByClassName('v-btn__append'),
    ).length.greaterThanOrEqual(1);

    buttonComponent.unmount();
  });

  it('Both icons must be rendered', async () => {
    const text = 'adicionar';
    const buttonComponent = await renderSuspended(Button, {
      attrs: {
        text,
        'prepend-icon': 'mdi-plus',
        'append-icon': 'mdi-plus',
      },
      global: {
        plugins: [vuetify],
      },
    });
    const button = screen.queryByTestId('alexButton');
    expect(
      button?.getElementsByClassName('v-btn__append'),
    ).length.greaterThanOrEqual(1);
    expect(
      button?.getElementsByClassName('v-btn__prepend'),
    ).length.greaterThanOrEqual(1);

    buttonComponent.unmount();
  });

  it('secondary variant must be work', async () => {
    const text = 'adicionar';
    const buttonComponent = await renderSuspended(Button, {
      attrs: {
        text,
        variant: 'secondary',
      },
      global: {
        plugins: [vuetify],
      },
    });
    const button = screen.queryByTestId('alexButton');
    expect(button?.classList.contains('bg-gray-blue')).toBeTruthy();

    buttonComponent.unmount();
  });

  it('error variant must be work', async () => {
    const text = 'adicionar';
    const buttonComponent = await renderSuspended(Button, {
      attrs: {
        text,
        variant: 'error',
      },
      global: {
        plugins: [vuetify],
      },
    });
    const button = screen.queryByTestId('alexButton');
    expect(button?.classList.contains('bg-error-0')).toBeTruthy();

    buttonComponent.unmount();
  });
});
