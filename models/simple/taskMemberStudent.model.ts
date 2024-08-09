export interface TaskMemberStudent {
  id: number;
  role: 'standard' | 'in_charge';
  task_member: TaskMember;
  student_member: LearningPlanMemberSimple;
}
