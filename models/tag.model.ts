export interface Tag {
  [x: string]: any;
  id: number;
  tag: string;
  verified: boolean;
  verified_date: Date;
  verified_by: string;
  learningplans: string;
}
