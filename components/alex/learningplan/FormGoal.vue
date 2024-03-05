<template>
  <form class="d-flex flex-column gap-4">
    <alex-inputs-combobox
      v-model:search="keyWord"
      name="keyword"
      clerable
      hide-details="auto"
      :label="$t('components.courses.goals.verb.title')"
      :placeholder="$t('components.courses.goals.verb.placeholder')"
      :filtered-items="preDefinedVerbs"
    />
    <alex-inputs-text-field
      name="description"
      class="w-100"
      clearable
      :placeholder="$t('components.courses.goals.description.placeholder')"
      :label="$t('components.courses.goals.description.title')"
      :class="[
        errors.description && 'error',
        !descriptionErrorOrKeywordError && 'success',
      ]"
    />
  </form>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
const emit = defineEmits([
  'error:keyword',
  'error:description',
  'success:keyword',
  'success:description',
  'success',
  'update:description',
  'update:keyword',
]);
const { goalRules } = useFormRules();
type FormGoalProps = {
  id?: number;
  index: number;
  filteredItems: { text: string; id: number }[];
  keyword: string;
  description: string;
};
const props = withDefaults(defineProps<FormGoalProps>(), { id: undefined });
const { filteredItems } = toRefs(props);
const preDefinedVerbs = ref(
  filteredItems.value.filter((item) => item.text !== props.keyword),
);
const { values, validateField, errors, setFieldValue, useFieldModel } = useForm(
  {
    validateOnMount: true,
    initialValues: {
      keyword: props.keyword,
      description: props.description,
    },
    validationSchema: goalRules,
  },
);

const keyWord = useFieldModel('keyword');
const descriptionRef = useFieldModel('description');
const handleKeyWord = (value: string) => {
  validateField('keyword');
  setFieldValue('keyword', value);
  emit('update:keyword', {
    value,
    index: props.index,
  });
};
const handleDescription = (value: string) => {
  validateField('description');
  setFieldValue('description', value);
  emit('update:description', {
    value,
    index: props.index,
  });
};
watch(keyWord, (value) => {
  handleKeyWord(value);
});
watch(descriptionRef, (value) => {
  handleDescription(value);
});

const descriptionErrorOrKeywordError = computed(
  () => errors.value.keyword || errors.value.description,
);

watch([errors], () => {
  if (!errors.value.keyword && !errors.value.description) {
    emit('success', {
      id: props.id,
      index: props.index,
      keyWord: values.keyword,
      description: values.description,
    });
  }

  if (errors.value.keyword) {
    emit('error:keyword', props.index);
  } else {
    emit('success:keyword', props.index);
  }

  if (errors.value.description) {
    emit('error:description', props.index);
  } else {
    emit('success:description', props.index);
  }
});
</script>

<style scoped lang="scss">
.error {
  border-color: red;
  color: red;
}
</style>
