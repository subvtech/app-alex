// import { randomBytes } from 'node:crypto';
// import db from '@@/server/lib/drizzle';
// import { eq } from 'drizzle-orm';
// import { getUserBy } from '../users/users.service';
// import { learningPlans } from './learning-plans.schema';

// interface learningPlanParam {
//   id: number;
//   duration: number;
//   emails_to_send: Array<string>;
// }

// export const createInvitationLink = async (learningPlanParam: learningPlanParam) => {
//   const userName = getUserBy('name');
//   const hash = randomBytes(8)
//     .toString('hex')
//     .replace(/[^a-zA-Z0-9]/g, '');

//   const learningplan = await db.query.learningPlans.findFirst({
//     where: eq(learningPlans.id, learningPlanParam.id),
//   });

//   if (!learningplan) throw new Error('learningPlan not found');
//   const inviteDuration = learningPlanParam.duration
//     ? learningPlanParam.duration
//     : learningplan.invitationDuration!;
//   const expiresAt = new Date(Date.now() + inviteDuration * 1000);
//   // Convert the expired_at field to UTC
//   const expiresAtUTC = expiresAt.toISOString();
//   // Add the expired_at field to the data

//   // TODO: finish function...
// };
