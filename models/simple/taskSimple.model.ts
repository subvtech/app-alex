import { LearningPlanGoalSimple } from './learningPlanGoalSimple.model';

export type TaskStatus = 'published' | 'draft' | 'finished';
export type TaskType = 'individual' | 'group';
export type TaskMemberStatus = 'to_do' | 'in_progress' | 'in_review' | 'done';
export interface Task {
  id: number;
  trail_id: number;
  learning_plan_id: number;
  title: string;
  description: string;
  type: TaskType;
  tags: Tag[];
  status: TaskStatus;
  submission_required: boolean;
  start_at: string;
  finish_at: string;
  archived_at: string | null;
  can_submit_after_deadline: boolean;
  allowed_editor_plugins: string; // 'string, string, string';
  submission_description: string;
  learning_goals: LearningPlanGoalSimple[];
  task_members: TaskMember[];
  task_events: TaskEvent[];
}
