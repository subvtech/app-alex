export enum MemberRoles {
  STUDENT = 'student',
  PARTNER = 'partner',
  FACILITATOR = 'facilitator',
}

export enum MemberStatus {
  PENDING_INVITATION = 'pending_invitation',
  JOINED = 'joined',
}

export interface LearningPlanMemberSimple {
  id: number;
  learningplan: LearningPlanSimple;
  user: UserSimple;
  email: string;
  role: MemberRoles;
  joined_at: Date;
  status: MemberStatus;
  learning_structure: any[];
  partner_trails: any[];
  trail_contribuitions: any[];
  group_members: any[];
  task_members: any[];
}