<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-1">
      <p class="text-body-4 text-gray-800 tw-font-weight-bold">{{ t(`${i18n}.label`) }}</p>
      <alex-custom-dropdown v-if="edit" :items="addOptions">
        <template #activator="{ props: dropdownProps }">
          <alex-custom-button
            v-bind="dropdownProps"
            :text="t(`${i18n}.add`)"
            prepend-icon="mdi-plus"
            size="small"
            variant="tertiary"
          />
        </template>
      </alex-custom-dropdown>
    </div>
    <p class="text-body-3 text-gray-500 mb-3">{{ t(`${i18n}.hint`) }}</p>

    <p v-if="!model.length" class="text-body-3 text-gray-400">{{ t(`${i18n}.empty`) }}</p>

    <div class="d-flex flex-column ga-3">
      <div v-for="(item, index) in model" :key="item.id" class="tw-border rounded-lg pa-4">
        <div class="d-flex align-center ga-2 mb-3">
          <span class="text-body-3 text-gray-500">{{ index + 1 }}.</span>
          <alex-custom-chip
            :text="t(`${i18n}.types.${item.type}`)"
            :prepend-icon="typeIcons[item.type]"
            size="small"
            status="secondary"
            variant="tonal"
          />
          <alex-custom-button
            v-if="edit"
            class="ml-auto"
            icon="mdi-trash-can-outline"
            size="small"
            variant="text"
            :title="t(`${i18n}.remove`)"
            @click="removeItem(item.id)"
          />
        </div>
        <alex-inputs-text-field
          :model-value="item.title"
          :name="`submissionItemTitle-${item.id}`"
          :label="t(`${i18n}.titleLabel`)"
          :disabled="!edit"
          density="compact"
          @update:model-value="(title: string) => updateItem(item.id, { title })"
        />
        <alex-learningplan-task-submission-items-quiz-builder
          v-if="item.type === 'quiz'"
          class="mt-3"
          :model-value="item.questions"
          :edit="edit"
          @update:model-value="(questions: QuizQuestion[]) => updateItem(item.id, { questions })"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuizQuestion, SubmissionItem, SubmissionItemType } from '~/composables/useSubmissionItems';

withDefaults(defineProps<{ edit?: boolean }>(), { edit: true });
const model = defineModel<SubmissionItem[]>({ default: () => [] });
const { t } = useI18n();
const i18n = 'components.courses.tasks.submission_items';

const typeIcons: Record<SubmissionItemType, string> = {
  text: 'mdi-text',
  image: 'mdi-image-outline',
  video: 'mdi-video-outline',
  file: 'mdi-paperclip',
  url: 'mdi-link-variant',
  quiz: 'mdi-help-circle-outline',
};

const addItem = (type: SubmissionItemType) => {
  model.value = [...model.value, { id: createSubmissionItemId(), type, title: '', questions: [] }];
};

const addOptions = computed(() =>
  (Object.keys(typeIcons) as SubmissionItemType[]).map((type) => ({
    text: t(`${i18n}.types.${type}`),
    icon: typeIcons[type],
    onClick: () => addItem(type),
  })),
);

const updateItem = (id: string, changes: Partial<SubmissionItem>) => {
  model.value = model.value.map((item) => (item.id === id ? { ...item, ...changes } : item));
};

const removeItem = (id: string) => {
  model.value = model.value.filter((item) => item.id !== id);
};
</script>
