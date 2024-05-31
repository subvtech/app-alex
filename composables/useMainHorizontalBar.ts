import { HorizontalBarMenuItemType } from '~/components/alex/custom/horizontalBar.vue';

export const useMainHorizontalBar = () => {
  const i18n = useI18n();
  const user = useStrapiUser<User>();
  const { signOut } = useAuth();

  const profileMenuItems: HorizontalBarMenuItemType[] = [
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
      action: signOut,
    },
  ];

  return { profileMenuItems, logoutUser: signOut };
};
