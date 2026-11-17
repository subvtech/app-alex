<template>
  <div class="evaluation-panel d-flex flex-column gap-3 tw-border pa-6 rounded-lg text-body-1 text-gray-800">
    <h3 class="text-gray-800 text-h3 mb-1">{{ t('components.courses.tasks.evaluation_panel.title') }}</h3>
    <div class="w-100 d-flex justify-space-between align-center">
      {{ t('components.courses.tasks.evaluation_panel.type') }}
      <alex-custom-chip
        status="secondary"
        :text="
          isRubric
            ? t('components.courses.tasks.evaluation_panel.rubric')
            : t('components.courses.tasks.evaluation_panel.criteria_group')
        "
      />
    </div>
    <div class="w-100 d-flex justify-space-between align-center">
      {{
        isRubric
          ? t('components.courses.tasks.evaluation_panel.rubric')
          : t('components.courses.tasks.evaluation_panel.group')
      }}
      <alex-custom-chip status="secondary" :text="evaluation?.evaluation_group?.name" />
    </div>

    <template v-if="isRubric">
      <div v-for="row in context.rubricRows.value" :key="row.criterion.id" class="w-100 mt-2">
        <p class="text-body-2 text-gray-800 mb-2">{{ row.criterion.text }}</p>
        <div class="d-flex flex-wrap ga-2">
          <alex-custom-button
            v-for="level in rubricLevels"
            :key="level.rating"
            size="small"
            :variant="row.selected === level.rating ? 'primary' : 'outlined'"
            :text="context.headers.value[level.header] || String(level.grade)"
            :disabled="readOnly"
            @click="context.grade(level.grade, row.criterion.id, true)"
          />
        </div>
      </div>
    </template>
    <template v-else>
      <div
        v-for="criteriaEvaluation in evaluation?.criteria_evaluations"
        :key="criteriaEvaluation.id"
        class="w-100 d-flex justify-space-between align-center ga-3 mt-2"
      >
        <span class="text-body-2">{{ criteriaEvaluation.criteria.criteria.name }}</span>
        <v-number-input
          :model-value="criteriaEvaluation.grade || 0"
          class="evaluation-panel__grade text-gray-600"
          density="compact"
          control-variant="split"
          hide-details
          variant="outlined"
          base-color="transparent"
          color="secondary-0"
          :min="0"
          :max="10"
          :step="0.5"
          :disabled="readOnly"
          @update:model-value="(grade) => context.grade(grade, criteriaEvaluation.id)"
        />
      </div>
    </template>

    <div class="d-flex justify-space-between align-center w-100 mt-4">
      <span class="text-gray-800 text-h5">{{ t('components.courses.tasks.evaluation_panel.final_grade') }}</span>
      <alex-custom-chip
        :text="`${context.finalGrade.value}/10`"
        status="secondary"
        text-classes="text-gray-600 text-body-2"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SubmissionEvaluationContext, SubmissionRubricRating } from '~/composables/useSubmissionEvaluationContext';

const props = defineProps<{ context: SubmissionEvaluationContext }>();
const { t } = useI18n();

const rubricLevels: {
  rating: SubmissionRubricRating;
  header: 'excellent' | 'good' | 'reasonable' | 'poor';
  grade: number;
}[] = [
  { rating: 'excellent', header: 'excellent', grade: 10 },
  { rating: 'good', header: 'good', grade: 7.5 },
  { rating: 'reasonable', header: 'reasonable', grade: 5 },
  { rating: 'bad', header: 'poor', grade: 2.5 },
];

const evaluation = computed(() => props.context.evaluation.value);
const isRubric = computed(() => evaluation.value?.evaluation_group?.type === 'rubric');
const readOnly = computed(() => !!evaluation.value?.evaluated_at);
</script>

<style scoped>
.evaluation-panel {
  width: 380px;
  flex-shrink: 0;
  overflow-y: auto;
}

.evaluation-panel__grade {
  max-width: 140px;
}
</style>
