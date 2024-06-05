import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { learningPlans } from './learning-plans';
import { classes } from './classes';
import { learningPlanMeetings } from './learning-plan-meetings';

export const frequencyEnum = pgEnum('frequency', [
  'mondey',
  'tuesday',
  'wednsday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
  'everyday',
  'none',
]);
export const typeEnum = pgEnum('type', ['onsite', 'online']);

export const learningPlanMeetingSchedule = pgTable(
  'learning-plan-meeting-schedule',
  {
    id: serial('id').primaryKey(),
    learningPlanId: integer('learning_plan_id').references(
      () => learningPlans.id,
    ),
    classId: integer('class_id').references(() => classes.id),
    frequency: frequencyEnum('frequency'),
    startDate: timestamp('start_date', { mode: 'date' }),
    endDate: timestamp('end_date', { mode: 'date' }),
    name: text('name'),
    interval: integer('interval'),
    type: typeEnum('type'),
    location: text('location'),
    link: text('link'),
  },
);

export const learningPlanMeetingScheduleRelation = relations(
  learningPlanMeetingSchedule,
  ({ one, many }) => ({
    learningPlanMeetings: many(learningPlanMeetings),
    learningPlan: one(learningPlans, {
      fields: [learningPlanMeetingSchedule.learningPlanId],
      references: [learningPlans.id],
    }),
    class: one(classes, {
      fields: [learningPlanMeetingSchedule.classId],
      references: [classes.id],
    }),
  }),
);

export type LearningPlanMeetingSchedule =
  typeof learningPlanMeetingSchedule.$inferSelect;
