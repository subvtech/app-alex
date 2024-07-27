<template>
  <div>
    <p class="text-body-4 text-gray-800 mb-2">
      {{ title || $t('components.learningPlan.drawer.task.description.label') }}
    </p>

    <TipTap
      v-model="model"
      class="rounded-lg pa-0"
      :class="edit && 'border tw-min-h-[102px]'"
      :task-id="taskId"
      :edit="edit"
    />
  </div>
</template>

<script setup lang="ts">
interface DescriptionProps {
  // Tipar certinho
  taskId?: number;
  edit?: boolean;
  title?: string;
}

defineProps<DescriptionProps>();

const model = defineModel<string>();
</script>
