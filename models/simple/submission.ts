type Justification = {
  text?: string | null;
  audioUrl?: string;
};
export type Submission = {
  id: number;
  justification: Justification;
  status: 'in_review' | 'reviewed' | 'denied';
  mark?: number;
  maxMark?: number;
  time: Date;
};

export type AttachedSubmission = Submission & {
  status: 'reviewed' | 'denied';
  justification?: Justification | null;
};
