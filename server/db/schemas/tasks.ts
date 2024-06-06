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
import { relations } from 'drizzle-orm';
import { trails } from './trails';
import { learningPlans } from './learning-plans';
import { tags } from './tags';
import { taskMembers } from './task-members';
import { taskEvents } from './task-events';

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

// learningGoal

export const taskRelations = relations(tasks, ({ one, many }) => ({
  tags: many(tasksToTags),
  events: many(taskEvents),
  taskMember: one(taskMembers, {
    fields: [tasks.taskMemberId],
    references: [taskMembers.id],
  }),
}));

export const tasksToTags = pgTable(
  'tasks_to_Tags',
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

export const usersToGroupsRelations = relations(tasksToTags, ({ one }) => ({
  task: one(tasks, {
    fields: [tasksToTags.taskId],
    references: [tasks.id],
  }),
  tag: one(tags, {
    fields: [tasksToTags.tagId],
    references: [tags.id],
  }),
}));
