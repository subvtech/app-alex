<template>
  <p class="text-body-4 text-gray-800 mb-2">
    {{ $t('components.learningPlan.drawer.task.description.label') }}
  </p>

  <alex-inputs-text-area
    v-model="model"
    name="student"
    :placeholder="
      $t('components.learningPlan.drawer.task.description.placeHolder')
    "
    :readonly="!edit"
    variant="outlined"
    density="comfortable"
    hide-details
  />
</template>

<script setup lang="ts">
interface DescriptionProps {
  edit?: boolean;
}
defineProps<DescriptionProps>();

const model = defineModel<string>();
</script>
