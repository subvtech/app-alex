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

  const linkWallet = async (userId = undefined, coinbase = true) => {
    try {
      loading.value = true;

      if (!window.ethereum) {
        setMessage(i18n.t('pages.login.metamask.notFound'), 'red', true);

        return {};
      }

      let provider;
      let signer;
      let signedMessage;
      let data;
      console.log({ coinbase, providers: window.ethereum.providers });
      if (window.ethereum.providers) {
        const providers = Array.from(window.ethereum.providers);

        provider = coinbase
          ? providers.find((provider: any) => provider.isCoinbaseWallet)
          : providers.find((provider: any) => provider.isMetaMask);

        if (!provider) {
          setMessage(i18n.t('pages.login.metamask.notFound'), 'red', true);

          return {};
        }
        console.log(
          coinbase
            ? 'User is using Coinbase Wallet'
            : 'User is using MetaMask, but they have the Coinbase Wallet too',
        );

        signer = await withTimeout(
          8000,
          provider.request({
            method: 'personal_sign',
            params: [],
          }),
        );
        data = await find('wallets/auth');

        console.log(signer);
      } else {
        provider = new ethers.BrowserProvider(window.ethereum);
        console.log('User is using MetaMask');

        await withTimeout(8000, provider.getSigner());
        data = await find('wallets/auth');
        signer = await withTimeout(8000, provider.getSigner());
        signedMessage = await signer.signMessage(data.token);
      }

      let endpoint: string;
      let requestData: any;

      const commonData = {
        message: data.token,
        signedMessage,
        address: signer.address,
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
        provider.destroy();
        if (userId)
          userStore.setWallet({
            id: response.wallet.id,
            address: signer.address,
          });
        return {
          jwt: response.jwt,
          user: response.user,
          address: signer.address,
          ...response,
        };
      } catch (err: any) {
        if (err.error.name === 'TokenExpiredError') {
          setMessage(i18n.t('pages.login.metamask.tokenExpired'), 'red', true);
        } else {
          return {
            address: signer.address,
          };
        }
      }
    } catch (err: any) {
      console.log({ err });
      setMessage(err.message, 'red', true);
    } finally {
      loading.value = false;
    }
  };

  const unlinkWallet = async (walletId: string | number) => {
    try {
      const result = await _delete('user-wallets', walletId);
      if (result.data) userStore.setWallet();
    } catch (err) {
      setMessage(err as string, 'red', true);
    }
  };

  const metalogin = async (coinbase = false) => {
    console.log({ coinbase, metalogin: 'metalogin' });
    const { jwt, user, address } = await linkWallet(undefined, coinbase);

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
