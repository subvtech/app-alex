<template>
  <div class="w-100 d-flex justify-center align-center pb-4">
    <div class="py-4 pb-4">
      <v-img
        :src="taskSections[index - 1].image"
        class="max-w-40 mb-4 mx-auto height-30 width-40"
      ></v-img>
      <p class="text-h4 text-gray-400">{{ taskSections[index - 1].text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();

defineProps<{
  index: number;
}>();

const taskSections = [
  {
    text: t('pages.task.emptyState.draft'),
    image: '/images/emptyDraftTasks.svg',
  },
  {
    text: t('pages.task.emptyState.published'),
    image: '/images/emptyPublishedTasks.svg',
  },
  {
    text: t('pages.task.emptyState.done'),
    image: '/images/emptyFinishedTasks.svg',
  },
];
</script>
