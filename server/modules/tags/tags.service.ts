import { eq } from 'drizzle-orm';
import { tags, Tags } from './tags.schema';
import db from '@@/server/lib/drizzle';

type tagsParams = Omit<Tags, 'id'>;

export const createTags = async (params: tagsParams) => {
  return await db
    .insert(tags)
    .values({
      learningPlanId: params.learningPlanId,
      isGeneral: params.isGeneral,
      isPublic: params.isPublic,
      text: params.text,
      verified: params.verified,
      verifiedBy: params.verifiedBy,
      verifiedDate: params.verifiedDate,
    })
    .returning();
};

export const findTags = async (
  search: string = '',
  isPublic: boolean = true,
  general: boolean = true,
) => {
  return await db.query.tags.findMany({
    where: (tags, { like, and, eq }) =>
      and(
        like(tags.text, `%${search}%`),
        eq(tags.isPublic, isPublic),
        eq(tags.isGeneral, general),
      ),
  });
};

export const updateTags = async (id: number, verifiedBy: number) => {
  return await db
    .update(tags)
    .set({
      verifiedBy,
    })
    .where(eq(tags.id, id));
};
