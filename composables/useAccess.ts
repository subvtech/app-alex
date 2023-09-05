export const useAccess = (roles = ['public']) => {
  const user: any = useStrapiUser();
  const userHasAccess = computed(
    () => !!toValue(roles).includes(user.value.role.type),
  );
  return userHasAccess;
};
