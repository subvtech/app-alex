import { describe, it, expect } from 'vitest';
import { renderSuspended } from 'nuxt-vitest/utils';

import { screen } from '@testing-library/vue';

import AppSnackbar from '@/AppSnackbar.vue';

describe('AppSnackbar', () => {
  it('should be a button', async () => {
    await renderSuspended(AppSnackbar);

    const btn = screen.getByRole('button', { name: /fechar/i });

    expect(btn).toBeTruthy();
  });
});
