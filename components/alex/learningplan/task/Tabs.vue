<template>
  <div class="flex flex-col item-start w-100 grow">
    <div
      class="top-0 h-fit sticky bg-white w-100 z-[1] border-bottom-1 border-gray-200"
    >
      <alex-custom-tabs v-model="activePage" :tabs="tabs" color="accent" />
    </div>
    <v-window v-model="activePage">
      <v-window-item value="1"
        ><alex-learningplan-task-events v-model="taskEvents"
      /></v-window-item>
      <v-window-item class="v-window-item-full" value="2">
        <alex-learningplan-task-submissions
          class="w-full"
          :submissions="submissions"
          @redirect-to-chat="(submission) => handleRedirectToChat(submission)"
      /></v-window-item>
      <v-window-item class="v-window-item-full" value="3">
        <alex-learningplan-task-chat
          v-model:attached-message="attachedMessage"
          class="w-100 grow"
          :task-member-id="taskMemberId"
          @submission-click="handleSubmission"
        />
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup lang="ts">
import { orderEvents } from '~/utils';

interface TaskTabsProps {
  taskMemberId: number;
  submission?: boolean;
  submissions: AttachedSubmission[];
  selectorParent?: string;
  events: TaskEvent[];
}
const props = withDefaults(defineProps<TaskTabsProps>(), {
  submission: false,
  selectorParent: undefined,
});
const activePage = defineModel({ required: true, default: '1' });
const attachedMessage = defineModel<Message>('attachedMessage');
const attachedSubmission =
  defineModel<AttachedSubmission>('attachedSubmission');
const tabs = computed(() => {
  const submissions = {
    label: 'Entregas',
    value: '2',
  };
  const defaultTabs = [
    {
      label: 'Eventos',
      value: '1',
    },
    {
      label: 'Comentários',
      value: '3',
    },
  ];
  if (!props.submission) {
    return defaultTabs;
  }
  return [...defaultTabs.slice(0, 1), submissions, ...defaultTabs.slice(1)];
});
const taskEvents = computed(() => orderEvents(props.events));
const handleSubmission = (value: AttachedSubmission) => {
  activePage.value = '2';
  setTimeout(
    () =>
      scrollAndHighlightElement(
        `#submission-chip-${value.id}`,
        'highlight-submission-chip',
      ),
    500,
  );
};
const handleRedirectToChat = (submission: AttachedSubmission) => {
  attachedSubmission.value = submission;
  activePage.value = '3';
};
watch(activePage, () => {
  if (!props.selectorParent || activePage.value !== '3') return;
  const parent = document.querySelector(props.selectorParent);
  setTimeout(() => {
    parent?.scrollTo({ behavior: 'smooth', top: parent.clientHeight });
  }, 300);
});
</script>

<style scoped lang="scss">
:deep(.v-window__container) {
  width: 100%;
}
:deep(.v-window-item.v-window-item-full) {
  width: 100%;
  display: flex;
  flex-grow: 1;
}
:deep(.v-window) {
  width: 100%;
  display: flex;
  flex-grow: 1;
}
</style>
