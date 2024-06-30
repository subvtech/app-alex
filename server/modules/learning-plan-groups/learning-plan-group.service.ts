import { eq } from 'drizzle-orm';
import {
  LearningPlanGroup,
  learningPlanGroups,
} from './learning-plan-groups.schema';
import db from '@@/server/lib/drizzle';

type learningPlanGroups = Omit<LearningPlanGroup, 'id'>;

export const createLearningPlanGroup = async (params: learningPlanGroups) => {
  return await db.insert(learningPlanGroups).values({
    classId: params.classId,
    learningPlanId: params.learningPlanId,
    title: params.title,
    createdAt: new Date(),
  });
};

export const updateLearningPlanGroupTitle = async (
  title: string,
  learningPlanGroupId: number,
) => {
  return await db
    .update(learningPlanGroups)
    .set({
      title,
    })
    .where(eq(learningPlanGroups.id, learningPlanGroupId));
};

export const deleteLearningPlanGroup = async (id: number) => {
  return await db
    .delete(learningPlanGroups)
    .where(eq(learningPlanGroups.id, id))
    .returning();
};
