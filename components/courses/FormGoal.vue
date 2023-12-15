<template>
  <div class="d-flex flex-column gap-4">
    <div class="d-flex flex-column gap-1">
      <span class="">{{ $t('components.courses.goals.verb.title') }}</span>

      <app-autocomplete
        v-model="keywordField.value.value"
        :placeholder="$t('components.courses.goals.verb.placeholder')"
        :filtered-items="myVerbs"
        :update-items="updateItems"
        @input="handleInput"
        :error-messages="keywordField.errorMessage.value"
        name="keyword"
        clerable
      />
      <span>{{ keywordField.errorMessage.value }}</span>
    </div>

    <alex-inputs-text-field
      v-model="descriptionField.value.value"
      :placeholder="$t('components.courses.goals.description.placeholder')"
      class="w-100"
      :label="$t('components.courses.goals.description.title')"
      clearable
      :error-messages="descriptionField.errorMessage.value"
      name="description"
    />
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'nuxt/dist/app/compat/capi';
import { useField } from 'vee-validate';
import AppAutocomplete from '../AppAutocomplete.vue';
const emit = defineEmits(['success']);
const { keywordRules, descriptionRules } = useFormRules();

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

const keywordField = useField('keyword', keywordRules, {
  initialValue: keyword.value,
});

const descriptionField = useField('description', descriptionRules.description, {
  initialValue: description.value,
});

const handleInput = (e) => {
  if (e.target.value.length > 1)
    keywordField.value.value = { text: e.target.value } as Tag;
};

onMounted(() => {
  descriptionField.validate();
  keywordField.validate();
});

const updateItems = (newValue) => {};

watch(
  [
    keywordField.value,
    keywordField.errorMessage,
    descriptionField.value,
    descriptionField.errorMessage,
  ],
  () => {
    if (
      keywordField.errorMessage.value ||
      descriptionField.errorMessage.value
    ) {
    } else {
      emit('success', {
        id: props.id,
        index: props.index,
        keyWord: keywordField.value.value,
        description: descriptionField.value.value,
      });
    }
  },
);
</script>

<style scoped lang="scss"></style>
