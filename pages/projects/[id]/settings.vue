<template>
  <alex-project-settings
    v-if="!learningPlanStore.loading && learningPlanStore.learningPlan"
    :project="learningPlanStore.learningPlan"
    @update="emit('update')"
  />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
});

const emit = defineEmits(['update']);
const learningPlanStore = useLearningPlanStore();
</script>
