import { Strapi4ResponseSingle } from '@nuxtjs/strapi/dist/runtime/types';
import { ValueOf } from './learningPlan.model';

export const MediaTypes = {
  YOUTUBE: 'youtube',
  VIMEO: 'vimeo',
  FILEIMAGE: 'FileImage',
} as const;
export interface Media {
  id: number;
  title: string;
  image: string;
  video: string;
  type: ValueOf<typeof MediaTypes>;
  learningplan: Strapi4ResponseSingle<LearningPlan>;
}
