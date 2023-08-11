export const useAccess = (roles = ['public']) => {
  const user: any = useStrapiUser();

  const userHasAcess = computed(
    () => !!toValue(roles).includes(user.value.role.type),
  );
  return userHasAcess;
};
