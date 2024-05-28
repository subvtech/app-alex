<template>
  <div class="bg-white flex gap-2 p-2 items-center">
    <alex-learningplan-task-chat-message-response
      v-if="messageResponse"
      :id="messageResponse.id"
      class="w-full"
      :audio="messageResponse.audio"
      :message="messageResponse"
      :user="messageResponse.user"
      @click="$emit('click:message', messageResponse)"
    />
    <alex-learningplan-task-submission-chip
      v-if="submissionResponse"
      class="bg-gray-blue w-full"
      :submission="submissionResponse"
      no-justification
      hide-info
      @click="$emit('click:submission', submissionResponse)"
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
  messageResponse?: Message;
  submissionResponse?: AttachedSubmission;
}
withDefaults(defineProps<AttachedProps>(), {
  messageResponse: undefined,
  submissionResponse: undefined,
});
defineEmits(['click:close', 'click:message', 'click:submission']);
</script>

<style scoped></style>
