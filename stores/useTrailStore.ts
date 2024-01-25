import { LearningPlan } from './../models/learningPlan.model';
import { learningPlanGroupMember } from './../models/learningPlanGroupMember.model';
import { defineStore } from 'pinia';
import { SocialItemType } from '@/models/social.model';

export type TrailStoreType = {
  avatar: { url: string; id: number } | undefined;
  cover_image: any | undefined;
  title: string;
  editorData: Array<any>;
  id: number | undefined;
  time: number | undefined;
  version: string | undefined;
};

export const useTrailStore = defineStore('trail', () => {
  const { findOne } = useStrapiUtils();
  const trail = ref();

  const { setMessage } = useMessageStore();
  // const i18n = useI18n();

  const populate = [
    'structures.blocks',
    'partners',
    'tasks',
    'contributions',
    'cover_image',
    'learning_structure.learningplan',
  ];

  const loading = ref(false);

  async function loadTrailData(id: number, showMessageIfNotFound = true) {
    try {
      loading.value = true;
      const result = (await findOne('trails', id, { populate })).data;

      trail.value = result;
      loading.value = false;
      return result;
    } catch (e: any) {
      loading.value = false;
      if (e?.error.name === 'NotFoundError' && showMessageIfNotFound) {
        setMessage('Trilha não encontrada', 'red', true);
      }
    }
  }

  return { loadTrailData, trail };
});
