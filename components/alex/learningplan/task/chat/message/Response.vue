<template>
  <div
    class="response tw-w-full bg-gray-blue tw-rounded-lg border-1 tw-border-gray-100"
    :class="[message && 'px-3 py-2']"
  >
    <div v-if="message" @click="$emit('message-click', message)">
      <h6 class="text-body-6 text-gray-600">{{ message.user.name }}</h6>
      <p v-if="message.audio" class="text-body-5 text-gray-400">
        {{ $t('components.learningPlan.drawer.task.chat.audio') }}
      </p>
      <p v-else class="text-body-5 text-gray-400 ellipsis lines-1">
        {{ message.message }}
      </p>
    </div>
    <alex-learningplan-task-submission-chip
      v-if="submission"
      :submission="submission"
      hide-info
      no-justification
      @click="$emit('submission-click', submission)"
    />
  </div>
</template>

<script setup lang="ts">
import { Message } from '@/models/simple/learninplanTaskMemberMessage';
type ResponseProps = {
  message?: Message;
  submission?: AttachedSubmission;
};
withDefaults(defineProps<ResponseProps>(), {
  message: undefined,
  submission: undefined,
});
type Emits = {
  'submission-click': [value?: AttachedSubmission];
  'message-click': [value?: Message];
};
defineEmits<Emits>();
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
