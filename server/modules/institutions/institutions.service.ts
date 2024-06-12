import db from '@@/server/lib/drizzle';
import { like, or } from 'drizzle-orm';

/**
 * @description name is case sensitive
 */
export const getInstitutionsByName = async (name: string) => {
  try {
    return await db.query.institutions.findMany({
      where: (institutions) =>
        or(
          like(institutions.acronym, `%${name}%`),
          like(institutions.name, `%${name}%`),
        ),
    });
  } catch {
    return null;
  }
};
