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
const emit = defineEmits(['click:button']);
const props = defineProps({
  tooltipText: {
    type: String,
    default: '',
  },
  tooltipLocation: {
    type: String as PropType<'start' | 'bottom' | 'end' | 'top'>,
    default: 'top',
  },
  variant: {
    type: String as PropType<
      | 'primary'
      | 'secondary'
      | 'tertiary'
      | 'text'
      | 'error'
      | 'success'
      | 'warning'
      | 'info'
    >,
    default: 'success',
  },
  icon: {
    type: String,
    default: 'mdi-content-copy',
  },
  rounded: {
    type: Boolean,
    default: false,
  },

  disabled: {
    type: Boolean,
    default: false,
  },

  iconSize: {
    type: String as PropType<'default' | 'small' | 'large'>,
    default: 'large',
  },
});
</script>

<style scoped lang="scss">
.rounded {
  border-radius: 50% !important;
}
</style>
