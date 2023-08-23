import { LearningPlan } from './learningPlan.model';
import { Tag } from './tag.model';
import { User } from './user.model';

export interface Trail {
  id: number;
  title: string;
  author: User;
  image: File;
  isVisible: boolean;
  learningplan: LearningPlan;
}
