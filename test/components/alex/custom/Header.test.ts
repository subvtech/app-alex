import { describe, it, expect } from 'vitest';
import { screen, within, render, fireEvent } from '@testing-library/vue';
import { renderSuspended } from 'nuxt-vitest/utils';
import { vuetify } from '@/plugins/vuetify';

import HeaderComponent from '@/components/alex/custom/Header.vue';

const getBreadcrumbTitle = (items: any) => items.map((i) => i.title).join('>');

describe('Header component', () => {
  // it('should render header with correct title and breadcrumb', async () => {
  //   const title = 'Header Title';
  //   const items = [
  //     {
  //       title: 'breadcrumb 1',
  //       href: '/breadcrumb1',
  //     },
  //     {
  //       title: 'breadcrumb 2',
  //       href: '/breadcrumb2',
  //     },
  //   ];

  //   const breadcrumbTitle = getBreadcrumbTitle(items);

  //   renderSuspended(HeaderComponent, {
  //     props: {
  //       title,
  //       items,
  //     },
  //     global: {
  //       plugins: [vuetify],
  //     },
  //   });
  //   const header = await screen.findByRole('header-parent');
  //   const titleElement = await within(header).findByText(title);

  //   expect(header).not.toBeNull();
  //   expect(titleElement).not.toBeNull();
  //   expect(header.firstChild?.textContent).toContain(title);

  //   const breadcrumbElement = titleElement.parentElement?.nextSibling;

  //   expect(breadcrumbElement?.textContent).toEqual(breadcrumbTitle);
  // });

  // it('should render the arrow back if the prop noArrowBack is false', async () => {
  //   renderSuspended(HeaderComponent, {
  //     props: {
  //       title: 'Test',
  //       items: [],
  //       noArrowBack: false,
  //     },
  //     global: {
  //       plugins: [vuetify],
  //     },
  //   });

  //   const header = await screen.findByRole('breadcrumb');

  //   expect(header).toBeDefined();

  //   const arrowBack = within(header).findByRole('goback');

  //   expect(arrowBack).toBeDefined();
  // });

  it('should not render the arrow back if the prop noArrowBack is true', async () => {
    renderSuspended(HeaderComponent, {
      props: {
        title: 'Test',
        items: [],
        noArrowBack: true,
      },
      global: {
        plugins: [vuetify],
      },
    });

    const header = await screen.findByRole('breadcrumb');

    expect(header).toBeDefined();

    await expect(() => within(header).findByRole('goback')).rejects.toThrow();
  });
});
