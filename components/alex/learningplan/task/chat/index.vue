<template>
  <div class="flex flex-col bg-gray-blue min-h-[400px] p-4 gap-2">
    <alex-learningplan-task-chat-message
      v-for="message in messages"
      :id="message.id"
      :key="message.id"
      :date="message.date"
      :user="message.user"
      :content="{
        audio: message.content.audio?.src,
        text: message.content.text,
      }"
      :duration="message.content.audio?.duration"
      :current="message.current"
      :reference="message.reference"
    />
  </div>
</template>

<script setup lang="ts">
type ChatProps = {
  messages: ChatMessage[];
};
defineProps<ChatProps>();
</script>

<style scoped></style>
