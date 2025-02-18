import { LearningPlanGoalSimple } from './learningPlanGoalSimple.model';

export type TaskStatus = 'published' | 'draft' | 'finished' | (string & {});
export type TaskType = 'individual' | 'group';
export type TaskMemberStatus = 'to_do' | 'in_progress' | 'in_review' | 'done';
export interface TaskSimple {
  id: number;
  position: number;
  submission_required: boolean;
  status: TaskStatus;
  title: string;
  learning_plan_id?: number;
  organization: 'standard' | 'story' | 'epic';
  trail?: TrailSimple;
  description?: string | null;
  type?: TaskType | null;
  tags?: TagSimple[];
  blocks?: BlockSimple[];
  start_at?: string | null;
  finish_at?: string | null;
  archived_at?: string | null;
  can_submit_after_deadline: boolean;
  can_change_from_review: boolean;
  allowed_editor_plugins: string; // 'string, string, string';
  submission_description: string;
  learning_goals?: LearningPlanGoalSimple[];
  task_members?: TaskMember[];
  task_events?: TaskEvent[];
  tasks?: TaskSimple[];
  contract_address: string | null;
  parent_task?: TaskSimple;
  sprint?: SprintSimple;
  kanban_column_task: KanbanColumnTask;
}
