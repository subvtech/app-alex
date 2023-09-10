import { ethers } from 'ethers';
import { useI18n } from 'vue-i18n';
import { withTimeout } from '../helpers/utils';
import { user } from '~/assets/queries';

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
  const messageStore = useMessageStore();

  const metalogin = async () => {
    try {
      loading.value = true;
      if (!window.ethereum) {
        messageStore.message = i18n.t('pages.login.metamask.notFound');
        messageStore.color = 'red';
        messageStore.show = true;
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);

      const signer = await withTimeout(4000, provider.getSigner());

      const data: any = await find('wallets/auth');
      const signedMessage = await signer.signMessage(data.token);

      try {
        const response: any = await create('wallets/auth', {
          message: data.token,
          signedMessage,
          address: signer.address,
          returnToken: true,
        });
        setToken(response.jwt);
        setUser(response.user);
        provider.destroy();
        router.push('/');
      } catch (err: any) {
        if (err.error.name === 'TokenExpiredError') {
          messageStore.message = i18n.t('pages.login.metamask.tokenExpired');
          messageStore.color = 'red';
          messageStore.show = true;
        } else {
          setWallet(signer.address);
          router.push({ path: '/register' });
        }
      }
    } catch (err: any) {
      messageStore.message = err.info
        ? err.info.error.message
        : err.error.message;
      messageStore.show = true;
      messageStore.color = 'red';
    } finally {
      loading.value = false;
    }
  };

  const linkWallet = async (user_id) => {
    try {
      loading.value = true;
      if (!window.ethereum) {
        messageStore.message = i18n.t('pages.login.metamask.notFound');
        messageStore.color = 'red';
        messageStore.show = true;
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);

      const signer = await withTimeout(4000, provider.getSigner());

      const data: any = await find('wallets/auth');
      const signedMessage = await signer.signMessage(data.token);

      try {
        const response: any = await create('wallets/address', {
          message: data.token,
          signedMessage,
          address: signer.address,
          id: user_id
        });
        provider.destroy();
        return response;
      } catch (err: any) {
        if (err.error.name === 'TokenExpiredError') {
          messageStore.message = i18n.t(
            'components.profile.wallets.tokenExpired',
          );
          messageStore.color = 'red';
          messageStore.show = true;
        }
      }
    } catch (err: any) {
      messageStore.message = err.info
        ? err.info.error.message
        : err.error.message;
      messageStore.show = true;
      messageStore.color = 'red';
    } finally {
      loading.value = false;
    }
  };
  
  return { metalogin, linkWallet };
};
