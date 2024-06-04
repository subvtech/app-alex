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
import { learningPlans } from './learning-plans';
import { classes } from './classes';

export const invitationRole = pgEnum('role', ['student', 'partner']);

export const invitationLink = pgTable('invitation-link', {
  id: serial('id').primaryKey(),
  learningPlanId: integer('learningPlanId').references(() => learningPlans.id),
  classId: integer('classId').references(() => classes.id),
  role: invitationRole('role'),
  emailsToSend: text('emails_to_send'),
  hash: text('hash'),
  expiresAt: timestamp('expiresAt', { mode: 'date' }),
  isExpired: boolean('isExpired').default(false),
});

export const initationRelation = relations(invitationLink, ({ one }) => ({
  learningPlan: one(learningPlans, {
    fields: [invitationLink.learningPlanId],
    references: [learningPlans.id],
  }),
  classId: one(classes, {
    fields: [invitationLink.classId],
    references: [classes.id],
  }),
}));
