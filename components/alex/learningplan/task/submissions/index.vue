<template>
  <div class="d-flex flex-column ga-4 py-4">
    <alex-learningplan-task-submission-chip
      v-for="(submission, index) in submissions"
      :key="index"
      :submission="submission"
      :hide-infos="props.hideInfo"
      @redirect-to-chat="(submission) => $emit('redirect-to-chat', submission)"
    />
  </div>
</template>

<script setup lang="ts">
interface CompProps {
  hideInfo?: boolean;
  submissions: AttachedSubmission[];
}
type Emits = {
  'redirect-to-chat': [submission: AttachedSubmission];
};
defineEmits<Emits>();
const props = withDefaults(defineProps<CompProps>(), {
  hideInfo: false,
});
</script>
