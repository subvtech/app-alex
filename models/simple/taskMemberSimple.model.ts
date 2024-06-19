export interface TaskMember {
  id: number;
  status: TaskMemberStatus;
  can_submit_after_deadline: boolean;
  started_at: string;
  finished_at: string;
  last_submission_at: string;
  task_member_students: TaskMemberStudent[];
  task?: TaskSimple;
}
