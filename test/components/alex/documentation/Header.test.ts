import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { vuetify } from '@/plugins/vuetify';
import HeaderComponent from '@/components/alex/documentation/Header.vue';

// Test suite for HeaderComponent
describe('HeaderComponent', () => {
  // Test case: Renders the component with title and description

  const headerProps = {
    title: 'Test Title',
    description: 'Test Description',
    vuetifyLink: 'https://google.com/',
  };

  let rerenderBind: (props: object) => Promise<void>;
  beforeEach(() => {
    const { rerender } = render(HeaderComponent, {
      props: { ...headerProps },
      global: {
        plugins: [vuetify, i18n],
      },
    });
    rerenderBind = rerender;
  });

  it('renders the component with title and description', async () => {
    await rerenderBind({ ...headerProps });

    const titleComponent = await screen.findByText(headerProps.title);
    expect(titleComponent).not.toBeNull();
  });
  it('renders the component with description', async () => {
    await rerenderBind({ ...headerProps });

    const descriptionComponent = await screen.findByText(
      headerProps.description,
    );

    expect(descriptionComponent).not.toBeNull();
  });

  // Test case: Renders the Vuetify link when vuetifyLink prop is provided
  it('renders the Vuetify link when vuetifyLink prop is provided', async () => {
    await rerenderBind({ ...headerProps });

    const vuetifyLinkComponent = (await screen.getByRole('link', {
      name: /vuetifyjs.com/i,
    })) as HTMLAnchorElement;

    expect(vuetifyLinkComponent).not.toBeNull();
    expect(vuetifyLinkComponent.href).toBe(headerProps.vuetifyLink);
  });

  // Test case: Does not render the Vuetify link when vuetifyLink prop is not provided
  it('does not render the Vuetify link when vuetifyLink prop is not provided', async () => {
    await rerenderBind({ ...headerProps, vuetifyLink: undefined });

    const vuetifyLinkComponent = (await screen.queryByRole('link', {
      name: /vuetifyjs.com/i,
    })) as HTMLAnchorElement;

    expect(vuetifyLinkComponent).toBeNull();
  });
});
