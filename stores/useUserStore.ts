import { defineStore } from 'pinia';
import { ref } from 'vue';

type PopulateFields =
  | 'avatar'
  | 'cover'
  | 'socials'
  | 'tags'
  | 'institutions.cover'
  | 'user_wallet';

export type UniquePopulateFieldsArray = Array<PopulateFields>;

export const useUserStore = defineStore('user', () => {
  const client = useStrapiClient();
  const { find } = useStrapiUtils();
  const strapiUser = useStrapiUser<User>();
  const { setMessage } = useMessageStore();
  const i18n = useI18n();

  const loadedUser = ref<User>();
  const loading = ref(true);

  const populate: UniquePopulateFieldsArray = [
    'avatar',
    'cover',
    'institutions.cover',
    'socials',
    'tags',
    'user_wallet',
  ];

  async function updateUser(
    data,
    populateArray: UniquePopulateFieldsArray = [],
    message,
    showMessage = true,
  ) {
    if (!loadedUser.value) return;
    try {
      const result: User = await client(`/users/${loadedUser.value.id}`, {
        method: 'PUT',
        body: {
          ...data,
        },
        params: {
          _populate: populateArray,
        },
      });

      if (showMessage) setMessage(message, 'green', true);
      loadedUser.value = { ...loadedUser.value, ...result };
    } catch (e: any) {
      await loadUser(loadedUser.value?.username, '', false);
      if (!showMessage) return;
      if (e?.error?.name === 'NotFoundError') {
        setMessage(i18n.t('pages.login.notfound'), 'red', true);
      } else setMessage(e, 'red', true);
    }
  }

  async function loadUserTags(message) {
    if (!loadedUser.value) return;
    try {
      loading.value = true;
      const result = await find<Tag>('tags', {
        filters: {
          verified_by: loadedUser.value.id,
        },
      });
      loadedUser.value = { ...loadedUser.value, tags: result.data };
      loading.value = false;
      if (message) setMessage(message, 'green', true);
    } catch (e: any) {
      loading.value = false;
      if (e?.error?.name === 'NotFoundError' && message) {
        setMessage(i18n.t('components.competences.notFound'), 'red', true);
      }
    }
  }

  async function loadUserSocials(showMessage = true) {
    if (!loadedUser.value) return;
    try {
      loading.value = true;
      const result = await find<SocialItemType>('socials', {
        filters: {
          users_permissions_user: loadedUser.value.id,
        },
      });
      loadedUser.value = { ...loadedUser.value, socials: result.data };
      loading.value = false;
      if (showMessage)
        setMessage(i18n.t('components.profile.socials.update'), 'green', true);
    } catch (e: any) {
      loading.value = false;
      if (e?.error?.name === 'NotFoundError' && showMessage) {
        setMessage(i18n.t('pages.login.notfound'), 'red', true);
      }
    }
  }

  async function loadUserInstitutions(showMessage = true) {
    if (!loadedUser.value) return;
    try {
      loading.value = true;
      const result = await find<InstitutionsType>('institutions', {
        filters: {
          users: { id: { $in: [loadedUser.value.id] } },
        },
        populate: ['cover'],
      });
      loadedUser.value = { ...loadedUser.value, institutions: result.data };
      loading.value = false;
      if (showMessage)
        setMessage(
          i18n.t('components.profile.institutional.update'),
          'green',
          true,
        );
    } catch (e: any) {
      loading.value = false;
      if (e?.error?.name === 'NotFoundError' && showMessage) {
        setMessage(
          i18n.t('components.profile.institutional.emptyInstitutional'),
          'red',
          true,
        );
      }
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

      loadedUser.value = result.data[0];
      loading.value = false;
      if (showMessage) setMessage(message, 'green', true);
      return loadedUser.value;
    } catch (e: any) {
      loading.value = false;
      if (e?.error?.name === 'NotFoundError' && showMessage) {
        setMessage(i18n.t('pages.login.notfound'), 'red', true);
      }
    }
  }

  const isCurrentUser = computed(() => {
    return loadedUser.value?.id === strapiUser.value?.id;
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

  const setWallet = (data?: Wallet) => {
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
    setWallet,
    loadUserSocials,
    loadUserTags,
    loadUserInstitutions,
  };
});
