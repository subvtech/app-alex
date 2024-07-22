export interface TaskMember {
  id: number;
  status: TaskMemberStatus;
  can_submit_after_deadline: boolean;
  started_at: string;
  finished_at: string;
  learning_plan_member?: LearningPlanMemberSimple;
  last_submission_at?: string | null;
  learning_plan_group?: LearningPlanGroupSimple;
  task?: TaskSimple;
  task_submissions?: TaskSubmissionSimple[];
}
