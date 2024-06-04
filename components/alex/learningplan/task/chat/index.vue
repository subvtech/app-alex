<template>
  <div class="flex flex-col bg-gray-blue min-h-[400px] p-4 gap-2">
    <alex-learningplan-task-chat-message
      v-for="message in messages"
      :id="message.id"
      :key="message.id"
      :sent-at="message.sentAt"
      :user="message.user"
      :audio="message.audio"
      :message="message.message"
      :duration="message.audio?.duration"
      :response="message.response"
      :align="user?.id !== message.user.id ? 'left' : 'right'"
      @reply="(value) => handleAttachMessage(value)"
    />
  </div>
</template>

<script setup lang="ts">
type ChatProps = {
  messages: Message[];
};
const user = useStrapiUser();
const attachedMessage = defineModel<Message>('attachedMessage');
const handleAttachMessage = (content: Message) => {
  attachedMessage.value = content;
};
defineProps<ChatProps>();
defineEmits(['reply']);
</script>

<style scoped></style>
