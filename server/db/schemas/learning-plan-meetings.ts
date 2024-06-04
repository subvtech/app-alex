import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { learningPlanMeetingSchedule } from './learning-plan-meeting-schedule';

export const learningPlanMeetings = pgTable('learning-plan-meeting', {
  id: serial('id').primaryKey(),
  learningPlanMeetingScheduleId: integer(
    'learningPlanMeetingScheduleId',
  ).references(() => learningPlanMeetingSchedule.id),
  isExpired: boolean('isExpired').default(false),
  date: timestamp('date', { mode: 'date' }),
});

export const learningPlanMeetingRelation = relations(
  learningPlanMeetings,
  ({ one }) => ({
    learningPlanMeeting: one(learningPlanMeetingSchedule, {
      fields: [learningPlanMeetings.learningPlanMeetingScheduleId],
      references: [learningPlanMeetingSchedule.id],
    }),
  }),
);
