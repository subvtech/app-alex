const InvitationLinkRole = {
  STUDENT: 'student',
  PARTNER: 'partner',
} as const;

export interface InvitationLinkSimple {
  role: ValueOf<typeof InvitationLinkRole>;
  emails_to_send: string;
  hash: string;
  expires_at: Date;
  learningplan: LearningPlanSimple;
  is_expired: boolean;
  createdAt?: Date;
}

