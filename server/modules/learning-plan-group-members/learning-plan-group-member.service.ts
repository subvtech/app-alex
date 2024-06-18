import db from '@@/server/lib/drizzle';
import {
  LearningPlanGroupMembers,
  learningPlanGroupMembers,
} from './learning-plan-group-members.schema';

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
