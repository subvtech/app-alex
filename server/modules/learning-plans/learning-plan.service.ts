import db from '@@/server/lib/drizzle';
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
