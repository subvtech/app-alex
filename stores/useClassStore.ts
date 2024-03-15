import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useClassStore = defineStore('learning-class', () => {
  const learningPlanStore = useLearningPlanStore();

  const classId = ref<number>(0);

  const currentClass = computed<ClassSimple | undefined>(() => {
    if (classId.value && learningPlanStore.learningPlan?.classes.length) {
      return learningPlanStore.learningPlan?.classes.find(
        (c) => c.id === classId.value,
      );
    }
  });

  return {
    classId,
    currentClass,
  };
});
