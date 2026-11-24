<template>
  <div class="d-flex flex-column ga-4">
    <div v-for="(question, index) in questions" :key="question.id">
      <div class="d-flex align-center ga-2 mb-1">
        <p class="text-body-2 text-gray-800">{{ index + 1 }}. {{ question.statement }}</p>
        <alex-custom-chip
          v-if="showResults && question.type !== 'open' && result(question) !== null"
          class="ml-auto"
          size="small"
          :status="result(question) ? 'green' : 'red'"
          :text="result(question) ? t(`${i18n}.correct`) : t(`${i18n}.incorrect`)"
        />
      </div>

      <v-radio-group
        v-if="question.type === 'multiple_choice'"
        :model-value="model[question.id]"
        color="accent"
        hide-details
        :disabled="readonly"
        @update:model-value="(value) => answer(question.id, value)"
      >
        <v-radio
          v-for="(option, optionIndex) in question.options"
          :key="optionIndex"
          :label="option"
          :value="optionIndex"
          density="compact"
        />
      </v-radio-group>

      <v-radio-group
        v-else-if="question.type === 'true_false'"
        :model-value="model[question.id]"
        color="accent"
        inline
        hide-details
        :disabled="readonly"
        @update:model-value="(value) => answer(question.id, value)"
      >
        <v-radio :label="t(`${i18n}.true`)" :value="true" density="compact" />
        <v-radio :label="t(`${i18n}.false`)" :value="false" density="compact" />
      </v-radio-group>

      <alex-inputs-text-area
        v-else
        :model-value="model[question.id] ?? ''"
        :name="`quizAnswer-${question.id}`"
        :disabled="readonly"
        @update:model-value="(value: string) => answer(question.id, value)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuizQuestion } from '~/composables/useSubmissionItems';

const props = withDefaults(defineProps<{ questions: QuizQuestion[]; readonly?: boolean }>(), { readonly: false });
const model = defineModel<Record<string, number | boolean | string | null>>({ default: () => ({}) });
const { t } = useI18n();
const i18n = 'components.courses.tasks.submission_items.quiz';

const showResults = computed(() => props.readonly);

const answer = (questionId: string, value: number | boolean | string | null) => {
  model.value = { ...model.value, [questionId]: value };
};

const result = (question: QuizQuestion) => {
  const value = model.value[question.id];
  if (value === undefined || value === null) return null;
  if (question.type === 'multiple_choice') return value === question.correctOption;
  if (question.type === 'true_false') return value === question.correctBoolean;
  return null;
};
</script>
