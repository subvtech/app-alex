type ValueOf<T> = T[keyof T];
export const events = {
  TASK_CREATED: 'task_created',
  TASK_START_DATE: 'task_start_date',
  TASK_DEADLINE: 'task_deadline',
  TASK_SUBMISSION: 'task_submission',
  TASK_ARCHIVED: 'task_archived',
  TASK_DEADLINE_ENDED: 'task_deadline_ended',
  GROUP_REMOVED: 'group_removed',
  GROUP_ADDED: 'group_added',
  STUDENT_REMOVED: 'student_removed',
  STUDENT_ADDED: 'student_added',
  STUDENT_DEADLINE: 'student_deadline',
  STUDENT_STATUS: 'student_status',
  SUBMISSION_SEND: 'submission_send',
  SUBMISSION_DENIED: 'submission_denied',
  SUBMISSION_EVALUATED: 'submission_evaluated',
  MESSAGE: 'message',
} as const;

export interface TaskEvent {
  id: number;
  event: ValueOf<typeof events>;
  task_member: TaskMember;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  learning_plan_member: LearningPlanMemberSimple;
}
