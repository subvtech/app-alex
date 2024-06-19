export interface TaskSubmissionSimple {
  id: number;
  submission: string;
  justification: string;
  grade: number;
  submitted_at: string;
  evaluated_at: string;
  task_member?: TaskMember;
  createdAt: string;
  updatedAt: string;
}
