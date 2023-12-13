<template>
  <div>
    <alex-inputs-text-field
      v-model="keywordField.value.value"
      :placeholder="$t('components.courses.goals.verb.placeholder')"
      class="w-100"
      :label="$t('components.courses.goals.verb.title')"
      clearable
      :error-messages="keywordField.errorMessage.value"
      name="keyword"
    />
   
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
import { useField } from 'vee-validate';
const emit = defineEmits(['success']);
const { keywordRules, descriptionRules } = useFormRules();

const props = defineProps({
  keyword: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const { description, keyword } = toRefs(props);

const keywordField = useField('keyword', keywordRules.keyword, {
  initialValue: keyword.value,
});

const descriptionField = useField('description', descriptionRules.description, {
  initialValue: description.value,
});


watchEffect(() => {
  if (keywordField.errorMessage.value || descriptionField.errorMessage.value) {
  } else {
    emit('success');
  }
});
</script>

<style scoped lang="scss"></style>
