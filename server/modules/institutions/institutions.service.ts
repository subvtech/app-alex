import { like, or } from 'drizzle-orm';
import db from '@@/server/lib/drizzle';

/**
 * @description name is case sensitive
 */
export const getInstitutionsByName = async (name: string) => {
  return await db.query.institutions.findMany({
    where: (institutions) =>
      or(
        like(institutions.acronym, `%${name}%`),
        like(institutions.name, `%${name}%`),
      ),
    with: {
      coverImageId: true,
    },
  });
};
