<template>
  <div class="d-flex flex-column ga-3">
    <div v-for="(question, index) in model" :key="question.id" class="bg-gray-blue rounded-lg pa-3">
      <div class="d-flex align-center ga-2 mb-2">
        <span class="text-body-3 text-gray-600">{{ index + 1 }}.</span>
        <alex-custom-chip :text="t(`${i18n}.questionTypes.${question.type}`)" size="small" variant="outlined" />
        <alex-custom-button
          v-if="edit"
          class="ml-auto"
          icon="mdi-close"
          size="small"
          variant="text"
          :title="t('components.courses.tasks.submission_items.remove')"
          @click="removeQuestion(question.id)"
        />
      </div>
      <alex-inputs-text-field
        :model-value="question.statement"
        :name="`quizStatement-${question.id}`"
        :label="t(`${i18n}.statement`)"
        :disabled="!edit"
        density="compact"
        @update:model-value="(statement: string) => updateQuestion(question.id, { statement })"
      />

      <template v-if="question.type === 'multiple_choice'">
        <p class="text-body-3 text-gray-500 mt-2 mb-1">{{ t(`${i18n}.correctHint`) }}</p>
        <v-radio-group
          :model-value="question.correctOption"
          color="accent"
          hide-details
          :disabled="!edit"
          @update:model-value="(correctOption) => updateQuestion(question.id, { correctOption })"
        >
          <div v-for="(option, optionIndex) in question.options" :key="optionIndex" class="d-flex align-center ga-2">
            <v-radio :value="optionIndex" density="compact" class="flex-grow-0" />
            <alex-inputs-text-field
              class="flex-grow-1"
              :model-value="option"
              :name="`quizOption-${question.id}-${optionIndex}`"
              :label="t(`${i18n}.option`, { n: optionIndex + 1 })"
              :disabled="!edit"
              density="compact"
              @update:model-value="(value: string) => updateOption(question, optionIndex, value)"
            />
            <alex-custom-button
              v-if="edit && question.options.length > 2"
              icon="mdi-close"
              size="small"
              variant="text"
              @click="removeOption(question, optionIndex)"
            />
          </div>
        </v-radio-group>
        <alex-custom-button
          v-if="edit"
          class="mt-1"
          :text="t(`${i18n}.addOption`)"
          prepend-icon="mdi-plus"
          size="small"
          variant="text"
          @click="updateQuestion(question.id, { options: [...question.options, ''] })"
        />
      </template>

      <template v-else-if="question.type === 'true_false'">
        <p class="text-body-3 text-gray-500 mt-2 mb-1">{{ t(`${i18n}.correctHint`) }}</p>
        <v-radio-group
          :model-value="question.correctBoolean"
          color="accent"
          inline
          hide-details
          :disabled="!edit"
          @update:model-value="(correctBoolean) => updateQuestion(question.id, { correctBoolean })"
        >
          <v-radio :label="t(`${i18n}.true`)" :value="true" density="compact" />
          <v-radio :label="t(`${i18n}.false`)" :value="false" density="compact" />
        </v-radio-group>
      </template>
    </div>

    <alex-custom-dropdown v-if="edit" :items="addOptions">
      <template #activator="{ props: dropdownProps }">
        <alex-custom-button
          v-bind="dropdownProps"
          class="align-self-start"
          :text="t(`${i18n}.addQuestion`)"
          prepend-icon="mdi-plus"
          size="small"
          variant="outlined"
        />
      </template>
    </alex-custom-dropdown>
  </div>
</template>

<script setup lang="ts">
import type { QuizQuestion, QuizQuestionType } from '~/composables/useSubmissionItems';

withDefaults(defineProps<{ edit?: boolean }>(), { edit: true });
const model = defineModel<QuizQuestion[]>({ default: () => [] });
const { t } = useI18n();
const i18n = 'components.courses.tasks.submission_items.quiz';

const questionTypes: QuizQuestionType[] = ['multiple_choice', 'true_false', 'open'];

const addOptions = computed(() =>
  questionTypes.map((type) => ({
    text: t(`${i18n}.questionTypes.${type}`),
    onClick: () => {
      model.value = [...model.value, createQuizQuestion(type)];
    },
  })),
);

const updateQuestion = (id: string, changes: Partial<QuizQuestion>) => {
  model.value = model.value.map((question) => (question.id === id ? { ...question, ...changes } : question));
};

const removeQuestion = (id: string) => {
  model.value = model.value.filter((question) => question.id !== id);
};

const updateOption = (question: QuizQuestion, optionIndex: number, value: string) => {
  const options = [...question.options];
  options[optionIndex] = value;
  updateQuestion(question.id, { options });
};

const removeOption = (question: QuizQuestion, optionIndex: number) => {
  const options = question.options.filter((_, index) => index !== optionIndex);
  let correctOption = question.correctOption;
  if (correctOption === optionIndex) correctOption = null;
  else if (correctOption !== null && correctOption > optionIndex) correctOption -= 1;
  updateQuestion(question.id, { options, correctOption });
};
</script>
