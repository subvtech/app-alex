<template>
  <alex-custom-dialog
    v-model="open"
    :title="$t(`${i18Dir}.createTitle`)"
    :main-button-text="$t(`${i18Dir}.create`)"
    :secondary-button-text="$t(`${i18Dir}.cancel`)"
    main-button-icon="mdi-plus"
    secondary-button-icon="mdi-close"
    @on-main-action="saveRubric"
    @on-secondary-action="open = false"
  >
    <alex-inputs-editable-text
      v-model="name"
      class="text-h2 text-gray-500 py-2 mb-4 tw-resize-none"
      tag="h2"
      :placeholder="$t(`${i18Dir}.typeName`)"
      cant-edit
    />
    <!-- Passar 'data' -->
    <alex-learningplan-evaluation-rubrics ref="rubrics" :criteria="formattedCriteria" :data="formattedData" editable />
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

const user = useStrapiUser();
const strapiClient = useStrapiClient();
const { getUserEvaluations } = useTaskEvaluation(0, 0, user);
const { setMessage } = useMessageStore();

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

  return [];
});

const checkContent = (content) => {
  if (content.length === 1) {
    setMessage('Selecione ao menos um critério', 'warning', true);
    return false;
  }

  content.forEach((row) => {
    if (row.criterion.id && (!row.bad || !row.good || !row.reasonable || !row.excellent)) {
      setMessage('A rúbrica possui algum campo vazio', 'warning', true);
      return false;
    }
  });

  return true;
};

const saveRubric = () => {
  if (!rubrics.value) {
    setMessage('Falha ao salvar rubrica', 'error', true);
  }

  if (!name.value) {
    setMessage('Defina um nome para a rubrica', 'warning', true);
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

  strapiClient(`/evaluation-groups/create-group`, {
    method: 'POST',
    body: {
      group: evaluationGroup,
      content,
    },
  })
    .then(() => {
      setMessage('Rubrica criada com sucesso', 'success', true);
      emit('update');
    })
    .catch(() => {
      setMessage('Falha ao criar rubrica', 'error', true);
    })
    .finally(() => {
      open.value = false;
    });
};

watch(open, (open) => {
  if (!open) {
    name.value = '';
    return;
  }

  name.value = props.editContent?.name ?? '';

  // Format rubrics table content
  if (!props.editContent) {
    return;
  }

  const rows = props.editContent?.rubric_grade_levels?.[0]?.grade_level_criterias?.length ?? 0;
  const data: any = [];

  for (let i = 0; i < rows; i++) {
    data.push({});
  }

  console.log(props.editContent);

  props.editContent.rubric_grade_levels.forEach((level) => {
    const field = gradeToField[level.grade.toString()];
    console.log('Field', field);

    level.grade_level_criterias.forEach((criteria, index) => {
      console.log(`- ${criteria.justification} (${index})`);
      data[index][field] = criteria.justification;
    });
  });

  console.log('Formatted:', data);
});
</script>
