<template>
  <alex-custom-dialog
    v-model="dialog"
    :title="title"
    :main-button-text="submitButtonText"
    :main-button-disabled="!form.groupId"
    :loading="loading"
    @on-secondary-action="dialog = false"
    @on-main-action="onSubmit"
  >
    <alex-inputs-radio-button
      v-model="form.groupType"
      :label="question"
      name="evaluationGroupType"
      required
      :buttons="[
        { label: 'Grupo de critérios', value: 'standard' },
        { label: 'Rubrica', value: 'rubric' },
      ]"
      @update:model-value="onChangeGroupType"
    />
    <alex-inputs-select
      v-model="form.groupId"
      name="evaluationGroupId"
      label="Critérios avaliativos"
      placeholder="Selecione os critérios avaliativos"
      required
      :items="evaluationGroups"
      item-title="name"
      item-value="id"
      @update:model-value="syncCriterias"
    />
    <template v-if="form.groupId">
      <div class="pa-2 tw-full text-body-2 bg-gray-blue d-flex justify-space-between tw-rounded-t-lg">
        <div>Critério</div>
        <div class="tw-min-w-[100px] sm:tw-w-[100px]">Peso</div>
      </div>
      <div
        v-for="criteria in form.evaluationCriterias"
        :key="`criteria-${criteria?.id}`"
        class="pa-2 tw-full text-body-1 d-flex justify-space-between align-center tw-border-b"
      >
        <div>{{ criteria.name }}</div>
        <div class="tw-min-w-[100px] sm:tw-w-[100px] tw-max-h-[36px]">
          <alex-inputs-text-field
            v-model="criteria.weight"
            :name="`criteria-weight-${criteria.id}`"
            required
            type="number"
            class="tw-full tw-max-h-[36px]"
            density="compact"
          />
        </div>
      </div>
    </template>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
/*
  Seleção de rubrica / grupo de critérios avaliativos. Usado tanto para associar
  a avaliação a uma tarefa quanto a uma entrega específica.
*/
type EvaluationGroupType = 'standard' | 'rubric';

type SelectedCriteria = {
  id: number;
  name: string;
  weight: number;
};

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title?: string;
    question?: string;
    submitButtonText?: string;
    loading?: boolean;
    groupId?: number | null;
    groupType?: EvaluationGroupType;
    /* peso já definido por critério, no formato { [criteriaId]: weight } */
    criteriaWeights?: Record<number, number>;
  }>(),
  {
    title: 'Tipo de avaliação',
    question: 'Como deseja avaliar?',
    submitButtonText: 'Associar',
    loading: false,
    groupId: null,
    groupType: 'standard',
    criteriaWeights: () => ({}),
  },
);

type Emits = {
  'update:modelValue': [value: boolean];
  submit: [
    payload: { groupId: number | null; groupType: EvaluationGroupType; evaluationCriterias: SelectedCriteria[] },
  ];
};

const emit = defineEmits<Emits>();

const user = useStrapiUser();

const dialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

const form = ref<{
  groupType: EvaluationGroupType;
  groupId: number | null;
  evaluationCriterias: SelectedCriteria[];
}>({
  groupType: props.groupType,
  groupId: props.groupId,
  evaluationCriterias: [],
});

const selectedGroupType = computed(() => form.value.groupType);

const { getUserEvaluationGroupsByType } = useTaskEvaluation(0, 0, user);

const { data: evaluationGroups } = getUserEvaluationGroupsByType(selectedGroupType);

const selectedEvaluationGroup = computed(
  () => evaluationGroups.value?.find((group) => group.id === form.value.groupId),
);

const syncCriterias = () => {
  form.value.evaluationCriterias =
    selectedEvaluationGroup.value?.evaluation_criterias?.map((criteria) => ({
      id: criteria.id,
      name: criteria.name,
      weight: props.criteriaWeights?.[criteria.id] ?? 1,
    })) || [];
};

const onChangeGroupType = () => {
  form.value.groupId = null;
  form.value.evaluationCriterias = [];
};

const onSubmit = () => {
  emit('submit', {
    groupId: form.value.groupId,
    groupType: form.value.groupType,
    evaluationCriterias: form.value.evaluationCriterias,
  });
};

watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) return;

    form.value.groupType = props.groupType || 'standard';
    form.value.groupId = props.groupId ?? null;
    syncCriterias();
  },
);

/* os grupos chegam de forma assincrona; ressincroniza quando o grupo escolhido resolve */
watch(selectedEvaluationGroup, syncCriterias);
</script>
