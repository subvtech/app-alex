<template>
  <v-btn
    flat
    rounded="lg"
    data-testid="alexButton"
    :class="`${variant} ${selectedVariant.textColor}`"
    :color="selectedVariant.bgColor"
    :variant="selectedVariant.variant as unknown as undefined"
    :size="size"
    :ripple="false"
  >
    <template v-if="hasDefault" #default>
      <slot />
    </template>
  </v-btn>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?:
      | 'primary'
      | 'secondary'
      | 'tertiary'
      | 'text'
      | 'error'
      | 'success'
      | 'warning'
      | 'info';
    size?: 'small' | 'default' | 'large';
  }>(),
  { variant: 'primary', size: 'default', icon: undefined },
);

const variants = {
  primary: { textColor: 'text-white', bgColor: 'secondary-0', variant: 'flat' },
  secondary: {
    textColor: 'text-gray-600',
    bgColor: 'gray-blue',
    variant: 'flat',
  },
  tertiary: {
    textColor: 'text-gray-600',
    bgColor: 'gray-100',
    variant: 'flat',
  },
  text: { textColor: 'text-gray-600', bgColor: '', variant: 'text' },
  error: { textColor: 'text-white', bgColor: 'error-0', variant: 'flat' },
  success: { textColor: 'text-white', bgColor: 'success-0', variant: 'flat' },
  warning: { textColor: 'text-white', bgColor: 'warning-0', variant: 'flat' },
  info: { textColor: 'text-white', bgColor: 'info-0', variant: 'flat' },
};

const selectedVariant = computed(() => variants[props.variant]);

// Slots
const slots = useSlots();
const hasDefault = computed(() => !!slots.default);
</script>

<style scoped lang="scss">
@use 'sass:map';
$variants: (error, success, info, warning);
@each $name in $variants {
  .#{$name}:hover {
    background-color: rgb(var(--v-theme-#{$name}-1)) !important;
  }
  .#{$name}:active {
    background-color: rgb(var(--v-theme-#{$name}-2)) !important;
  }
}

$otherVariants:
  'primary' 'secondary-1' 'secondary-2',
  'secondary' 'gray-100' 'gray-200',
  'tertiary' 'gray-200' 'gray-300',
  'text' 'gray-blue' 'gray-100';

@each $name, $hover, $active in $otherVariants {
  .#{$name}:hover {
    background-color: rgb(var(--v-theme-#{$hover})) !important;
  }
  .#{$name}:active {
    background-color: rgb(var(--v-theme-#{$active})) !important;
  }
}

.primary:hover {
  background-color: rgb(var(--v-theme-secondary-1)) !important;
}
.primary:active {
  background-color: rgb(var(--v-theme-secondary-2)) !important;
}
</style>
