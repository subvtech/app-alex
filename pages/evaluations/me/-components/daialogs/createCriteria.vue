<template>
  <alex-custom-dialog
    v-model="showDialog"
    :title="
      criteria.id
        ? `${$t('pages.evaluations.update')} ${$t('pages.evaluations.criteria')}`
        : `${$t('pages.evaluations.create')} ${$t('pages.evaluations.criteria')}`
    "
    :main-button-text="criteria.id ? $t('pages.evaluations.update') : $t('pages.evaluations.create')"
    :loading="isLoading"
    @on-main-action="onSubmit"
    @on-secondary-action="showDialog = false"
  >
    <alex-inputs-text-field
      v-model="criteria.name"
      name="name"
      :label="$t('pages.evaluations.criteria_name')"
      density="comfortable"
      required
    />

    <alex-inputs-text-area
      v-model="criteria.description"
      name="description"
      :label="$t('pages.evaluations.criteria_description')"
      density="comfortable"
      required
    />
  </alex-custom-dialog>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';

interface Criteria {
  id?: number;
  name: string;
  description: string;
  public: boolean;
  user?: User;
}

// const { evaluationsCriteriaRules } = useFormRules()

const defaultCriteria = {
  name: '',
  description: '',
  public: false,
};

const i18Dir = 'pages.evaluations.criteriaSec';

const criteria = ref<Criteria>({ ...defaultCriteria });
const isLoading = ref(false);
const showDialog = ref(false);

const user = useStrapiUser();
const { createUserEvaluationMutation, updateUserEvaluationMutation } = useTaskEvaluation(0, 0, user);
const { handleSubmit } = useForm({
  // validationSchema: evaluationsCriteriaRules,
});
const { setMessage } = useMessageStore();
const { t } = useI18n();

const { mutateAsync: createUserEvaluation } = createUserEvaluationMutation();
const { mutateAsync: updateUserEvaluation } = updateUserEvaluationMutation();

const openDialog = (newCriteria: Criteria) => {
  if (newCriteria) {
    criteria.value = { ...newCriteria };
  } else {
    criteria.value = { ...defaultCriteria };
  }

  showDialog.value = true;
};

const onSubmit = handleSubmit(async () => {
  isLoading.value = true;

  try {
    // Checa se tem algum input faltando
    if (!criteria.value.name) {
      setMessage(t(`${i18Dir}.missingName`), 'warning', true);
      // eslint-disable-next-line no-throw-literal
      throw 'Missing input (Name)';
    } else if (!criteria.value.description) {
      setMessage(t(`${i18Dir}.missingDescription`), 'warning', true);
      // eslint-disable-next-line no-throw-literal
      throw 'Missing input (Description)';
    }

    //
    if (criteria.value.id) {
      await updateUserEvaluation({ ...criteria.value });
      setMessage(t(`${i18Dir}.updateSuccess`), 'success', true);
    } else {
      await createUserEvaluation({ ...criteria.value });
      setMessage(t(`${i18Dir}.createSuccess`), 'success', true);
    }

    showDialog.value = false;
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
});

defineExpose({ openDialog });
</script>

<style lang="scss" scoped></style>
