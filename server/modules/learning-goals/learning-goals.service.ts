import db from '@@/server/lib/drizzle';
import { eq } from 'drizzle-orm';
import { learningGoals, LearningGoals } from './learning-goals.schema';

type learningGoalParams = Omit<LearningGoals, 'id'>;

export const createLearninggoal = async (params: learningGoalParams) => {
  return await db
    .insert(learningGoals)
    .values({
      verbId: params.verbId,
      learningGoalVerbId: params.learningGoalVerbId,
      learningPlanId: params.learningPlanId,
      description: params.description,
    })
    .returning({ learninggoalId: learningGoals.id })
    .onConflictDoNothing();
};

export const deleteLearninggoal = async (lgId: number) => {
  return await db
    .delete(learningGoals)
    .where(eq(learningGoals.id, lgId))
    .returning({ deletedLGId: learningGoals.id });
};
