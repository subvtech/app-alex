<template>
  <v-btn
    rounded="lg"
    data-testid="alexButton"
    class="alex-button"
    :class="`${disabled ? 'disabled' : variant} text-${
      selectedVariant.textColor
    }`"
    :color="selectedVariant.bgColor"
    :style="color && { color: `rgb(var(--v-theme-${color})) !important` }"
    :variant="variant === 'text' ? 'text' : 'flat'"
    :size="size"
    :ripple="false"
    v-bind="$attrs"
  >
    <template v-if="hasDefault" #default>
      <slot />
    </template>
  </v-btn>
</template>

<script setup lang="ts">
export interface ButtonProps {
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
  disabled?: boolean;
  theme?: 'light' | 'dark';
  color?: AlexColors;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'default',
  icon: undefined,
  disabled: false,
  theme: 'light',
  color: undefined,
});

const variants = {
  primary: { textColor: 'white', bgColor: 'secondary-0' },
  secondary: {
    textColor: 'gray-800',
    bgColor: 'gray-blue',
  },
  tertiary: {
    textColor: 'gray-800',
    bgColor: 'gray-100',
  },
  text: { textColor: 'gray-800', bgColor: '' },
  error: { textColor: 'white', bgColor: 'error-0' },
  success: { textColor: 'white', bgColor: 'success-0' },
  warning: { textColor: 'white', bgColor: 'warning-0' },
  info: { textColor: 'white', bgColor: 'info-0' },
  disabled: { textColor: 'gray-300', bgColor: 'gray-100' },
  disabledDark: { textColor: 'gray-600', bgColor: 'gray-800' },
};

const disabledVariant = computed(() =>
  props.theme === 'dark' ? variants.disabledDark : variants.disabled,
);
const selectedVariant = computed(() =>
  props.disabled ? disabledVariant.value : variants[props.variant],
);
// Slots
const slots = useSlots();
const hasDefault = computed(() => !!slots.default);
</script>

<style lang="scss">
@use 'sass:map';
$variants: (error, success, info, warning);
$otherVariants:
  'primary' 'secondary-1' 'secondary-2',
  'secondary' 'gray-100' 'gray-200',
  'tertiary' 'gray-200' 'gray-300',
  'text' 'gray-blue' 'gray-100';

.alex-button {
  &.v-btn {
    padding: 0 12px !important;
    text-transform: none !important;
  }
  &.v-btn--size-large {
    padding: 0 16px !important;
  }
  &.disabled {
    pointer-events: none;
    opacity: 1;
  }
  @each $name in $variants {
    &.#{$name}:hover {
      background-color: rgb(var(--v-theme-#{$name}-1)) !important;
    }
    &.#{$name}:active {
      background-color: rgb(var(--v-theme-#{$name}-2)) !important;
    }
  }

  @each $name, $hover, $active in $otherVariants {
    &.#{$name}:hover {
      background-color: rgb(var(--v-theme-#{$hover})) !important;
    }
    &.#{$name}:active {
      background-color: rgb(var(--v-theme-#{$active})) !important;
    }
  }
}
</style>
