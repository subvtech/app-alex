<template>
  <div class="flex flex-col bg-gray-blue min-h-[400px] p-4 gap-2">
    <p
      v-if="error"
      class="text-body-1 w-full text-center text-error--1 my-auto"
    >
      Erro ao carregar as mensagens :/
    </p>
    <template v-if="user">
      <alex-learningplan-task-chat-message
        v-for="message in messages.data"
        :id="message.id"
        :key="message.id"
        :sent-at="new Date(message.sent_at)"
        :user="{
          id: message.learning_plan_member.user.id,
          name: getCurrentUserName(user.id, message.learning_plan_member),
          avatar: message.learning_plan_member.user?.avatar?.formats.small.url,
        }"
        :message="message.message"
        :align="
          user?.id !== message.learning_plan_member.user.id ? 'left' : 'right'
        "
        :response="
          message.response_to_message
            ? {
                id: message.response_to_message.id,
                message: message.response_to_message.message,
                user: {
                  id: message.response_to_message.learning_plan_member.user.id,
                  name: message.response_to_message.learning_plan_member.user
                    .fullname,
                },
                sentAt: message.response_to_message.sent_at,
              }
            : undefined
        "
        @reply="(value) => handleAttachMessage(value)"
        @message-click="(value) => handleReplyMessageClick(value?.id)"
        @submission-click="(value) => $emit('submission-click', value)"
      />
    </template>
    <div
      v-if="(status === 'pending' || loading) && !error"
      class="flex flex-col justify-center items-center gap-2 mt-2"
    >
      <v-progress-circular
        indeterminate
        color="secondary-0"
        size="40"
        width="4"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
type ChatProps = {
  taskMemberId: number;
  loading?: boolean;
};
const props = withDefaults(defineProps<ChatProps>(), {
  loading: false,
});
defineEmits(['submission-click']);
const { t } = useI18n();
const user = useStrapiUser();
const attachedMessage = defineModel<Message>('attachedMessage');
const {
  data: messages,
  status,
  error,
} = await useAsyncMessage(props.taskMemberId, {
  default: () => ({
    meta: { total: 0 },
    data: [] as TaskMemberMessage[],
  }),
  dedupe: 'cancel',
});

// Utils
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

// Handlers
const handleAttachMessage = (content: Message) => {
  attachedMessage.value = content;
};
const handleReplyMessageClick = (id?: number) => {
  if (!id) return;
  scrollAndHighlightElement(`#chat-message-${id}`, 'highlight-message');
};
</script>

<style scoped>
.highlight-message {
  background-color: rgb(var(--v-theme-gray-200)) !important;
  transition: background ease-in-out 400ms;
}
</style>
