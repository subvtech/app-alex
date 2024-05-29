<template>
  <p class="text-body-4 text-gray-800 mb-2">
    {{ $t('components.learningPlan.drawer.task.description.label') }}
  </p>

  <alex-inputs-text-area
    v-model="descValue"
    name="student"
    :placeholder="
      $t('components.learningPlan.drawer.task.description.placeHolder')
    "
    :readonly="!props.edit"
    variant="outlined"
    density="comfortable"
    hide-details
  />
</template>

<script setup lang="ts">
interface CompProps {
  description?: string;
  edit?: boolean;
}

const props = defineProps<CompProps>();

const descValue = ref<string>(props.description || '');
</script>
