import db from '@@/server/lib/drizzle';
// import { tags, Tags, tagsToLearningPlans } from '../tags/tags.schema';
import { LearningPlan, learningPlans } from './learning-plans.schema';

type learningPlanParams = Omit<LearningPlan, 'id'>;

export const createLearningPlan = async (params: learningPlanParams) => {
  return await db
    .insert(learningPlans)
    .values({
      title: params.title,
      description: params.description,
      startDate: params.startDate,
      endDate: params.endDate,
      archivedAt: null,
      type: params.type,
      slug: params.slug,
      className: params.className,
      inviteEnabled: true,
      invitationDuration: params.invitationDuration,
      hidden: false,
      details: params.details,
      message: params.message,
      createdAt: new Date(),
    })
    .returning({ learningPlanId: learningPlans.id })
    .onConflictDoNothing();
};

// export const addTags = async (
//   userId: number,
//   learningPlanID: number,
//   learningplanTags: Tags[],
//   tags: Tags[],
//   isGeneral: boolean,
// ) => {
//   const defaultTagsId = learningplanTags.flatMap((tag) =>
//     !tag.isGeneral === isGeneral ? [tag.id] : [],
//   );
//   const noCreatedTags = tags
//     .filter((tag) => !tag.id)
//     .map(({ text, isGeneral }) => ({
//       text,
//       verified: true,
//       isGeneral,
//       verified_by: userId,
//       isPublic: false,
//     }));
//   const alreadyCreatedTagsId = tags.flatMap((tag) => (tag.id ? [tag.id] : []));
//   let createdTagsId = { count: 0, ids: [] };
//   if (noCreatedTags.length) {
//     createdTagsId = await db.insert(tags).values([noCreatedTags]);
//   }
//   const learningplan = await db.update(tagsToLearningPlans).set({
//     learningPlanId: learningPlanID,
//     tagId: defaultTagsId,
//   });
//   return learningplan.tags.filter((tag) => tag.isGeneral === isGeneral);
// };
