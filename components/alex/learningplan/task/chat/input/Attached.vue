<template>
  <div class="bg-white flex gap-2 p-2 items-center">
    <alex-learningplan-task-chat-message-reference
      v-if="message"
      :id="message.id"
      class="w-full"
      :content="message.content"
      :user="message.user"
      @click="$emit('click:message')"
    />
    <alex-learningplan-task-submission-chip
      v-if="submission"
      class="bg-gray-blue w-full"
      :submission="submission"
      hide-info
      @click="$emit('click:submission')"
    />
    <alex-custom-button
      icon="mdi-close"
      variant="text"
      @click="$emit('click:close')"
    />
  </div>
</template>

<script setup lang="ts">
interface AttachedProps {
  message?: Message;
  submission?: AttachedSubmission;
}
withDefaults(defineProps<AttachedProps>(), {
  message: undefined,
  submission: undefined,
});
defineEmits(['click:close', 'click:message', 'click:submission']);
</script>

<style scoped></style>
