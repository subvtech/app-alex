import { describe, expect, it } from 'vitest';
import { renderSuspended } from 'nuxt-vitest/utils';
import { screen } from '@testing-library/vue';
import Dropdown from '../../components/Dropdown.vue';

describe('Dropdown', () => {
  it('should render a Dropdown', async () => {
    renderSuspended(Dropdown, {
      props: {
        options: {
          openOnClick: true,
          closeOnContentClick: true,
          location: 'bottom',
          isDarkMode: true,
        },
        items: [
          { id: 1, type: 'icon', icon: 'mdi-home', text: 'Home' },
          { id: 2, type: 'icon', icon: 'mdi-account', text: 'Profile' },
          { id: 3, type: 'icon', icon: 'mdi-settings', text: 'Settings' },
          { id: 4, type: 'icon', icon: 'mdi-logout', text: 'Logout' },
        ],
      },
    });

    const menuDropdown = await screen.findByTestId('testing-dropdown');
    expect(menuDropdown).toBeDefined();
  });
});
