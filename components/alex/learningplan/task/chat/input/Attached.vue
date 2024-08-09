<template>
  <div class="bg-white tw-flex tw-gap-2 tw-p-2 tw-items-center">
    <alex-learningplan-task-chat-message-response
      v-if="messageResponse"
      :id="messageResponse.id"
      class="tw-w-full"
      :audio="messageResponse.audio"
      :message="messageResponse"
      :user="messageResponse.user"
      @click="$emit('message-click', messageResponse)"
    />
    <alex-learningplan-task-submission-chip
      v-if="submissionResponse"
      class="bg-gray-blue tw-w-full"
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
