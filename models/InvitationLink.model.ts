import { Strapi4ResponseSingle } from '@nuxtjs/strapi/dist/runtime/types';
import { ValueOf } from './learningPlan.model';

export const InvitationLinkRole = {
  STUDENT: 'student',
  PARTNER: 'partner',
} as const;

export interface InvitationLink {
  role: ValueOf<typeof InvitationLinkRole>;
  emails_to_send: string;
  hash: string;
  expires_at: Date;
  learningplan: Strapi4ResponseSingle<LearningPlan>;
  is_expired: boolean;
  createdAt?: Date;
}
