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

const criteria = ref<Criteria>({ ...defaultCriteria });
const isLoading = ref(false);
const showDialog = ref(false);

const { handleSubmit } = useForm({
  // validationSchema: evaluationsCriteriaRules,
});

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

  if (criteria.value.id) {
    console.log('Update');
  } else {
    console.log('Create');
  }

  isLoading.value = false;
  showDialog.value = false;
});

defineExpose({ openDialog });
</script>

<style lang="scss" scoped></style>
