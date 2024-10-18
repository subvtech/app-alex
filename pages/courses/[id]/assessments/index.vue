<script setup lang="ts">
const learningPlanStore = useLearningPlanStore();
const assessments = ref([]);
const search = ref('');
const isLoading = ref(false);
</script>

<template>
  <div class="bg-white rounded-lg pa-6 tw-w-100 tw-min-h-[500px]">
    <div
      class="d-flex flex-wrap w-100 gap-4 gap-sm-1"
      :class="!assessments.length ? 'justify-end' : 'justify-space-between mb-6'"
    >
      <alex-inputs-text-field
        v-show="assessments.length"
        v-model="search"
        name="search"
        :placeholder="$t('pages.assessments.findAssessment')"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        class="w-50"
        size="default"
        style="min-width: 160px; max-width: 320px"
        density="comfortable"
      />

      <alex-custom-button
        v-if="learningPlanStore.userIsFacilitator"
        prepend-icon="mdi-plus"
        size="large"
        @click="console.log"
      >
        {{ $t('pages.assessments.newAssessment') }}</alex-custom-button
      >
    </div>
    <div v-if="isLoading"></div>
    <div
      v-else-if="!assessments.length"
      class="d-flex align-center justify-center flex-column tw-h-full tw-min-h-[400px]"
    >
      <img src="public/svg/emptyAssessments.svg" alt="Empty trails" />
      <p class="text-center text-gray-400 text-h3 mt-4">{{ $t('pages.assessments.emptyStateText') }}</p>
    </div>
    <div v-else>
      <div class="d-flex flex-wrap gap-4 gap-sm-1">
        <!-- <div v-for="assessment in assessments" :key="assessment.id" class="w-100">
          <alex-assessment-card :assessment="assessment" />
        </div> -->
      </div>
    </div>
  </div>
</template>
