export const useMainHorizontalBar = () => {
  const { logout } = useStrapiAuth();
  const i18n = useI18n();
  const router = useRouter();
  const user = useStrapiUser<User>();
  const logoutUser = () => {
    logout();
    router.push('/login');
  };

  const profileMenuItems: {
    title: string;
    to?: string;
    action?: () => void;
  }[] = [
    {
      title: i18n.t('layouts.default.profile'),
      to: `/users/${user.value ? user.value.username : ''}`,
    },
    {
      title: i18n.t('layouts.default.settings'),
      to: `/users/${user.value ? user.value.username + '/' : ''}settings`,
    },
    {
      title: i18n.t('layouts.default.logout'),
      action: logoutUser,
    },
  ];

  return { profileMenuItems, logoutUser };
};
