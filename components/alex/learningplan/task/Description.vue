<template>
  <div>
    <p class="text-body-4 text-gray-800 mb-2">
      {{ title || $t('components.learningPlan.drawer.task.description.label') }}
    </p>

    <alex-inputs-text-area
      v-if="edit"
      v-model="model"
      name="description"
      :placeholder="
        $t('components.learningPlan.drawer.task.description.placeHolder')
      "
      variant="outlined"
      density="comfortable"
      hide-details
    />
    <p
      v-else
      class="text-body-3"
      :class="model ? 'text-gray-800' : 'text-gray-400'"
    >
      {{ model || $t('components.learningPlan.drawer.missing.description') }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface DescriptionProps {
  // Tipar certinho
  edit?: boolean;
  title?: string;
}

defineProps<DescriptionProps>();

const model = defineModel<string>();
</script>
