<template>
  <v-menu
    class="submission-menu"
    transition="slide-y-reverse-transition"
    close-on-content-click
  >
    <template v-for="(_, slot) in $slots" #[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
    <div
      class="tw-w-[auto] tw-sm:!w-[450px] tw-shadow-[#0001] tw-drop-shadow-lg bg-white rounded-lg"
    >
      <div
        class="tw-flex tw-items-center tw-p-4 tw-gap-2 text-gray-800 border-gray-100 border-bottom-1"
      >
        <h4 class="tw-w-full text-h4">
          {{ $t('components.learningPlan.drawer.task.submissions.label') }}
        </h4>
        <p v-if="submissions.length" class="text-gray-400 text-body-1">
          {{ submissions.length }}
        </p>
      </div>
      <div
        class="tw-p-4 tw-max-h-[400px] tw-overflow-y-scroll tw-flex tw-flex-col tw-gap-2"
      >
        <div v-if="!submissions.length">
          <h3 class="text-gray-500 text-body-1">
            {{ $t('components.learningPlan.drawer.missing.submissions') }}
          </h3>
        </div>
        <alex-learningplan-task-submission-chip
          v-for="(submission, index) in submissions"
          :key="index"
          :submission="submission"
          hide-info
          no-justification
          @click="$emit('click:select-submission', submission)"
        />
      </div>
    </div>
  </v-menu>
</template>

<script setup lang="ts">
type MenuSubmission = {
  submissions: AttachedSubmission[];
};
defineProps<MenuSubmission>();
defineEmits(['click:select-submission']);
</script>

<style scoped>
:global(.submission-menu .v-overlay__content) {
  padding-bottom: 16px;
}
</style>
