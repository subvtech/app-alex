import { describe, it, expect, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { createI18n } from 'vue-i18n';
import { vuetify } from '@/plugins/vuetify';
import WalletComponent from '@/components/alex/profile/settings/Wallet.vue';
import ptRules from '@/assets/locales/pt/components/profile/wallets.json';
import enRules from '@/assets/locales/en/components/profile/wallets.json';
// Test suite for WalletComponent

describe('WalletComponent', () => {
  // Test case: Renders the component with title and description
  const i18n = createI18n({
    messages: {
      pt: {
        components: {
          profile: {
            wallets: ptRules,
          },
        },
      },
      en: {
        components: {
          profile: {
            wallets: enRules,
          },
        },
      },
    },
    locale: 'pt',
    legacy: false,
    missingWarn: false,
    globalInjection: true,
  });

  const walletProps = {
    wallet: { address: '0xas', id: 1 },
  };
  let component: Element;
  let rerenderBind: (props: object) => Promise<void>;
  let emittedBind: {
    <T = unknown>(): Record<string, T[]>;
    <T = unknown>(name?: string | undefined): T[];
  };
  beforeEach(() => {
    const { emitted, rerender, container } = render(WalletComponent, {
      props: { ...walletProps },
      global: {
        plugins: [vuetify, i18n],
      },
    });
    component = container;
    rerenderBind = rerender;
    emittedBind = emitted;
  });

  it('renders the component with the proper title', async () => {
    const titleComponent = await screen.queryByText(ptRules.title);

    expect(titleComponent).not.toBeNull();
  });

  it('renders the component with the address', async () => {
    const hintComponent = await screen.queryByText(walletProps.wallet.address);

    expect(hintComponent).not.toBeNull();
  });

  // Test case: Clicking the button triggers the expected behavior
  it("the button shows 'unlink' when there's a wallet", async () => {
    const btnComponent = await screen.queryByText(ptRules.unlink);
    expect(btnComponent).not.toBeNull();
  });

  it("the button shows 'link' when there's no wallet", async () => {
    await rerenderBind({
      ...walletProps,
      wallet: undefined,
    });

    const btnComponent = await screen.queryByText(ptRules.link);
    expect(btnComponent).not.toBeNull();
  });

  it('emits "update:wallet" when wallet is defined and button is clicked', async () => {
    const btnComponent = await screen.queryByText(ptRules.unlink);
    expect(btnComponent).not.toBeNull();

    // Simulate button click
    await fireEvent.click(btnComponent!);

    // Check if "update:wallet" event has been emitted
    expect(emittedBind()).toHaveProperty('update:wallet');
    expect(emittedBind()['update:wallet'][0]).toEqual([walletProps.wallet.id]); // Check the emitted value
  });

  it('emits "remove:wallet" when wallet is undefined and button is clicked', async () => {
    await rerenderBind({ wallet: undefined });

    // Simulate button click

    const btnComponent = await screen.queryByText(ptRules.link);
    expect(btnComponent).not.toBeNull();

    await fireEvent.click(btnComponent!);

    // Check if "remove:wallet" event has been emitted
    expect(emittedBind()).toHaveProperty('remove:wallet');
    expect(emittedBind()['remove:wallet'][0]).toEqual([]);
  });

  it('sets button variant to "error" when wallet is defined', () => {
    const alexBtnComponent = component.querySelector('.small');
    expect(alexBtnComponent).not.toBeNull();

    expect(alexBtnComponent?.classList.value.split(' ')).toContain('error');
  });

  it('sets button variant to "secondary" when wallet is undefined', async () => {
    await rerenderBind({ wallet: undefined });

    const alexBtnComponent = component.querySelector('.small');
    expect(alexBtnComponent).not.toBeNull();
    expect(alexBtnComponent?.classList.value.split(' ')).toContain('secondary');
  });
});
