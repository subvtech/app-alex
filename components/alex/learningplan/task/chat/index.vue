<template>
  <div class="flex flex-col bg-gray-blue min-h-[400px] p-4 gap-2">
    <alex-learningplan-task-chat-message
      v-for="message in messages"
      :id="message.id"
      :key="message.id"
      :date="message.date"
      :user="message.user"
      :content="message.content"
      :current="message.current"
      :reference="message.reference"
    />
  </div>
</template>

<script setup lang="ts">
import { Message } from '~/models/simple/message';

type ChatProps = {
  messages: Message[];
};
defineProps<ChatProps>();
</script>

<style scoped></style>
