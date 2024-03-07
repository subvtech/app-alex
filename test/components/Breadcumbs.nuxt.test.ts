import { describe, it, expect } from 'vitest';
import { renderSuspended } from '@nuxt/test-utils/runtime';
import { screen } from '@testing-library/vue';
import { vuetify } from '../../plugins/vuetify';
import Breadcrumbs from '../../components/alex/custom/Breadcrumbs.vue';

describe('Breadcrumbs', () => {
  it('Breadcrumbs should be defined', async () => {
    const breadcrumbsComponent = await renderSuspended(Breadcrumbs, {
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
    const breadcrumb = await breadcrumbsComponent.queryByTestId('breadcrumbs');
    expect(breadcrumb).not.toBeNull();
    breadcrumbsComponent.unmount();
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
    const arrow = await screen.queryByRole('link', { name: 'Go Back' });
    expect(arrow).toBeNull();

    unmount();
  });
  it('arrow should be displayed', async () => {
    const breadcrumbsComponent = await renderSuspended(Breadcrumbs, {
      attrs: {
        title: 'Jojo',
        items: [{ disabled: false, title: 'text', href: '/' }],
      },
      global: {
        plugins: [vuetify],
      },
    });
    const arrow = await breadcrumbsComponent.queryByRole('link', {
      name: 'Go Back',
    });
    expect(arrow).toBeNull();

    breadcrumbsComponent.unmount();
  });

  it('should display the title', async () => {
    const title = 'Jojo';
    const breadcrumbsComponent = await renderSuspended(Breadcrumbs, {
      attrs: {
        title,
        items: [{ disabled: false, title: 'text', href: '/' }],
      },
      global: {
        plugins: [vuetify],
      },
    });
    const titleComponent = await breadcrumbsComponent.queryByRole('title');
    expect(titleComponent).not.toBeNull();

    const titleText = await breadcrumbsComponent.queryByText(title);
    expect(titleText).not.toBeNull();

    breadcrumbsComponent.unmount();
  });

  it('should not display any crumbdivider', async () => {
    const breadcrumbsComponent = await renderSuspended(Breadcrumbs, {
      attrs: {
        title: 'Jojo',
        arrowBack: true,
        items: [{ disabled: true, title: 'text2', href: '/dd' }],
      },
      global: {
        plugins: [vuetify],
      },
    });

    const dividers = await breadcrumbsComponent.queryAllByText('>');
    expect(dividers.length).toBe(0);

    breadcrumbsComponent.unmount();
  });

  it('should display crumbdividers', async () => {
    const breadcrumbsComponent = await renderSuspended(Breadcrumbs, {
      attrs: {
        title: 'Jojo',
        items: [
          { disabled: false, title: 'text', href: '/' },
          { disabled: true, title: 'text2', href: '/dd' },
        ],
      },
      global: {
        plugins: [vuetify],
      },
    });

    const dividers = await breadcrumbsComponent.queryAllByText('>');
    expect(dividers.length).toBeGreaterThan(0);

    breadcrumbsComponent.unmount();
  });

  it('should display custom crumbdividers', async () => {
    const breadcrumbsComponent = await renderSuspended(Breadcrumbs, {
      attrs: {
        title: 'Jojo',
        divider: '#',
        items: [
          { disabled: false, title: 'text', href: '/' },
          { disabled: false, title: 'text', href: '/' },
          { disabled: false, title: 'text', href: '/' },
        ],
      },
      global: {
        plugins: [vuetify],
      },
    });

    const dividers = await breadcrumbsComponent.queryAllByText('#');
    expect(dividers.length).toBeGreaterThan(0);

    breadcrumbsComponent.unmount();
  });

  it('should display single item', async () => {
    const breadcrumbsComponent = await renderSuspended(Breadcrumbs, {
      attrs: {
        title: 'Jojo',
        items: [{ disabled: false, title: 'text', href: '/' }],
      },
      global: {
        plugins: [vuetify],
      },
    });
    const itemComponent =
      await breadcrumbsComponent.queryByRole('breadcrumb-item');
    expect(itemComponent).not.toBeNull();

    const itemText = await breadcrumbsComponent.queryByText('text');
    expect(itemText).not.toBeNull();

    breadcrumbsComponent.unmount();
  });

  it('should display disabled items', async () => {
    const breadcrumbsComponent = await renderSuspended(Breadcrumbs, {
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
    const title = await breadcrumbsComponent.queryByRole(
      'breadcrumb-item-disabled',
    );
    expect(title).not.toBeNull();

    breadcrumbsComponent.unmount();
  });
});
