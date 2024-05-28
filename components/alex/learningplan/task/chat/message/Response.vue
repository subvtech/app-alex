<template>
  <div
    v-if="messageResponse"
    class="response bg-gray-blue px-3 py-2 rounded-lg border-1 border-gray-100"
  >
    <h6 class="text-body-6 text-gray-600">{{ messageResponse.user.name }}</h6>
    <p v-if="messageResponse.audio" class="text-body-5 text-gray-400">Áudio</p>
    <p v-else class="text-body-5 text-gray-400 ellipsis lines-1">
      {{ messageResponse.message }}
    </p>
  </div>
  <alex-learningplan-task-submission-chip
    v-if="submissionResponse"
    :submission="submissionResponse"
    hide-info
    no-justification
    class="bg-gray-blue"
  />
</template>

<script setup lang="ts">
import { Message } from '@/models/simple/learninplanTaskMemberMessage';
type ResponseProps = {
  messageResponse?: Message;
  submissionResponse?: AttachedSubmission;
};
withDefaults(defineProps<ResponseProps>(), {
  messageResponse: undefined,
  submissionResponse: undefined,
});
defineEmits(['click:message', 'click:submission']);
</script>

<style scoped lang="scss">
.response:hover {
  cursor: pointer;
  background: rgb(var(--v-theme-gray-100)) !important;
}
.response:active {
  background: rgb(var(--v-theme-gray-200)) !important;
}
</style>
