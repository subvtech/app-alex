type GoogleCredentialResponse = {
  credential?: string;
};

export const useGoogleAuth = () => {
  const config = useRuntimeConfig();
  const { setToken, setUser } = useStrapiAuth();
  const router = useRouter();
  const i18n = useI18n();
  const { setMessage } = useMessageStore();
  const pendingStore = useGooglePendingStore();

  const loading = ref(false);

  const processGoogleLogin = async (credential: string) => {
    if (!credential) return;

    loading.value = true;

    try {
      const client = useStrapiClient();
      const response = await client<{
        jwt: string;
        user: any;
        needsProfileCompletion?: boolean;
        linkedBy?: string;
      }>('/auth/google', { method: 'POST', body: { credential } });

      setToken(response.jwt);
      setUser(response.user);

      if (response.needsProfileCompletion) {
        pendingStore.setPending(response.linkedBy);
        router.push('/complete-profile');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      if (import.meta.dev) console.error('[useGoogleAuth] Erro:', err);
      const message =
        err?.data?.error?.message || err?.error?.message || err?.message || i18n.t('pages.login.google.error');
      setMessage(message, 'red', true);
    } finally {
      loading.value = false;
    }
  };

  const loadGsiScript = (): Promise<void> =>
    new Promise((resolve, reject) => {
      if (window.google?.accounts?.id) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('google-script-load-error'));
      document.head.appendChild(script);
    });

  const renderGoogleButton = async (elementId: string) => {
    const clientId = config.public.googleClientId as string;
    if (!clientId) {
      setMessage(i18n.t('pages.login.google.error'), 'red', true);
      if (import.meta.dev) console.error('[useGoogleAuth] GOOGLE_CLIENT_ID não está definido.');
      return;
    }

    await loadGsiScript();

    const element = document.getElementById(elementId);
    if (!element) return;

    const googleAccounts = window.google!.accounts!.id;

    googleAccounts.initialize({
      client_id: clientId,
      callback: (response: GoogleCredentialResponse) => {
        if (response?.credential) {
          processGoogleLogin(response.credential);
        }
      },
      auto_select: false,
      cancel_on_tap_outside: false,
      context: 'signin',
      ux_mode: 'popup',
      type: 'standard',
    });

    element.innerHTML = '';
    googleAccounts.renderButton(element, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular',
      logo_alignment: 'left',
      width: 306,
    });
  };

  return { renderGoogleButton, loading };
};
