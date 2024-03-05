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
]);
const { goalRules } = useFormRules();
type FormGoalProps = {
  index: number;
  data: Goal[];
  filteredItems: { text: string; id: number }[];
};
const props = withDefaults(defineProps<FormGoalProps>(), { id: undefined });
const { filteredItems } = toRefs(props);
const preDefinedVerbs = ref(
  filteredItems.value.filter((item) => item.text !== props.keyword),
);
const currentData = computed(() => props.data[props.index]);
const { validateField, errors, setFieldValue, useFieldModel } = useForm({
  validateOnMount: true,
  initialValues: {
    keyword: currentData.value.contentData.keyWord,
    description: currentData.value.contentData.description,
  },
  validationSchema: goalRules,
});

const keyWord = useFieldModel('keyword');
const descriptionRef = useFieldModel('description');
const handleKeyWord = (value: string) => {
  validateField('keyword');
  setFieldValue('keyword', value);
  currentData.value.keyWord = value;
};
const handleDescription = (value: string) => {
  validateField('description');
  setFieldValue('description', value);
  currentData.value.description = value;
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
watch(errors, () => {
  if (!errors.value.keyword && !errors.value.description) {
    emit('success', {
      id: currentData.value.id,
      index: props.index,
      keyWord: currentData.value.keyWord,
      description: currentData.value.title,
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
