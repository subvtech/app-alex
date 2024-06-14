import db from '@@/server/lib/drizzle';
import { tags, Tags } from './tags.schema';

type tagsParams = Omit<Tags, 'id'>;

export const createTags = async (params: tagsParams) => {
  return await db.insert(tags).values({
    learningPlanId: params.learningPlanId,
    isGeneral: params.isGeneral,
    isPublic: params.isPublic,
    text: params.text,
    verified: params.verified,
    verifiedBy: params.verifiedBy,
    verifiedDate: params.verifiedDate,
  });
};
