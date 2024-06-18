import db from '@@/server/lib/drizzle';
import {
  learningPlanEvents,
  LearningPlanEvents,
} from './learning-plan-events.schema';

type learningPlanEvents = Omit<LearningPlanEvents, 'id'>;

export const createLearningPlanEvent = async (
  memberId: number,
  message: string,
) => {
  return await db.insert(learningPlanEvents).values({
    member: memberId,
    message,
  });
};
