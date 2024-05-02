import { defineStore } from 'pinia';
import { TrailSimple } from '@/models/simple/trailSimple.model';

export const useTrailStore = defineStore('trail', () => {
  const { findOne } = useStrapiUtils();
  const trail = ref<TrailSimple>();

  const { setMessage } = useMessageStore();

  const populate = {
    tasks: true,
    cover_image: true,
    partners: true,
    structures: {
      populate: ['blocks'],
    },
    learning_structure: {
      populate: ['learningplan.classes'],
    },
    contributions: {
      populate: {
        student_member: {
          populate: {
            learning_class: true,
            user: {
              fields: ['id', 'fullname', 'email'],
              populate: {
                avatar: {
                  populate: true,
                },
              },
            },
          },
        },
      },
      sort: 'id:desc',
    },
  };

  const loading = ref(false);

  async function loadTrailData(id: number, showMessageIfNotFound = true) {
    try {
      loading.value = true;
      const result = (await findOne('trails', id, { populate })).data;
      trail.value = result as TrailSimple;
      loading.value = false;
      return result;
    } catch (e: any) {
      const i18n = useI18n();
      if (e?.error.name === 'NotFoundError' && showMessageIfNotFound) {
        setMessage(i18n.t('pages.trails.notFound'), 'red', true);
      }
    }
  }

  return { loadTrailData, trail, loading };
});
