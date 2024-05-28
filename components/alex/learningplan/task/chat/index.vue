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
      :current="message.current"
      :response="message.response"
    />
  </div>
</template>

<script setup lang="ts">
type ChatProps = {
  messages: Message[];
};
defineProps<ChatProps>();
</script>

<style scoped></style>
