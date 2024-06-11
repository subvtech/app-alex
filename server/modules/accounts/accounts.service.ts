import db from '@@/server/lib/drizzle';

export const getAccountByUserId = async (id: string) => {
  try {
    return await db.query.accounts.findFirst({
      where: (accounts, { eq }) => eq(accounts.userId, id),
    });
  } catch {
    return null;
  }
};
