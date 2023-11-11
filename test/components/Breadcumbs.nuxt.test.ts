import { describe, it, expect, vi } from 'vitest';
import { renderSuspended, mockNuxtImport } from 'nuxt-vitest/utils';
import { screen } from '@testing-library/vue';
import { vuetify } from '../../plugins/vuetify';
import Breadcrumbs from '../../components/alex/custom/Breadcrumbs.vue';

describe('Breadcrumbs', async () => {
  it('Breadcrumbs should be defined', async () => {
    const { unmount } = await renderSuspended(Breadcrumbs, {
      attrs: {
        title: 'Jojo',

        items: [
          { disabled: false, title: 'text', href: '/' },
          { disabled: false, title: 'fext2', href: '/dsd' },
        ],
      },
      global: {
        plugins: [vuetify],
      },
    });
    const breadcrumb = await screen.queryByTestId('breadcrumbs');
    expect(breadcrumb).not.toBeNull();
    unmount();
  });

  it('arrow should be not displayed', async () => {
    const { unmount } = await renderSuspended(Breadcrumbs, {
      attrs: {
        title: 'Jojo',
        arrowBack: false,
        items: [
          { disabled: false, title: 'text', href: '/' },
          { disabled: false, title: 'fext2', href: '/dsd' },
        ],
      },
      global: {
        plugins: [vuetify],
      },
    });
    const arrow = await screen.queryByRole('goback');
    expect(arrow).toBeNull();

    unmount();
  });
  it('arrow should be not displayed', async () => {
    const { unmount } = await renderSuspended(Breadcrumbs, {
      attrs: {
        title: 'Jojo',
        items: [{ disabled: false, title: 'text', href: '/' }],
      },
      global: {
        plugins: [vuetify],
      },
    });
    const arrow = await screen.queryByRole('goback');
    expect(arrow).toBeNull();

    unmount();
  });

  it('should display the title', async () => {
    const { unmount } = await renderSuspended(Breadcrumbs, {
      attrs: {
        title: 'Jojo',
        items: [{ disabled: false, title: 'text', href: '/' }],
      },
      global: {
        plugins: [vuetify],
      },
    });
    const title = await screen.queryByRole('title');
    expect(title).not.toBeNull();

    const titleText = await screen.queryByText('Jojo');
    expect(titleText).not.toBeNull();

    unmount();
  });

  it('should display the items', async () => {
    const { unmount } = await renderSuspended(Breadcrumbs, {
      attrs: {
        title: 'Jojo',
        items: [{ disabled: false, title: 'text', href: '/' }],
      },
      global: {
        plugins: [vuetify],
      },
    });
    const title = await screen.queryByRole('breadcrumb-item');
    expect(title).not.toBeNull();

    const itemText = await screen.queryByText('text');
    expect(itemText).not.toBeNull();

    unmount();
  });
  it('should display disabled items', async () => {
    const { unmount } = await renderSuspended(Breadcrumbs, {
      attrs: {
        title: 'Jojo',
        items: [
          { disabled: true, title: 'text', href: '/' },
          { disabled: false, title: 'text2', href: '/' },
        ],
      },
      global: {
        plugins: [vuetify],
      },
    });
    const title = await screen.queryByRole('breadcrumb-item-disabled');
    expect(title).not.toBeNull();

    unmount();
  });
});
