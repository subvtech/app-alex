export interface TaskMemberMessage {
  id: number;
  learning_plan_member: LearningPlanMemberSimple;
  task_member: TaskMember;
  task_submission: TaskSubmissionSimple;
  audio: Upload;
  message: string;
  response_to_message?: TaskMemberMessage;
  sent_at: Date;
}
export interface Message {
  id: number;
  user: {
    id: number;
    name: string;
    avatar?: string | null;
  };
  audio?: {
    src: string;
    duration?: number;
  };
  message: string;
  sentAt: Date;
  response?: Message | AttachedSubmission;
}
