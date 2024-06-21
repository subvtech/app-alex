import { invitationLinks } from './invitation-link.schema';
import db from '@@/server/lib/drizzle';

interface learningPlanParam {
  learningPlanId: number;
  duration: number;
  emailToSend: string;
  role: 'student' | 'partner';
  learningClassId: number;
  isExpired: boolean;
}

export const createInvitationLink = async (params: learningPlanParam) => {
  return await db
    .insert(invitationLinks)
    .values({
      learningPlanId: params.learningPlanId,
      classId: params.learningClassId,
      role: params.role,
      emailsToSend: params.emailToSend,
      // hash
      expiresAt: new Date(params.duration),
      isExpired: params.isExpired,
      createdAt: new Date(),
    })
    .returning()
    .onConflictDoNothing();
};
