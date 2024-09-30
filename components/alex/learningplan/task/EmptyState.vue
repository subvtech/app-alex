<template>
  <div class="w-100 d-flex justify-center align-center pb-4 min-h-67">
    <div
      class="rounded-lg min-h-48 w-100 d-flex justify-center align-center"
      :class="dropArea ? 'drop-area' : 'empty-state'"
      @dragover.prevent="(e) => emits('dragOver', index, e)"
      @dragleave="(e) => emits('dragLeave', e)"
    >
      <v-fade-transition>
        <div v-if="!dropArea">
          <v-img
            :src="taskSections[type].image"
            class="max-w-40 mb-4 mx-auto height-30 width-40"
          ></v-img>
          <p class="text-h4 text-gray-400 text-center">
            {{ taskSections[type].text }}
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
  type: 'backlog' | 'draft' | 'published' | 'done' | 'archived' | 'sprint';
  message?: string;
  dropArea: boolean;
}>();

const dropArea = computed(() => props.dropArea);

const emits = defineEmits(['dragOver', 'dragLeave']);
const taskSections = {
  backlog: {
    text: t('pages.task.emptyState.backlog'),
    image: '/svg/emptyDraftTasks.svg',
  },
  draft: {
    text: t('pages.task.emptyState.draft'),
    image: '/svg/emptyDraftTasks.svg',
  },
  published: {
    text: t('pages.task.emptyState.draft'),
    image: '/svg/emptyDraftTasks.svg',
  },
  done: {
    text: t('pages.task.emptyState.done'),
    image: '/svg/emptyFinishedTasks.svg',
  },
  archived: {
    text: t('pages.task.emptyState.archived'),
    image: '/svg/emptyArchivedTasks.svg',
  },
  sprint: {
    text: props.message,
    image: 'public/svg/emptySprint.svg',
  },
};
</script>

<style scoped>
.drop-area {
  border: 1px dashed rgb(var(--v-theme-gray-400));
}
.empty-state {
  border: 1px solid transparent;
}
</style>
