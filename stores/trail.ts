import { defineStore } from 'pinia';
import { SocialItemType } from '@/models/social.model';

export type TrailStoreType = {
  avatar: { url: string; id: number } | undefined;
  cover_image: any | undefined;
  title: any;
  editorData: any;
};

export const useTrailStore = defineStore('trail', () => {
  const { findOne } = useStrapiUtils();
  const trail = ref();

  const populate = [
    'structures',
    'partners',
    'tasks',
    'contributions',
    'cover_image',
    'learning_structure',
  ];

  const loadTrailData = async (id) => {
    console.log(id);
    trail.value = (await findOne('trails', id, { populate })).data;
  };

  return { loadTrailData, trail };
});
