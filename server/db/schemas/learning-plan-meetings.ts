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
  meetingScheduleId: integer('meeting_schedule_id').references(
    () => learningPlanMeetingSchedule.id,
  ),
  isExpired: boolean('is_expired').default(false),
  date: timestamp('date', { mode: 'date' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
});

export const learningPlanMeetingRelation = relations(
  learningPlanMeetings,
  ({ one }) => ({
    meetingSchedule: one(learningPlanMeetingSchedule, {
      fields: [learningPlanMeetings.meetingScheduleId],
      references: [learningPlanMeetingSchedule.id],
    }),
  }),
);

export type LearningPlanMeeting = typeof learningPlanMeetings.$inferSelect;
