import { describe, it, expect } from 'vitest';
import { renderSuspended } from '@nuxt/test-utils/runtime';

import { vuetify } from '~/plugins/vuetify';

import AppSnackbar from '../../components/AppSnackbar.vue';
import { fireEvent } from '@testing-library/vue';

describe('AppSnackbar', () => {
  const data = {
    show: true,
    message: 'msg',
    color: 'red',
  };
  it('snackbar should be a defined', async () => {
    const snackbarComponent = await renderSuspended(AppSnackbar, {
      attrs: { data },
      global: {
        plugins: [vuetify],
      },
    });

    const snackbar = snackbarComponent.getByTestId('snackbar');

    expect(snackbar).not.toBeNull();
    expect(snackbar).toBeTruthy();
    snackbarComponent.unmount();
  });

  it('should be a button', async () => {
    const snackbarComponent = await renderSuspended(AppSnackbar, {
      attrs: { data },
      global: {
        plugins: [vuetify],
      },
    });

    const btn = await snackbarComponent.getByRole('close-btn');

    expect(btn).toBeTruthy();
    snackbarComponent.unmount();
  });

  it('should close the snackbar when the button is clicked', async () => {
    const snackbarComponent = await renderSuspended(AppSnackbar, {
      attrs: { data },
      global: {
        plugins: [vuetify],
      },
    });

    // Get the button
    const btn = await snackbarComponent.getByRole('close-btn');

    // Click the button
    await fireEvent.click(btn);

    // Check that the snackbar is closed
    expect(data.show).toBe(false);
    snackbarComponent.unmount();
  });
});
