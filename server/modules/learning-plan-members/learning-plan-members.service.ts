import db from '@@/server/lib/drizzle';
import { learningPlanMembers } from './learning-plan-members.schema';

export const addAuthorAsMember = async (
  userID: string,
  learningPlanID: number,
) => {
  return await db
    .insert(learningPlanMembers)
    .values({
      userId: userID,
      learningPlanId: learningPlanID,
      role: 'facilitator',
      status: 'joined',
      joinedAt: new Date(),
      createdAt: new Date(),
    })
    .returning({ learningPlanMemberId: learningPlanMembers.id })
    .onConflictDoNothing();
};
