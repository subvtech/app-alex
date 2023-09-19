import { ethers } from 'ethers';
import { useI18n } from 'vue-i18n';
import { withTimeout } from '../helpers/utils';

declare global {
  interface Window {
    ethereum: any;
  }
}

export const useMetamask = (logging) => {
  const { update, find } = useStrapi();
  const { setToken, setUser } = useStrapiAuth();

  const router = useRouter();
  const i18n = useI18n();

  const { setValue: setWallet } = useRouteStore<{
    address: string;
  }>();
  const messageStore = useMessageStore();

  const metalogin = async () => {
    try {
      logging.value = true;
      if (!window.ethereum) {
        messageStore.message = i18n.t('pages.login.metamask.notFound');
        messageStore.color = 'red';
        messageStore.show = true;
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);

      const signer = await withTimeout(4000, provider.getSigner());

      const data = ((await find('metamask-auth')).data as any).attributes;

      const signedMessage = await signer.signMessage(data.token);

      try {
        const response: any = await update('metamask-auth', {
          fields: {
            message: data.token,
            signedMessage,
            address: signer.address,
          },
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
          setWallet(signer.address)
          router.push({ path: '/register' });
        }
      }
    } catch (err: any) {
      messageStore.message = err.info.error.message;
      messageStore.show = true;
      messageStore.color = 'red';
    } finally {
      logging.value = false;
    }
  };
  return { metalogin };
};
