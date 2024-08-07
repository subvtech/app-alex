<template>
  <div class="d-flex flex-column gap-1">
    <v-tooltip :text="tooltipText">
      <template #activator="{ props: tooltipProps }">
        <alex-custom-button
          :text="text"
          :variant="variant"
          v-bind="tooltipProps"
          :disabled="disabled"
          :loading="loading"
          @click="emit('click:button')"
        />
      </template>
    </v-tooltip>
    <span v-if="hint && showHint" class="text-body-3 text-gray-500">{{
      hint
    }}</span>
  </div>
</template>
<script setup lang="ts">
interface ContractButtonProps {
  disabled?: boolean;
  loading?: boolean;
  text: string;
  hint?: string;
  showHint?: boolean;
  variant: 'warning' | 'error';
  tooltipText: string;
}

const emit = defineEmits(['click:button']);

withDefaults(defineProps<ContractButtonProps>(), { hint: undefined });
</script>
