import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const { update } = useStrapi();

  const client = useStrapiClient();
  const graphql = useStrapiGraphQL();
  const { findOne, find } = useStrapiUtils();
  const { id } = useStrapiUser<User>().value;
  const { setMessage } = useMessageStore();
  const i18n = useI18n();

  const loadedUser = ref<User>();
  const loading = ref(true);

  const populate = {
    avatar: true,
    cover: true,
    socials: true,
    tags: true,
    institutions: true,
    user_wallet: true,
  };

  async function updateUser(data, message, showMessage = true) {
    if (!loadedUser.value) return;
    try {
      const result: User = await client(`/users/${loadedUser.value.id}`, {
        method: 'PUT',
        body: {
          ...data,
        },
      });

      if (showMessage) setMessage(message, 'green', true);
      console.log( { ...loadedUser.value, ...result })
      loadedUser.value = { ...loadedUser.value, ...result };
    } catch (e: any) {
      await loadUser(loadedUser.value?.username, '', false);
      if (!showMessage) return;
      if (e?.error?.name === 'NotFoundError') {
        setMessage(i18n.t('pages.login.notfound'), 'red', true);
      } else setMessage(e, 'red', true);
      loading.value = false;
    }
  }

  async function loadUserGraphql(
    username: string,
    query: string,
    message = '',
    showMessage = true,
  ) {
    if (loadedUser.value?.username !== username) return;
    try {
      loading.value = true;

      console.log(loadedUser.value?.username, username);
      const result = await graphql<any>(query, {
        userId: loadedUser.value?.id,
      });
      console.log({ result });
      loadedUser.value = {
        ...loadedUser.value,
        socials: result.data.socials.data.map((item) => ({
          id: item.id,
          ...item.attributes,
        })),
      };
      loading.value = false;
      if (showMessage) setMessage(message, 'green', true);
      return loadedUser.value;
    } catch (e: any) {
      loading.value = false;
      console.log({ error: e });

      await loadUser(loadedUser.value?.username, '', false);
      if (!showMessage) return;
      if (e?.error?.name === 'NotFoundError') {
        setMessage(i18n.t('pages.login.notfound'), 'red', true);
      } else setMessage(e, 'red', true);
    }
  }

  async function loadUser(username: string, message = '', showMessage = true) {
    if (loadedUser.value?.username === username) return;
    try {
      loading.value = true;
      const result = await find<User>('users', {
        filters: {
          username,
        },
        populate,
      });
      console.log({ result, id });

      loadedUser.value = result.data[0];
      loading.value = false;
      if (showMessage) setMessage(message, 'green', true);
      return loadedUser.value;
    } catch (e: any) {
      loading.value = false;
      console.log({ error: e });
      if (e?.error?.name === 'NotFoundError' && showMessage) {
        setMessage(i18n.t('pages.login.notfound'), 'red', true);
      }
    }
  }

  const isCurrentUser = computed(() => {
    return loadedUser.value?.id === id;
  });

  const activeTasks = computed(async () => {
    const result = await find('learning-plan-members', {
      filters: {
        user: loadedUser.value?.id,
      },
      populate: 'taskmembers',
    });
    return result?.data?.reduce((acc: number, taskMembers: unknown) => {
      acc += (taskMembers as any[]).length;
      return acc;
    }, 0);
  });

  const setWallet = (data: Wallet) => {
    if (loadedUser.value)
      loadedUser.value = { ...loadedUser.value, user_wallet: data };
  };

  return {
    activeTasks,
    isCurrentUser,
    loading,
    updateUser,
    user: loadedUser,
    loadUser,
    loadUserGraphql,
    setWallet,
  };
});
