<template>
  <alex-custom-dialog
    v-model="open"
    :title="props.editContent && !props.editContent?.create ? $t(`${i18Dir}.editRubric`) : $t(`${i18Dir}.createTitle`)"
    :main-button-text="props.editContent && !props.editContent?.create ? $t(`${i18Dir}.edit`) : $t(`${i18Dir}.create`)"
    :secondary-button-text="$t(`${i18Dir}.cancel`)"
    :main-button-icon="props.editContent && !props.editContent?.create ? 'mdi-pencil' : 'mdi-plus'"
    secondary-button-icon="mdi-close"
    body-classes="bg-white d-flex justify-center align-center flex-column py-6"
    :max-width="1500"
    maximizable
    :loading="isLoading"
    @on-main-action="saveRubric"
    @on-secondary-action="open = false"
  >
    <div>
      <alex-inputs-editable-text
        v-model="name"
        class="text-h2 text-gray-500 py-2 mb-4 tw-resize-none"
        tag="h2"
        :placeholder="$t(`${i18Dir}.typeName`)"
        cant-edit
      />
      <!-- Passar 'data' -->
      <alex-learningplan-evaluation-rubrics
        ref="rubrics"
        :criteria="formattedCriteria"
        :data="formattedData"
        editable
      />
    </div>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
const i18Dir = 'pages.evaluations.rubrics';

const gradeToField = {
  '2.5': 'bad',
  '5': 'reasonable',
  '7.5': 'good',
  '10': 'excellent',
};

const name = ref<string>('');
const rubrics = ref<null | any>(null);

const { t } = useI18n();
const user = useStrapiUser();
const { update } = useStrapi();
const strapiClient = useStrapiClient();
const { getUserEvaluations } = useTaskEvaluation(0, 0, user);
const { setMessage } = useMessageStore();
const isLoading = ref(false);

const { data: criteria } = getUserEvaluations();

const formattedCriteria = computed(() => criteria.value?.map(({ id, name }) => ({ id, text: name })) ?? []);

const open = defineModel<boolean>({ required: true });

interface CreateModalProps {
  editContent: null | any;
}

const props = defineProps<CreateModalProps>();

const emit = defineEmits(['update']);

const formattedData = computed(() => {
  if (!props.editContent) {
    return [];
  }

  const rows = props.editContent?.rubric_grade_levels?.[0]?.grade_level_criterias?.length ?? 0;
  const data: any = [];

  for (let i = 0; i < rows; i++) {
    data.push({});
  }

  props.editContent.rubric_grade_levels.forEach((gradeLevel) => {
    const field = gradeToField[gradeLevel.grade.toString()];

    gradeLevel.grade_level_criterias?.forEach((criteria, index) => {
      data[index][field] = criteria.justification;
      data[index].criterion = {
        id: criteria?.evaluation_criterion?.id ?? 0,
        text: criteria?.evaluation_criterion?.name ?? '',
      };
    });
  });

  return data;
});

const checkContent = (content) => {
  if (content.length === 1) {
    setMessage(t(`${i18Dir}.selectCriteria`), 'warning', true);
    return false;
  }

  content.forEach((row) => {
    if (row.criterion.id && (!row.bad || !row.good || !row.reasonable || !row.excellent)) {
      setMessage(t(`${i18Dir}.emptyField`), 'warning', true);
      return false;
    }
  });

  return true;
};

const saveRubric = () => {
  if (!rubrics.value) {
    setMessage(t(`${i18Dir}.saveFail`), 'error', true);
    return;
  }

  if (!name.value) {
    setMessage(t(`${i18Dir}.missingName`), 'warning', true);
    return;
  }

  const content = rubrics.value.getContent();

  if (!checkContent(content)) {
    return;
  }

  content.pop();

  const criteria = [...new Set(content.map(({ criterion }) => criterion.id))];

  const evaluationGroup = {
    name: name.value,
    type: 'rubric',
    user: user.value?.id ?? null,
    evaluation_criterias: criteria,
  };

  const shouldCreate =
    !props.editContent ||
    !props.editContent.id ||
    (props.editContent && props.editContent?.create) ||
    Boolean(props.editContent.task_submission_evaluations?.length);

  if (shouldCreate) {
    createRubric(evaluationGroup, content);
    return;
  }

  editRubric(evaluationGroup, content);
};

const createRubric = async (evaluationGroup, content) => {
  console.log('Evaluation:', evaluationGroup);
  console.log('Content:', content);
  // return;
  isLoading.value = true;
  try {
    await strapiClient('/evaluation-groups/create-group', {
      method: 'POST',
      body: {
        group: evaluationGroup,
        content,
      },
    });

    // Caso a rubrica já esteja associada a uma avaliação, será criada
    // uma nova e a original será marcada como desabilitada (disabled_at)
    if (props.editContent?.id) {
      await update('evaluation-groups', props.editContent.id, {
        disabled_at: new Date(),
      });
    }

    setMessage(props.editContent ? t(`${i18Dir}.editSuccess`) : t(`${i18Dir}.createSuccess`), 'success', true);
    emit('update');
    open.value = false;
  } catch (e) {
    console.error(e);
    setMessage(props.editContent ? t(`${i18Dir}.editFail`) : t(`${i18Dir}.createFail`), 'error', true);
  } finally {
    isLoading.value = false;
  }
};

// TODO: Fix Update
const editRubric = async (evaluationGroup, content) => {
  isLoading.value = true;
  try {
    await update('evaluation-groups', props.editContent.id, {
      name: name.value,
      evaluation_criterias: evaluationGroup.evaluation_criterias,
      rubric_grade_levels: [],
    });

    await strapiClient('/evaluation-groups/edit-group', {
      method: 'PUT',
      body: {
        id: props.editContent.id,
        group: evaluationGroup,
        content,
      },
    });

    setMessage(t(`${i18Dir}.editSuccess`), 'success', true);
    emit('update');
    open.value = false;
  } catch (e) {
    console.error(e);
    setMessage(t(`${i18Dir}.editFail`), 'error', true);
  } finally {
    isLoading.value = false;
  }
};

watch(open, (open) => {
  if (!open) {
    name.value = '';
    isLoading.value = false;
    return;
  }

  name.value = props.editContent?.name ?? '';
});
</script>
