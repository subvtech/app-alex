<template>
  <form class="d-flex flex-column gap-4">
    <alex-inputs-combobox
      name="verb"
      hide-details="auto"
      :label="$t('components.courses.goals.verb.title')"
      :placeholder="$t('components.courses.goals.verb.placeholder')"
      :items="filteredItems"
      item-title="text"
      return-object
      @update:model-value="handleKeyWord"
    />
    <alex-inputs-text-area
      name="description"
      class="w-100"
      :placeholder="$t('components.courses.goals.description.placeholder')"
      :label="$t('components.courses.goals.description.title')"
      :class="[
        errors.description && 'error',
        !descriptionErrorOrKeywordError && 'success',
      ]"
      @update:model-value="handleDescription"
    />
  </form>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import { Goal } from './Goals.vue';
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
  filteredItems?: LearningPlanGoalVerb[];
};
const props = withDefaults(defineProps<FormGoalProps>(), {
  filteredItems: () => [],
});
const { filteredItems } = toRefs(props);
const currentData = computed(() => props.data[props.index]);
const preDefinedVerbs = ref(
  filteredItems.value.filter(
    (item) => item.text !== currentData.value.contentData.verb.text,
  ),
);
const { validateField, errors, setFieldValue, useFieldModel } = useForm({
  validateOnMount: false,
  initialValues: {
    verb: currentData.value.contentData.verb.text,
    description: currentData.value.contentData.description,
  },
  validationSchema: goalRules,
});
const handleKeyWord = (
  value:
    | string
    | {
        id?: number;
        text: string;
        general: boolean;
      },
) => {
  const contentData = currentData.value.contentData;
  if (typeof value !== 'string' && value) {
    currentData.value.keyWord = value.text;
    currentData.value.contentData = {
      ...contentData,
      verb: value,
    };
    return;
  }
  currentData.value.keyWord = value;
  currentData.value.contentData = {
    ...contentData,
    verb: {
      text: value,
      general: false,
      id: contentData.verb?.id,
    },
  };
};
const handleDescription = (value: string) => {
  currentData.value.title = value;
  currentData.value.contentData = {
    ...currentData.value.contentData,
    description: value,
  };
};
const descriptionErrorOrKeywordError = computed(
  () => errors.value.verb || errors.value.description,
);
watch(errors, () => {
  if (!errors.value.verb && !errors.value.description) {
    emit('success', {
      id: currentData.value.id,
      index: props.index,
      keyWord: currentData.value.keyWord,
      description: currentData.value.title,
    });
  }

  if (errors.value.verb) {
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
