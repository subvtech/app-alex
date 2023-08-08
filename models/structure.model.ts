import { Block } from 'typescript';
import { LearningPlan } from './learningPlan.model';
import { Version } from './version.model';

export interface Structure {
  id: number;
  version: string;
  learningplan: LearningPlan;
  time: Number;
  blocks: Block[];
  versioning: Version;
}
