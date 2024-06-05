export type TaskStatus = 'published' | 'draft' | 'finished';
export type TaskType = 'individual' | 'group';
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
  start_at: Date;
  finish_at: Date;
  archived_at: Date | null;
  can_submit_after_deadline: boolean;
  allowed_editor_plugins: string; // 'string, string, string';
  submission_description: string;
  learning_goal: LearningPlanGoal[];
}

export type TaskMemberStatus = 'to_do' | 'in_progress' | 'in_review' | 'done';
export interface TaskMember {
  id: number;
  task: Task;
  status: TaskMemberStatus;
  can_submit_after_deadline: boolean;
  started_at: Date;
  finished_at: Date;
  last_submission_at: Date;
}
