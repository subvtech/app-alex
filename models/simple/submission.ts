type Justification = {
  text?: string | null;
  audioUrl?: string;
};
export type Submission = {
  id: number;
  justification: Justification;
  status: 'in_review' | 'reviewed' | 'denied';
  mark?: number | null;
  maxMark?: number | null;
  time: Date;
  task_member?: TaskMember;
};

export type AttachedSubmission = Omit<Submission, 'justification'> & {
  justification?: Justification;
};
