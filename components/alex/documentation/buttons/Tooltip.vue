<template>
  <v-tooltip :text="tooltipText" :location="tooltipLocation">
    <template #activator="{ props }">
      <alex-custom-button
        :class="rounded ? 'rounded' : ''"
        :variant="variant"
        @click="emit('click:button')"
        :icon="icon"
        :size="iconSize"
        v-bind="tooltipText ? props : undefined"
        :disabled="disabled"
      />
    </template>
  </v-tooltip>
</template>
<script setup lang="ts">
export interface TooltipButtonEmits {
  (e: 'click:button'): void;
}

export interface TooltipButtonComponentType {
  tooltipLocation?: 'start' | 'bottom' | 'end' | 'top';
  tooltipText?: string;
  variant?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'text'
    | 'error'
    | 'success'
    | 'warning'
    | 'info';
  icon?: string;
  iconSize?: 'default' | 'small' | 'large';
  rounded?: boolean;
  disabled?: boolean;
}
const emit = defineEmits<TooltipButtonEmits>();

withDefaults(defineProps<TooltipButtonComponentType>(), {
  tooltipText: '',
  tooltipLocation: 'top',
  variant: 'success',
  icon: 'mdi-content-copy',
  rounded: false,
  disabled: false,
  iconSize: 'large',
});
</script>

<style scoped lang="scss">
.rounded {
  border-radius: 50% !important;
}
</style>
