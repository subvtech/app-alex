import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLearningPlanStore = defineStore('learning-plan', () => {
  const { findOne, find } = useStrapiUtils();

  const { setMessage } = useMessageStore();
  const i18n = useI18n();
  const learningPlan = ref<any>();

  const populate = [
    'cover_image',
    'media',
    'invitation_links',
    'learning_goals.verb',
    'members.user.avatar',
    'tags',
    'schedules',
  ];

  async function loadLearningPlan(id: number, showMessageIfNotFound = true) {
    try {
      // const result = await findOne('learningplans', id, { populate });
      const result = await find('learningplans', { filters: { id }, populate });

      learningPlan.value = result;

      return result;
    } catch (e: any) {
      if (e?.error.name === 'NotFoundError' && showMessageIfNotFound) {
        setMessage(i18n.t('pages.courses.notfound'), 'red', true);
      }
    }
  }

  return { learningPlan, loadLearningPlan };
});
