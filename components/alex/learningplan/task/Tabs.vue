<template>
  <div class="tw-flex tw-flex-col tw-item-start tw-w-100 tw-grow">
    <div
      class="tw-top-0 tw-h-fit tw-sticky tw-bg-white tw-w-100 z-[1] border-bottom-1 border-gray-200"
    >
      <alex-custom-tabs v-model="activePage" :tabs="tabs" color="accent" />
    </div>
    <v-window v-model="activePage">
      <v-window-item value="1"
        ><alex-learningplan-task-events
          v-model="taskEvents"
          :loading="event.isLoading"
      /></v-window-item>
      <v-window-item class="v-window-item-full" value="2">
        <alex-learningplan-task-submissions
          class="tw-w-full"
          :submissions="submissions"
          @redirect-to-chat="(submission) => handleRedirectToChat(submission)"
      /></v-window-item>
      <v-window-item class="v-window-item-full" value="3">
        <alex-learningplan-task-chat
          v-model:attached-message="attachedMessage"
          class="tw-w-100 tw-grow task-chat"
          :task-member-id="taskMemberId"
          :is-sending-message="isSendingMessage"
          :loading="message.isLoading"
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
  message?: {
    isLoading?: boolean;
  };
  event: {
    events: TaskEvent[];
    isLoading?: boolean;
  };
  isSendingMessage?: boolean;
  members?: boolean;
}
const props = withDefaults(defineProps<TaskTabsProps>(), {
  submission: false,
  selectorParent: undefined,
  message: () => ({ isLoading: false }),
  isSendingMessage: false,
  members: false,
});
const activePage = defineModel({ required: true, default: '1' });
const attachedMessage = defineModel<Message>('attachedMessage');
const attachedSubmission =
  defineModel<AttachedSubmission>('attachedSubmission');
const { t } = useI18n();
const tabs = computed(() => {
  const submissions = {
    label: t('components.learningPlan.drawer.tabs.submissions.label'),
    value: '2',
  };
  const defaultTabs = [
    {
      label: t('components.learningPlan.drawer.tabs.events.label'),
      value: '1',
    },
    {
      label: t('components.learningPlan.drawer.tabs.comments.label'),
      value: '3',
    },
  ];
  if (!props.submission) {
    return defaultTabs;
  }
  return [...defaultTabs.slice(0, 1), submissions, ...defaultTabs.slice(1)];
});
const taskEvents = computed(() => orderEvents(props.event.events));
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
watch(activePage, (value) => {
  scrollToEnd(value, props.selectorParent);
});
watch(
  () => props.isSendingMessage,
  () => {
    scrollToEnd(activePage.value, props.selectorParent, 100);
  },
);
const scrollToEnd = (page: string, selectorParent?: string, ms = 500) => {
  setTimeout(() => {
    if (!selectorParent || page !== '3') return;
    const parent = document.querySelector(selectorParent);
    const chat = document.querySelector(`${selectorParent} .task-chat`);
    if (!chat || !parent) {
      return;
    }
    parent.scrollTo({ behavior: 'smooth', top: chat.clientHeight });
  }, ms);
};
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
