import { eq } from 'drizzle-orm';
import { learningPlanMembers } from './learning-plan-members.schema';
import db from '@@/server/lib/drizzle';

export const createLearningPlanMember = async (
  userId: string,
  learningPlanId: number,
) => {
  return await db
    .insert(learningPlanMembers)
    .values({
      userId,
      role: 'student',
      status: 'joined',
      joinedAt: new Date(),
      learningPlanId,
      // definir: learning_class: invitationHash.value?.learning_class?.id,
      createdAt: new Date(),
    })
    .returning()
    .onConflictDoNothing();
};

export const addAuthorAsMember = async (
  userId: string,
  learningPlanId: number,
) => {
  return await db
    .insert(learningPlanMembers)
    .values({
      userId,
      learningPlanId,
      role: 'facilitator',
      status: 'joined',
      joinedAt: new Date(),
      createdAt: new Date(),
    })
    .returning()
    .onConflictDoNothing();
};

export const updateStatusMemberTojoined = async (memberId: string) => {
  return await db
    .update(learningPlanMembers)
    .set({
      status: 'joined',
      joinedAt: new Date(),
    })
    .where(eq(learningPlanMembers.userId, memberId))
    .returning();
};

export const deleteLearningPlanMember = async (memberId: number) => {
  return await db
    .delete(learningPlanMembers)
    .where(eq(learningPlanMembers.id, memberId))
    .returning();
};
