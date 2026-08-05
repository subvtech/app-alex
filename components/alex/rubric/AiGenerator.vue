<template>
  <slot name="activator" :open="openOptions" :loading="isGenerating">
    <alex-custom-button
      variant="secondary"
      size="large"
      prepend-icon="mdi-creation-outline"
      :loading="isGenerating"
      @click="openOptions"
    >
      {{ $t(`${i18Dir}.generate`) }}
    </alex-custom-button>
  </slot>

  <alex-custom-dialog
    v-model="optionsOpen"
    :title="$t(`${i18Dir}.dialogTitle`)"
    :main-button-text="$t(`${i18Dir}.generate`)"
    :secondary-button-text="$t('pages.evaluations.rubrics.cancel')"
    main-button-icon="mdi-creation-outline"
    secondary-button-icon="mdi-close"
    :loading="isGenerating"
    :max-width="560"
    body-classes="pa-6 d-flex flex-column ga-4"
    @on-main-action="generate"
    @on-secondary-action="optionsOpen = false"
  >
    <p class="text-body-2 text-gray-600">
      {{ taskTitle }}
    </p>

    <v-select
      v-model="criteriaCount"
      :items="criteriaOptions"
      :label="$t(`${i18Dir}.criteriaCount`)"
      density="comfortable"
      variant="outlined"
      hide-details
    />

    <v-textarea
      v-model="extraInstructions"
      :label="$t(`${i18Dir}.extraInstructions`)"
      :placeholder="$t(`${i18Dir}.extraInstructionsHint`)"
      density="comfortable"
      variant="outlined"
      rows="3"
      auto-grow
      hide-details
    />

    <v-alert type="info" variant="tonal" density="compact" class="text-body-2">
      {{ $t(`${i18Dir}.reviewNotice`) }}
    </v-alert>
  </alex-custom-dialog>

  <rubrics-create
    v-if="generated"
    :key="generatedKey"
    v-model="reviewOpen"
    :edit-content="generated"
    @update="onSaved"
  />
</template>

<script setup lang="ts">
import RubricsCreate from '@/pages/evaluations/me/-components/rubrics/Create.vue';
import type { RubricEditContent } from '@/utils/rubric';

const i18Dir = 'pages.evaluations.rubrics.ai';

interface AiGeneratorProps {
  taskTitle: string;
  taskDescription?: unknown;
  learningGoals?: string[];
}

const props = withDefaults(defineProps<AiGeneratorProps>(), {
  taskDescription: undefined,
  learningGoals: () => [],
});

const emit = defineEmits<{ saved: [] }>();

const { isGenerating, generateFromTask } = useRubricGeneration();

const optionsOpen = ref(false);
const reviewOpen = ref(false);
const criteriaCount = ref(5);
const extraInstructions = ref('');
const generated = ref<RubricEditContent | null>(null);
const generatedKey = ref(0);

const criteriaOptions = [3, 4, 5, 6, 7, 8];

const openOptions = () => {
  optionsOpen.value = true;
};

const generate = async () => {
  const result = await generateFromTask({
    title: props.taskTitle,
    description: props.taskDescription,
    learningGoals: props.learningGoals,
    criteriaCount: criteriaCount.value,
    extraInstructions: extraInstructions.value,
  });

  if (!result) {
    return;
  }

  generated.value = result;
  generatedKey.value += 1;
  optionsOpen.value = false;
  reviewOpen.value = true;
};

const onSaved = () => {
  reviewOpen.value = false;
  generated.value = null;
  extraInstructions.value = '';
  emit('saved');
};
</script>
