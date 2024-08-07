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
};

export type AttachedSubmission = Omit<
  Submission,
  'justification' | 'status'
> & {
  justification?: Justification;
  status: 'reviewed' | 'denied';
};
