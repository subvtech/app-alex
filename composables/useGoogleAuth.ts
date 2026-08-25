// Resolver em nível de módulo: GSI só é inicializado uma vez por client_id
let _gsiClientId: string | null = null;
let _credentialResolve: ((c: string | null) => void) | null = null;

export const useGoogleAuth = () => {
  const config = useRuntimeConfig();
  const { setToken, setUser } = useStrapiAuth();
  const router = useRouter();
  const i18n = useI18n();
  const { setMessage } = useMessageStore();
  const pendingStore = useGooglePendingStore();

  const loading = ref(false);

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

  const loadGsiAndInit = async (clientId: string): Promise<void> => {
    await loadGsiScript();
    if (_gsiClientId === clientId) return;
    window.google!.accounts!.id.initialize({
      client_id: clientId,
      callback: ({ credential }) => {
        _credentialResolve?.(credential);
        _credentialResolve = null;
      },
      error_callback: () => {
        _credentialResolve?.(null);
        _credentialResolve = null;
      },
      use_fedcm_for_prompt: true,
    });
    _gsiClientId = clientId;
  };

  const googleLogin = async () => {
    const clientId = config.public.googleClientId as string;
    if (!clientId) {
      setMessage(i18n.t('pages.login.google.error'), 'red', true);
      if (import.meta.dev) console.error('[useGoogleAuth] GOOGLE_CLIENT_ID não está definido.');
      return;
    }

    loading.value = true;
    try {
      await loadGsiAndInit(clientId);

      const credential = await new Promise<string | null>((resolve) => {
        _credentialResolve = resolve;
        window.google!.accounts!.id.prompt();
      });

      if (!credential) return;

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

  return { googleLogin, loading };
};
