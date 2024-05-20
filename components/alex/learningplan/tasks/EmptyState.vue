<template>
  <div class="w-100 d-flex justify-center align-center pb-4">
    <div class="py-4 pb-4">
      <v-img
        :src="taskSections[index - 1].image"
        class="max-w-40 mb-4 mx-auto"
      ></v-img>
      <p class="text-h4 text-gray-400">{{ taskSections[index - 1].text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  index: number;
}>();

const taskSections = [
  {
    text: 'Nenhuma tarefa em rascunho!',
    image: '/images/emptyDraftTasks.svg',
  },
  {
    text: 'Nenhuma tarefa publicada!',
    image: '/images/emptyPublishedTasks.svg',
  },
  {
    text: 'Nenhuma tarefa encerrada!',
    image: '/images/emptyFinishedTasks.svg',
  },
];
</script>
