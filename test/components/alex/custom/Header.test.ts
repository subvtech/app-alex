import { describe, it, expect } from 'vitest';
import { screen, within, fireEvent } from '@testing-library/vue';
import { renderSuspended } from '@nuxt/test-utils/runtime';
import { vuetify } from '@/plugins/vuetify';

import HeaderComponent from '@/components/alex/custom/Header.vue';

const getBreadcrumbTitle = (items: any) => items.map((i) => i.title).join('>');

describe('Header component', () => {
  it('should render header with correct title and breadcrumb', async () => {
    const title = 'Header Title';
    const items = [
      {
        title: 'breadcrumb 1',
        href: '/breadcrumb1',
      },
      {
        title: 'breadcrumb 2',
        href: '/breadcrumb2',
      },
    ];

    const breadcrumbTitle = getBreadcrumbTitle(items);

    renderSuspended(HeaderComponent, {
      props: {
        title,
        items,
      },
      global: {
        plugins: [vuetify],
      },
    });
    const header = await screen.findByRole('heading', { name: title });
    const titleElement = await within(header).findByText(title);

    expect(header).not.toBeNull();
    expect(titleElement).not.toBeNull();
    expect(header.firstChild?.textContent).toContain(title);

    const breadcrumbElement = titleElement.parentElement?.nextSibling;

    expect(breadcrumbElement?.textContent).toEqual(breadcrumbTitle);

    items.forEach(async (i) => {
      const item = await within(header).findAllByRole('link', {
        name: i.title,
      });

      expect(item[0].getAttribute('href')).toEqual(i.href);
      expect(item[0].textContent).toEqual(i.title);
    });
  });

  it('should render the arrow back if the prop noArrowBack is false', async () => {
    renderSuspended(HeaderComponent, {
      props: {
        title: 'Test',
        items: [
          {
            title: 'breadcrumb 1',
            href: '/breadcrumb1',
          },
          {
            title: 'breadcrumb 2',
            href: '/breadcrumb2',
          },
        ],
        noArrowBack: false,
      },
      global: {
        plugins: [vuetify],
      },
    });

    const header = await screen.findByRole('navigation', {
      name: 'Page Breadcrumb',
    });

    expect(header).toBeDefined();

    const arrowBack = within(header).findByRole('link', { name: 'Go Back' });

    expect(arrowBack).toBeDefined();
  });

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

    const header = await screen.findByRole('navigation', {
      name: 'Page Breadcrumb',
    });

    expect(header).toBeDefined();

    await expect(() =>
      within(header).findByRole('link', { name: 'Go Back' }),
    ).rejects.toThrow();
  });
  it('should render the buttons when passing props', async () => {
    await renderSuspended(HeaderComponent, {
      props: {
        title: 'Test',
        items: [
          {
            title: 'breadcrumb 1',
            href: '/breadcrumb1',
          },
          {
            title: 'breadcrumb 2',
            href: '/breadcrumb2',
          },
        ],
        noArrowBack: false,
        hasMainButton: true,
        hasSecondaryButton: true,
        mainButtonText: 'Main Btn Text',
        secondaryButtonText: 'Secondary Btn Text',
      },
      global: {
        plugins: [vuetify],
      },
    });

    const header = await screen.findByRole('heading', { name: 'Test' });
    const buttons = await within(header).getAllByRole('button');

    expect(buttons).toHaveLength(2);

    const secondaryButton = buttons[0];
    const mainButton = buttons[1];

    expect(secondaryButton.textContent).toEqual('Secondary Btn Text');
    expect(mainButton.textContent).toEqual('Main Btn Text');
  });

  it('should not render any buttons when props are false', async () => {
    await renderSuspended(HeaderComponent, {
      props: {
        title: 'Test',
        items: [
          {
            title: 'breadcrumb 1',
            href: '/breadcrumb1',
          },
          {
            title: 'breadcrumb 2',
            href: '/breadcrumb2',
          },
        ],
        noArrowBack: false,
        hasMainButton: false,
        hasSecondaryButton: false,
      },
      global: {
        plugins: [vuetify],
      },
    });

    const header = await screen.findByRole('heading', { name: 'Test' });
    const buttons = await within(header).queryAllByRole('button');

    expect(buttons).toHaveLength(0);
  });

  it('should emit main action', async () => {
    const comp = await renderSuspended(HeaderComponent, {
      props: {
        title: 'Test',
        items: [
          {
            title: 'breadcrumb 1',
            href: '/breadcrumb1',
          },
          {
            title: 'breadcrumb 2',
            href: '/breadcrumb2',
          },
        ],
        noArrowBack: false,
        hasMainButton: true,
        hasSecondaryButton: true,
        mainButtonText: 'Main Btn Text',
        secondaryButtonText: 'Secondary Btn Text',
      },
      global: {
        plugins: [vuetify],
      },
    });

    const mainButton = await screen.findByRole('button', {
      name: 'Main Btn Text',
    });

    await fireEvent.click(mainButton);

    expect(comp.emitted()['main-action']).toBeTruthy();
    expect(comp.emitted()['secondary-action']).toBeFalsy();
  });

  it('should emit secondary action', async () => {
    const comp = await renderSuspended(HeaderComponent, {
      props: {
        title: 'Test',
        items: [
          {
            title: 'breadcrumb 1',
            href: '/breadcrumb1',
          },
          {
            title: 'breadcrumb 2',
            href: '/breadcrumb2',
          },
        ],
        noArrowBack: false,
        hasMainButton: true,
        hasSecondaryButton: true,
        mainButtonText: 'Main Btn Text',
        secondaryButtonText: 'Secondary Btn Text',
      },
      global: {
        plugins: [vuetify],
      },
    });

    const secondaryButton = await screen.findByRole('button', {
      name: 'Secondary Btn Text',
    });

    await fireEvent.click(secondaryButton);

    expect(comp.emitted()['secondary-action']).toBeTruthy();
    expect(comp.emitted()['main-action']).toBeFalsy();
  });
});
