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
      class="w-[auto] sm:!w-[450px] shadow-[#0001] drop-shadow-lg bg-white rounded-lg"
    >
      <div
        class="flex items-center p-4 gap-2 text-h4 text-gray-800 border-gray-100 border-bottom-1"
      >
        <h4 class="w-full">Entregas</h4>
        <p v-if="submissions.length" class="text-gray-400 text-body-1">
          {{ submissions.length }}
        </p>
      </div>
      <div class="p-4 max-h-[400px] overflow-y-scroll flex flex-col gap-2">
        <div v-if="!submissions.length">
          <h3 class="text-gray-500">Parece que não temos entregas ainda</h3>
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
