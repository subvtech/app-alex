type ValueOf<T> = T[keyof T];

export const MediaSimpleTypes = {
  YOUTUBE: 'youtube',
  VIMEO: 'vimeo',
  FILEIMAGE: 'FileImage',
  FILEVIDEO: 'FileVideo',
  URLIMAGE: 'UrlImage',
} as const;

export interface MediaSimple {
  id: number;
  title: string;
  image: string;
  video: string;
  type: ValueOf<typeof MediaTypes>;
  learningplan: LearningPlanSimple;
}
