import { ClassesLearningPlan } from './classesLearningPlan.model';
import { Structure } from './structure.model';
import { Tag } from './tag.model';
import { Trail } from './trail.model';
import { User } from './user.model';
import { Version } from './version.model';

export interface LearningPlan {
  id: number;
  title: string;
  author: User;
  users: User[];
  image: any;
  isVisible: boolean;
  trails_old: Trail[];
  learningplan: LearningPlan;
  trails: LearningPlan[];
  structures: Structure[];
  versions: Version[];
  classes_learning_plans: ClassesLearningPlan;
  coauthors: User[];
  approved_grade: Number;
  description: string;
  tags: Tag[];
}
