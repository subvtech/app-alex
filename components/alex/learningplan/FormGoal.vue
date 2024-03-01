<template>
  <div class="d-flex flex-column gap-4">
    <div class="d-flex flex-column gap-1">
      <span class="">{{ $t('components.courses.goals.verb.title') }}</span>

      <app-autocomplete
        v-model="keywordField.value.value"
        :class="[
          keywordField.errorMessage.value ? 'error' : '',
          descriptionErrorOrKeywordError ? '' : 'success',
        ]"
        :placeholder="$t('components.courses.goals.verb.placeholder')"
        :filtered-items="myVerbs"
        :update-items="updateVerbs"
        :error-messages="keywordField.errorMessage.value"
        name="keyword"
        clerable
        @input="handleInput"
        @update:model-value="updateVerbs"
      />
      <span class="error">{{ keywordField.errorMessage.value }}</span>
    </div>

    <alex-inputs-text-field
      v-model="descriptionField.value.value"
      :placeholder="$t('components.courses.goals.description.placeholder')"
      class="w-100"
      :class="[
        descriptionField.errorMessage.value ? 'error' : '',
        descriptionErrorOrKeywordError ? '' : 'success',
      ]"
      :label="$t('components.courses.goals.description.title')"
      clearable
      :error-messages="descriptionField.errorMessage.value"
      name="description"
      @input="
        emit('update:description', {
          value: descriptionField.value.value,
          index: index,
        })
      "
    />
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'nuxt/dist/app/compat/capi';
import { useField } from 'vee-validate';
const emit = defineEmits([
  'error:keyword',
  'error:description',
  'success:keyword',
  'success:description',
  'success',
  'update:description',
  'update:keyword',
]);
const { keywordSchema, longDescriptionRules } = useFormRules();

const props = defineProps({
  filteredItems: {
    type: Array as PropType<{ text: string; id: number }[]>,
    default: [],
  },
  keyword: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});
const { description, keyword, filteredItems } = toRefs(props);
const myVerbs = ref(
  filteredItems.value.filter((item) => item.text !== props.keyword),
);

const updateVerbs = (verb, isCreating = false) => {
  keywordField.value.value = { text: verb.text } as Tag;

  emit('update:keyword', {
    value: { text: verb.text },
    index: props.index,
  });
};

const keywordField = useField('keyword', keywordSchema, {
  initialValue: keyword.value,
});

const descriptionField = useField(
  'description',
  longDescriptionRules.description,
  {
    initialValue: description.value,
  },
);

const handleInput = (e) => {
  keywordField.value.value = { text: e.target.value } as Tag;

  emit('update:keyword', {
    value: { text: e.target.value },
    index: props.index,
  });

  keywordField.validate();
};

onMounted(() => {
  descriptionField.validate();
  keywordField.validate();
});

const descriptionErrorOrKeywordError = computed(
  () => keywordField.errorMessage.value || descriptionField.errorMessage.value,
);

watch(descriptionField.errorMessage, () => {
  if (descriptionField.errorMessage.value)
    emit('error:description', props.index);
  else emit('success:description', props.index);
});

watch(keywordField.errorMessage, () => {
  if (keywordField.errorMessage.value) emit('error:keyword', props.index);
  else emit('success:keyword', props.index);
});

watch(
  [
    keywordField.value,
    keywordField.errorMessage,
    descriptionField.value,
    descriptionField.errorMessage,
  ],
  () => {
    if (!descriptionErrorOrKeywordError.value)
      emit('success', {
        id: props.id,
        index: props.index,
        keyWord: keywordField.value.value,
        description: descriptionField.value.value,
      });
  },
);
</script>

<style scoped lang="scss">
.error {
  border-color: red;
  color: red;
}
</style>
