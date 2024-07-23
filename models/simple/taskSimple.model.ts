import { LearningPlanGoalSimple } from './learningPlanGoalSimple.model';

export type TaskStatus = 'published' | 'draft' | 'finished';
export type TaskType = 'individual' | 'group';
export type TaskMemberStatus = 'to_do' | 'in_progress' | 'in_review' | 'done';
export interface TaskSimple {
  id: number;
  trail?: TrailSimple;
  learning_plan_id: number;
  title: string;
  description?: string | null;
  type?: TaskType | null;
  tags?: TagSimple[];
  status: TaskStatus;
  blocks?: BlockSimple[];
  submission_required: boolean;
  start_at?: string | null;
  finish_at?: string | null;
  archived_at?: string | null;
  can_submit_after_deadline: boolean;
  can_change_from_review: boolean;
  allowed_editor_plugins: string; // 'string, string, string';
  submission_description: string;
  learning_goals: LearningPlanGoalSimple[];
  task_members?: TaskMember[];
  task_events?: TaskEvent[];
  position: number;
}
