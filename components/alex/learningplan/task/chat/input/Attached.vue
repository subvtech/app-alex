<template>
  <div class="bg-white flex gap-2 p-2 items-center">
    <alex-learningplan-task-chat-message-response
      v-if="messageResponse"
      :id="messageResponse.id"
      class="w-full"
      :audio="messageResponse.audio"
      :message="messageResponse"
      :user="messageResponse.user"
      @click="$emit('message-click', messageResponse)"
    />
    <alex-learningplan-task-submission-chip
      v-if="submissionResponse"
      class="bg-gray-blue w-full"
      :submission="submissionResponse"
      no-justification
      hide-info
      @click="$emit('submission-click', submissionResponse)"
    />
    <alex-custom-button
      icon="mdi-close"
      variant="text"
      @click="$emit('close-click')"
    />
  </div>
</template>

<script setup lang="ts">
interface AttachedProps {
  messageResponse?: Message;
  submissionResponse?: AttachedSubmission;
}
withDefaults(defineProps<AttachedProps>(), {
  messageResponse: undefined,
  submissionResponse: undefined,
});
defineEmits(['close-click', 'message-click', 'submission-click']);
</script>

<style scoped></style>
