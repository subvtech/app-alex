export interface EditorSubmission {
  blocks: Array<any>;
  time: number;
  version: string;
}
export interface TaskSubmissionSimple {
  id: number;
  submission: EditorSubmission;
  justification: string;
  grade: number;
  submitted_at: string;
  evaluated_at: string;
  task_member?: TaskMember;
  createdAt: string;
  updatedAt: string;
}
