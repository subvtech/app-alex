import db from '@@/server/lib/drizzle';
import {
  LearningPlanGroup,
  learningPlanGroups,
} from './learning-plan-groups.schema';

type learningPlanGroups = Omit<LearningPlanGroup, 'id'>;

export const createLearningPlanGroup = async (params: learningPlanGroups) => {
  return await db.insert(learningPlanGroups).values({
    classId: params.classId,
    learningPlanId: params.learningPlanId,
    title: params.title,
    imageId: params.imageId,
    createdAt: new Date(),
  });
};
