import { pgTable, serial, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', [
  'student',
  'partner',
  'facilitator',
  'collaborator',
]);

export const statusEnum = pgEnum('status', ['pending_invitation', 'joined']);

export const learningPlanMembers = pgTable('learning-plan-members', {
  id: serial('id').primaryKey(),
  email: text('email'),
  description: text('description'),
  joinedAt: timestamp('joined_at`', { mode: 'date' }),
  role: roleEnum('role'),
  status: statusEnum('status'),
  createdAt: timestamp('created_at`', { mode: 'date' }).defaultNow(),
});

export type LearningPlanMember = typeof learningPlanMembers.$inferSelect;
