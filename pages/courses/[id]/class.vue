<template>
  <div>
    curso
    {{ learningPlanStore.learningPlan }}
    <br />
    professor
    {{ learningPlanStore.owner }}
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';

// const { find, findOne, update } = useStrapi();
const route = useRoute();

const learningPlanStore = useLearningPlanStore();
// const learningPlanId = computed(() => parseInt(route.params?.id.toString()));

// await useAsyncData('user', () =>
//   learningPlanStore.loadLearningPlan(learningPlanId.value),
// );
</script>
