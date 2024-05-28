<template>
  <!-- *Colocar o componente de audio na linha 89 -->
  <div class="d-flex flex-column ga-4 py-4">
    <alex-learningplan-task-submission-chip
      v-for="(submission, index) in submissions"
      :key="index"
      :submission="submission"
      :hide-infos="props.hideInfo"
    />
  </div>
</template>

<script setup lang="ts">
interface CompProps {
  // Esconde os icones laterais de informação em TODOS os registros
  hideInfo?: boolean;
  submissions: AttachedSubmission[];
}

const props = withDefaults(defineProps<CompProps>(), {
  hideInfo: false,
});
</script>
