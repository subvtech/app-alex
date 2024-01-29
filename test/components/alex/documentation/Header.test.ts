import { describe, it, expect } from 'vitest';
import { screen, within, fireEvent } from '@testing-library/vue';
import { renderSuspended } from 'nuxt-vitest/utils';
import { vuetify } from '@/plugins/vuetify';
import HeaderComponent from '@/components/alex/documentation/Header.vue';
import { transformAssetUrls } from 'vite-plugin-vuetify';

// Test suite for HeaderComponent
describe('HeaderComponent', () => {
  // Test case: Renders the component with title and description
  const title = 'Test Title';
  const description = 'Test Description';
  const vuetifyLink = 'https://google.com/';

  it('renders the component with title and description', async () => {
    const component = await renderSuspended(HeaderComponent, {
      props: { title, description },
      global: {
        plugins: [vuetify],
      },
    });

    const titleComponent = await component.findByText(title);

    expect(titleComponent).not.toBeNull();
  });
  it('renders the component with description', async () => {
    const description = 'Test Description';

    const component = await renderSuspended(HeaderComponent, {
      props: { title, description },
      global: {
        plugins: [vuetify],
      },
    });

    const descriptionComponent = await component.findByText(description);

    expect(descriptionComponent).not.toBeNull();
  });

  // Test case: Renders the Vuetify link when vuetifyLink prop is provided
  it('renders the Vuetify link when vuetifyLink prop is provided', async () => {
    const component = await renderSuspended(HeaderComponent, {
      props: { description, title, vuetifyLink },
      global: {
        plugins: [vuetify],
      },
    });

    const vuetifyLinkComponent = (await component.getByRole('link', {
      name: /vuetifyjs.com/i,
    })) as HTMLAnchorElement;

    expect(vuetifyLinkComponent).not.toBeNull();
    expect(vuetifyLinkComponent.href).toBe(vuetifyLink);
  });

  // Test case: Does not render the Vuetify link when vuetifyLink prop is not provided
  it('does not render the Vuetify link when vuetifyLink prop is not provided', async () => {
    const component = await renderSuspended(HeaderComponent, {
      props: { description, title },
      global: {
        plugins: [vuetify],
      },
    });

    const vuetifyLinkComponent = (await component.queryByRole('link', {
      name: /vuetifyjs.com/i,
    })) as HTMLAnchorElement;

    expect(vuetifyLinkComponent).toBeNull();
  });
});
