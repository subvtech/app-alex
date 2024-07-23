<template>
  <div class="d-flex flex-column ga-4 py-4">
    <alex-learningplan-task-submission-chip
      v-for="(submission, index) in submissions"
      :key="index"
      :submission="submission"
      :no-justification="submission.status === 'in_review'"
      :hide-infos="props.hideInfo"
      @redirect-to-chat="(submission) => $emit('redirect-to-chat', submission)"
      @click="handleSelectSubmission"
    />
    <alex-learningplan-task-submission-create
      ref="dialog"
      :title="task.title"
      :deadline="task.deadline"
      :restrictions="task.restrictions"
      :task-member-id="task.taskMemberId"
      :last-submission="selectedSubmission?.submission"
      :task-status="task.status"
      read-only
    />
  </div>
</template>

<script setup lang="ts">
interface CompProps {
  task: {
    id: number;
    taskMemberId: number;
    title: string;
    deadline?: string;
    status: TaskMemberStatus;
    restrictions: string[];
  };
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
const dialog = ref<null | { openDialog: () => void }>(null);
const selectedSubmission = ref<AttachedSubmission>();
function handleSelectSubmission(submission: AttachedSubmission) {
  dialog.value?.openDialog();
  selectedSubmission.value = submission;
}
</script>
