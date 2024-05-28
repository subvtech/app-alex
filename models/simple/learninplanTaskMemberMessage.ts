export interface TaskMemberMessage {
  id: number;
  learning_plan_member_id: number;
  task_member_id: number;
  task_submission_id: number;
  audio: Media;
  message: string;
  response_to_message?: TaskMemberMessage;
  sent_at: Date;
}
export interface Message {
  id: number;
  user: {
    name: string;
    avatar?: string | null;
  };
  audio?: {
    src: string;
    duration?: number;
  };
  message: string;
  sentAt: Date;
  current?: boolean;
  response?: Message | AttachedSubmission;
}
