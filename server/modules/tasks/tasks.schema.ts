import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  json,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

import { learningGoals } from '../learning-plans/learning-goals.schema';
import { learningPlans } from '../learning-plans/learning-plans.schema';
import { tags } from '../tags/tags.schema';
import { trails } from '../trails/trails.schema';
import { taskEvents } from './task-events.schema';
import { taskMembers } from './task-members.schema';

export const typeEnum = pgEnum('type', ['individual', 'group']);
export const statusEnum = pgEnum('status', ['published', 'draft', 'finished']);

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  trailId: integer('trail_id')
    .references(() => trails.id)
    .notNull(),
  learningPlanId: integer('learning_plan_id')
    .references(() => learningPlans.id)
    .notNull(),
  taskMemberId: integer('task_member_id')
    .references(() => taskMembers.id)
    .notNull(),
  position: integer('position'),
  title: text('tile'),
  description: text('description'),
  type: typeEnum('type'),
  status: statusEnum('status'),
  submitionRequired: boolean('submition_required').default(true),
  startAt: timestamp('start_at', { mode: 'date' }),
  finishAt: timestamp('finish_at', { mode: 'date' }),
  archivedAt: timestamp('archived_at', { mode: 'date' }),
  canSubmitAfterDeadLine: boolean('can_submit_after_deadLine').default(false),
  allowedEditorPluginJs: text('allowed_editor_pluginJs'),
  submitionDescription: json('submition_description'),
});

export const taskRelations = relations(tasks, ({ one, many }) => ({
  tags: many(tasksToTags),
  events: many(taskEvents),
  learningGoal: many(tasksToLearningGoals),
  taskMember: one(taskMembers, {
    fields: [tasks.taskMemberId],
    references: [taskMembers.id],
  }),
  learningPlan: one(learningPlans, {
    fields: [tasks.learningPlanId],
    references: [learningPlans.id],
  }),
  trail: one(trails, {
    fields: [tasks.id],
    references: [trails.id],
  }),
}));

/** Tags */
export const tasksToTags = pgTable(
  'tasks_to_tags',
  {
    taskId: integer('task_id')
      .notNull()
      .references(() => tasks.id),
    tagId: integer('group_id')
      .notNull()
      .references(() => tags.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.taskId, t.tagId] }),
  }),
);

export const tasksToTagsRelation = relations(tasksToTags, ({ one }) => ({
  task: one(tasks, {
    fields: [tasksToTags.taskId],
    references: [tasks.id],
  }),
  tag: one(tags, {
    fields: [tasksToTags.tagId],
    references: [tags.id],
  }),
}));

/** Learning goal */
export const tasksToLearningGoals = pgTable(
  'tasks_to_learning_goals',
  {
    taskId: integer('task_id')
      .notNull()
      .references(() => tasks.id),
    learningGoalId: integer('learning_goal_id')
      .notNull()
      .references(() => learningGoals.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.taskId, t.learningGoalId] }),
  }),
);

export const tasksToLearningGoalsRelations = relations(
  tasksToLearningGoals,
  ({ one }) => ({
    task: one(tasks, {
      fields: [tasksToLearningGoals.taskId],
      references: [tasks.id],
    }),
    learningGoal: one(learningGoals, {
      fields: [tasksToLearningGoals.learningGoalId],
      references: [learningGoals.id],
    }),
  }),
);
