import { eq } from 'drizzle-orm';
import {
  LearningPlanGroupMembers,
  learningPlanGroupMembers,
} from './learning-plan-group-members.schema';

import db from '@@/server/lib/drizzle';

type learningPlanGroupMember = Omit<LearningPlanGroupMembers, 'id'>;

export const createLearningPlanGroupMember = async (
  params: learningPlanGroupMember,
) => {
  return await db.insert(learningPlanGroupMembers).values({
    groupId: params.groupId,
    studentMemberId: params.studentMemberId,
    role: params.role,
    createdAt: new Date(),
  });
};

interface updateLearningPlanGroup {
  groupId: number;
  memberId: number;
  // TODO: colocar no formato Enum
  role: 'standard' | 'in_charge';
}

export const updateLearningPlanGroup = async (
  params: updateLearningPlanGroup,
) => {
  return await db
    .update(learningPlanGroupMembers)
    .set({
      groupId: params.groupId,
      role: params.role,
    })
    .where(eq(learningPlanGroupMembers.id, params.memberId));
};

export const deleteLearningPlanGroup = async (id: number) => {
  return await db
    .delete(learningPlanGroupMembers)
    .where(eq(learningPlanGroupMembers.id, id))
    .returning();
};
