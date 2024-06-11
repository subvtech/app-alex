type ValueOf<T> = T[keyof T];
export const events = {
  SUBMISSION: 'submission',
  COMMENT: 'comment',
  DEADLINE_STUDENT: 'deadline_student',
  ARCHIVE_TASK: 'archive_task',
  TASK_INFO: 'task_info',
} as const;

export interface TaskEvent {
  id: number;
  event: ValueOf<typeof events>;
  task_member: TaskMember;
  createdAt: Date;
  updatedAt: Date;
}
