<template>
  <div class="flex flex-col bg-gray-blue min-h-[400px] p-4 gap-2">
    <template v-if="user">
      <alex-learningplan-task-chat-message
        v-for="message in messages.data"
        :id="message.id"
        :key="message.id"
        :sent-at="new Date(message.sent_at)"
        :user="{
          id: message.learning_plan_member.user.id,
          name: getCurrentUserName(user.id, message.learning_plan_member),
          avatar: message.learning_plan_member.user?.avatar?.url,
        }"
        :message="message.message"
        :align="
          user?.id !== message.learning_plan_member.user.id ? 'left' : 'right'
        "
        @reply="(value) => handleAttachMessage(value)"
        @message-click="(value) => handleReplyMessageClick(value?.id)"
        @submission-click="(value) => $emit('submission-click', value)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
type ChatProps = {
  taskMemberId: number;
};
const props = defineProps<ChatProps>();
defineEmits(['submission-click']);
const { t } = useI18n();
const user = useStrapiUser();
const strapiUtils = useStrapiUtils();
const attachedMessage = defineModel<Message>('attachedMessage');
const getMessages = (memberID: number) =>
  strapiUtils.find<TaskMemberMessage>('task-member-messages', {
    filters: {
      task_member: memberID,
    },
    populate: {
      learning_plan_member: {
        populate: ['user.avatar'],
      },
    },
  });
const { data: messages } = await useAsyncData(
  'task-submissions',
  () => getMessages(props.taskMemberId),
  {
    default: () => ({
      meta: { total: 0 },
      data: [] as TaskMemberMessage[],
    }),
    immediate: true,
  },
);
const handleAttachMessage = (content: Message) => {
  attachedMessage.value = content;
};
const handleReplyMessageClick = (id?: number) => {
  if (!id) return;
  scrollAndHighlightElement(`#chat-message-${id}`, 'highlight-message');
};
const getCurrentUserName = (
  currentUserID: number,
  member: LearningPlanMemberSimple,
) => {
  if (currentUserID === member.user?.id) {
    return t('components.learningPlan.drawer.task.chat.you', {
      name: member.user.fullname,
    });
  }
  return member.user.fullname;
};
</script>

<style scoped>
.highlight-message {
  background-color: rgb(var(--v-theme-gray-200)) !important;
  transition: background ease-in-out 400ms;
}
</style>
