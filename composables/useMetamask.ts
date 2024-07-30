import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum: any;
  }
}

export const useMetamask = () => {
  const { create, find, delete: _delete } = useStrapi();
  const { setToken, setUser } = useStrapiAuth();

  const router = useRouter();
  const i18n = useI18n();
  const { setValue: setWallet } = useRouteStore<{
    address: string;
  }>();
  const { setMessage } = useMessageStore();
  const userStore = useUserStore();

  const loading = ref(false);

  const signMessage = async () => {
    if (window.ethereum.providers) {
      const providers = Array.from(window.ethereum.providers);
      let provider = providers.find(
        (provider: any) => provider.isCoinbaseWallet,
      );

      if (!provider)
        provider = providers.find((provider: any) => provider.isMetaMask);

      if (!provider) throw new Error('Provider not found');

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) throw new Error('No accounts found');

      const data = await find('wallets/auth');
      const address = accounts[0];

      const signedMessage = await withTimeout(
        8000,
        provider.request({
          method: 'personal_sign',
          params: [data.token, address],
        }),
      );

      return { address, signedMessage, provider, token: data.token };
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    console.log('User is using MetaMask');

    await withTimeout(8000, provider.getSigner());
    const data = await find('wallets/auth');

    const signer = await withTimeout(8000, provider.getSigner());
    const signedMessage = await signer.signMessage(data.token);

    return {
      address: signer.address,
      signedMessage,
      provider,
      token: data.token,
    };
  };

  const linkWallet = async (userId?) => {
    try {
      loading.value = true;

      if (!window.ethereum) {
        throw new Error(i18n.t('pages.login.metamask.notFound'));
      }

      const { address, signedMessage, provider, token } = await signMessage();

      let endpoint: string;
      let requestData: any;

      const commonData = {
        message: token,
        signedMessage,
        address,
      };

      if (userId) {
        endpoint = 'wallets/address';
        requestData = { ...commonData, id: userId };
      } else {
        endpoint = 'wallets/auth';
        requestData = { ...commonData, returnToken: true };
      }

      try {
        const response: any = await create(endpoint, requestData);

        if (provider.destroy) provider.destroy();
        if (userId)
          userStore.setWallet({
            id: response.wallet.id,
            address,
          });
        return {
          jwt: response.jwt,
          user: response.user,
          address,
          ...response,
        };
      } catch (err: any) {
        if (err.error.name === 'TokenExpiredError') {
          setMessage(i18n.t('pages.login.metamask.tokenExpired'), 'red', true);
        } else {
          return {
            address,
          };
        }
      }
    } catch (err: any) {
      const errorMsg =
        err.code && err.code === 'ACTION_REJECTED'
          ? i18n.t('pages.login.metamask.rejected')
          : err.message ?? err;
      setMessage(errorMsg, 'red', true);
    } finally {
      loading.value = false;
    }
  };

  const unlinkWallet = async (walletId: string | number) => {
    try {
      const result = await _delete('user-wallets', walletId);
      if (result.data) userStore.setWallet();
    } catch (err: any) {
      console.log('unlinkWallet', { err });
      setMessage(err.message ?? err, 'red', true);
    }
  };

  const metalogin = async () => {
    const { jwt, user, address } = await linkWallet();

    if (jwt && user) {
      setToken(jwt);
      setUser(user);
      router.push('/');
    }
    if (address) {
      setWallet({ address });
      router.push({ path: '/register' });
    }
  };

  return { metalogin, linkWallet, unlinkWallet, loading };
};
