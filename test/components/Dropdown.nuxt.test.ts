import { describe, expect, it } from 'vitest';
import { renderSuspended } from '@nuxt/test-utils/runtime';
import { screen } from '@testing-library/vue';
import { userEvent } from '@testing-library/user-event';
import Dropdown from '../../components/alex/inputs/Dropdown.vue';

describe('Dropdown', () => {
  const items = [
    { text: 'Home' },
    { text: 'Profile' },
    { text: 'Settings' },
    { text: 'Logout' },
  ];

  it('should render a Dropdown', async () => {
    const { unmount } = await renderSuspended(Dropdown, {
      props: {
        items,
      },
    });

    const menuDropdown = await screen.findByTestId('testing-dropdown');
    expect(menuDropdown).not.toBeNull();
    unmount();
  });

  it('should render the items passed', async () => {
    const { unmount } = await renderSuspended(Dropdown, {
      props: {
        items,
      },
    });

    const menuDropdown = await screen.findByTestId('testing-dropdown');

    const itemsDropdown = await screen.findAllByTestId('testint-dropdown-item');
    userEvent.click(menuDropdown);
    expect(itemsDropdown).toHaveLength(4);
    unmount();
  });
  it('should render the items passed with icons', async () => {
    const { unmount } = await renderSuspended(Dropdown, {
      props: {
        items: [
          { icon: 'mdi-home', text: 'Home' },
          { icon: 'mdi-account', text: 'Profile' },
          { icon: 'mdi-settings', text: 'Settings' },
          { icon: 'mdi-logout', text: 'Logout' },
        ],
      },
    });

    const menuDropdown = await screen.findByTestId('testing-dropdown');

    const itemsIconsDropdown = await screen.findAllByTestId(
      'testint-dropdown-item-icon',
    );
    userEvent.click(menuDropdown);
    expect(itemsIconsDropdown).toHaveLength(4);
    unmount();
  });
});
