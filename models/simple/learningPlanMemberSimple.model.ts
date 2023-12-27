enum Roles {
  STUDENT = 'student',
  PARTNER = 'partner',
  FACILITATOR = 'facilitator',
}

enum Status {
  PENDING_INVITATION = 'pending_invitation',
  JOINED = 'joined',
}

export interface LearningPlanMemberSimple {
  id: number;
  learningplan: LearningPlanSimple;
  user: UserSimple;
  email: string;
  role: Roles;
  joined_at: Date;
  status: Status;
  learning_structure: any[];
  partner_trails: any[];
  trail_contribuitions: any[];
  group_members: any[];
  task_members: any[];
}
