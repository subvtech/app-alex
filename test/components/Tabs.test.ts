import { describe, it, expect } from 'vitest';
import { renderSuspended } from '@nuxt/test-utils/runtime';
import { screen, within, fireEvent } from '@testing-library/vue';
import { vuetify } from '../../plugins/vuetify';

import TabsComponent from '../../components/Alex/Custom/Tabs.vue';

describe('Pagination component', () => {
  it('should render the Tabs component', async () => {
    renderSuspended(TabsComponent, {
      props: {
        tabs: [
          {
            label: 'Home',
            value: '1',
          },
          {
            label: 'Profile',
            value: '2',
          },
          {
            label: 'Login',
            value: '3',
          },
        ],
      },
      global: {
        plugins: [vuetify],
      },
    });
    const Tabs = await screen.findByRole('tablist');
    expect(Tabs).toBeDefined();
  });

  it('should have 3 tabs', async () => {
    const Tabs = await screen.findByRole('tablist');
    const tabs = await within(Tabs).findAllByRole('tab');
    expect(tabs).toHaveLength(3);
  });

  it('Should change the active tab on click', async () => {
    const Tabs = await screen.findByRole('tablist');
    const tabs = await within(Tabs).findAllByRole('tab');
    await fireEvent.click(tabs[1]);
    expect(tabs[1].getAttribute('class')).toContain('v-tab--selected');
  });
});
