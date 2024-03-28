import { ClassSimple } from './classSimple.model';

const InvitationLinkRole = {
  STUDENT: 'student',
  PARTNER: 'partner',
} as const;

export interface InvitationLinkSimple {
  id: number;
  role: ValueOf<typeof InvitationLinkRole>;
  emails_to_send: string | null;
  hash: string;
  expires_at: Date;
  learningplan: LearningPlanSimple;
  is_expired: boolean;
  createdAt?: string;
  updatedAt?: string;
  learning_class?: ClassSimple;
}
