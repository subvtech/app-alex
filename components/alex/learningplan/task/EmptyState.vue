<template>
  <div class="w-100 d-flex justify-center align-center pb-4 min-h-67">
    <div
      class="rounded-lg min-h-48 w-100 d-flex justify-center align-center"
      :class="dropArea ? 'drop-area' : 'empty-state'"
      @dragover.prevent="(e) => emits('dragOver', index, e)"
      @dragleave="(e) => emits('dragLeave', index, e)"
    >
      <v-fade-transition>
        <div v-if="!dropArea">
          <v-img
            :src="taskSections[index - 1].image"
            class="max-w-40 mb-4 mx-auto height-30 width-40"
          ></v-img>
          <p class="text-h4 text-gray-400 text-center">
            {{ taskSections[index - 1].text }}
          </p>
        </div>
      </v-fade-transition>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const props = defineProps<{
  index: number;
  dropArea: boolean;
}>();

const dropArea = computed(() => props.dropArea);

const emits = defineEmits(['dragOver', 'dragLeave']);

const taskSections = [
  {
    text: t('pages.task.emptyState.draft'),
    image: '/svg/emptyDraftTasks.svg',
  },
  {
    text: t('pages.task.emptyState.published'),
    image: '/svg/emptyPublishedTasks.svg',
  },
  {
    text: t('pages.task.emptyState.done'),
    image: '/svg/emptyFinishedTasks.svg',
  },
  {
    text: t('pages.task.emptyState.archived'),
    image: '/svg/emptyArchivedTasks.svg',
  },
];
</script>

<style scoped>
.drop-area {
  border: 1px dashed rgb(var(--v-theme-gray-400));
}
.empty-state {
  border: 1px solid transparent;
}
</style>
