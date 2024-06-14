import db from '@@/server/lib/drizzle';
import {
  LearningPlanStructure,
  learningPlanStructures,
} from './learning-plan-structures.schema';

type learningPlanStructureParams = Omit<LearningPlanStructure, 'id'>;

export const createLearningStructure = async (
  params: learningPlanStructureParams,
) => {
  return await db.insert(learningPlanStructures).values({
    learningPlanId: params.learningPlanId,
    memberId: params.memberId,
    title: params.title,
    type: params.type,
    createdAt: new Date(),
  });
};
