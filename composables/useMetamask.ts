import { ethers } from 'ethers';
import { StrapiUser } from 'strapi-sdk-js';

declare global {
  interface Window {
    ethereum: any;
  }
}

export const useMetamask = (loading) => {
  const { create, find } = useStrapi();
  const { setToken, setUser } = useStrapiAuth();

  const router = useRouter();
  const i18n = useI18n();
  const { setValue: setWallet } = useRouteStore<{
    address: string;
  }>();
  const { setMessage } = useMessageStore();
  const userStore = useUserStore();

  const linkWallet = async (user_id?) => {
    try {
      loading.value = true;
      if (!window.ethereum) {
        setMessage(i18n.t('pages.login.metamask.notFound'), 'red', true);

        return {};
      }
      const provider = new ethers.BrowserProvider(window.ethereum);

      const signer = await withTimeout(4000, provider.getSigner());

      const data: any = await find('wallets/auth');
      const signedMessage = await signer.signMessage(data.token);

      let endpoint: string;
      let requestData: any;

      const commonData = {
        message: data.token,
        signedMessage,
        address: signer.address,
      };

      if (user_id) {
        endpoint = 'wallets/address';
        requestData = { ...commonData, id: user_id };
      } else {
        endpoint = 'wallets/auth';
        requestData = { ...commonData, returnToken: true };
      }

      try {
        const response: any = await create(endpoint, requestData);
        provider.destroy();
        if (user_id)
          userStore.setWallet({ id: response.wallet.id, address: signer.address });
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
      setMessage(
        err.info ? err.info.error.message : err.error.message,
        'red',
        true,
      );
    } finally {
      loading.value = false;
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

  return { metalogin, linkWallet };
};
