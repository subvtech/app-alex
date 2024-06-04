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

export const frequencyEnum = pgEnum('frequencyEnum', [
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
export const typeEnum = pgEnum('typeEnum', ['onsite', 'online']);

export const learningPlanMeetingSchedule = pgTable(
  'learning-plan-meeting-schedule',
  {
    id: serial('id').primaryKey(),
    learningPlanId: integer('learningPlanId').references(
      () => learningPlans.id,
    ),
    classId: integer('classId').references(() => classes.id),
    frequency: frequencyEnum('frequencyEnum'),
    startDate: timestamp('startDate', { mode: 'date' }),
    endDate: timestamp('endDate', { mode: 'date' }),
    name: text('name'),
    interval: integer('interval'),
    type: typeEnum('typeEnum'),
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
    classId: one(classes, {
      fields: [learningPlanMeetingSchedule.classId],
      references: [classes.id],
    }),
  }),
);
