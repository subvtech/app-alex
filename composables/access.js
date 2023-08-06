import hasAccess from '~/helpers/hasAcess';

export const useAccess = (entity, action) => {
  const user = useStrapiUser();
  return hasAccess(user, entity, action);
};
