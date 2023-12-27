import { Strapi4ResponseSingle } from '@nuxtjs/strapi/dist/runtime/types';

export enum MediaTypes {
  YOUTUBE = 'youtube',
  VIMEO = 'vimeo',
  FILEIMAGE = 'FileImage',
}

export interface Media {
  id: number;
  title: string;
  image: string;
  video: string;
  type: MediaTypes;
  learningplan: Strapi4ResponseSingle<LearningPlan>;
}
