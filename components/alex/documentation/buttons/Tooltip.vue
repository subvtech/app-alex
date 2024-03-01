<template>
  <v-tooltip :text="tooltipText" :location="tooltipLocation">
    <template #activator="{ props }">
      <alex-custom-button
        :class="rounded ? 'rounded' : ''"
        :variant="variant"
        :icon="icon"
        :color="color"
        :size="iconSize"
        v-bind="tooltipText ? props : undefined"
        :disabled="disabled"
        @click="emit('click:button')"
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
  color?: AlexColors;
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
  color: undefined,
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
