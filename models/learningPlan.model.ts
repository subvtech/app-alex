import {
  Strapi4ResponseMany,
  Strapi4ResponseSingle,
} from '@nuxtjs/strapi/dist/runtime/types';
import { ClassesLearningPlan } from './classesLearningPlan.model';
import { Structure } from './structure.model';
import { Tag } from './tag.model';
import { User } from './user.model';
import { Version } from './version.model';
import { Upload } from './upload.model';
import { Class } from './class.model';

export interface LearningPlan {
  id: number;
  title: string;
  author: Strapi4ResponseSingle<User>;
  users: User[];
  image: Strapi4ResponseSingle<Upload>;
  isVisible: boolean;
  learningplan?: Strapi4ResponseSingle<LearningPlan>;
  trails: Strapi4ResponseMany<LearningPlan>;
  structures?: Strapi4ResponseMany<Structure>;
  structure?: Strapi4ResponseMany<Structure>;
  versions: Strapi4ResponseMany<Version>;
  classes_learning_plans: ClassesLearningPlan;
  coauthors: Strapi4ResponseMany<User>;
  approved_grade: Number;
  description: string;
  tags: Strapi4ResponseMany<Tag>;
  userClasses?: Strapi4ResponseMany<Class>;
  isTrail?: boolean;
}
