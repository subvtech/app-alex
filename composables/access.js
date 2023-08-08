import hasAccess from '~/helpers/hasAccess';

export const useAccess = (entity, action) => {
  const user = useStrapiUser();
  return hasAccess(user, entity, action);
};
