import db from '@@/server/lib/drizzle';
import { eq } from 'drizzle-orm';
import {
  LearningGoalVerbs,
  learningGoalVerbs,
} from './learning-goal-verbs.schema';

type learningGoalVerbsParams = Omit<LearningGoalVerbs, 'id'>;

export const createVerb = async (params: learningGoalVerbsParams) => {
  return await db.insert(learningGoalVerbs).values({
    learningGoalId: params.learningGoalId,
    userId: params.userId,
    general: params.general,
    descripton: params.descripton,
  });
};

export const updateVerb = async (LpId: number, text: string) => {
  return await db
    .update(learningGoalVerbs)
    .set({
      descripton: text,
    })
    .where(eq(learningGoalVerbs.learningGoalId, LpId));
};
