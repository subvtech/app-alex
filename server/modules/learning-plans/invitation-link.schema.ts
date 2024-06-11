import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

import { classes } from './classes.schema';
import { learningPlans } from './learning-plans.schema';

export const invitationRoleEnum = pgEnum('role', ['student', 'partner']);

export const invitationLinks = pgTable('invitation-link', {
  id: serial('id').primaryKey(),
  learningPlanId: integer('learning_plan_id').references(
    () => learningPlans.id,
  ),
  classId: integer('class_id').references(() => classes.id),
  role: invitationRoleEnum('role'),
  emailsToSend: text('emails_to_send'),
  hash: text('hash'),
  expiresAt: timestamp('expires_at', { mode: 'date' }),
  isExpired: boolean('is_expired').default(false),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
});

export const initationRelation = relations(invitationLinks, ({ one }) => ({
  learningPlan: one(learningPlans, {
    fields: [invitationLinks.learningPlanId],
    references: [learningPlans.id],
  }),
  learningClass: one(classes, {
    fields: [invitationLinks.classId],
    references: [classes.id],
  }),
}));

export type InvitationLink = typeof invitationLinks.$inferSelect;
