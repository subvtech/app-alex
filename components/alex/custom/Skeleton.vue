<template>
  <div :class="['alex-skeleton', styles, color]" v-bind="$attrs" />
</template>

<script setup lang="ts">
type SkeletonProps = {
  color?: AlexColors;
  rounded?: 'sm' | 'rounded' | 'md' | 'lg' | 'pill';
};
const props = withDefaults(defineProps<SkeletonProps>(), {
  color: 'gray-100',
  rounded: 'rounded',
});

const styles = computed(() =>
  props.rounded === 'rounded' || props.rounded === 'md'
    ? 'rounded'
    : `rounded-${props.rounded}`,
);

const color = computed(() => `bg-${props.color}`);
</script>

<style scoped lang="scss">
.alex-skeleton {
  animation: 2s ease-in-out 0.5s infinite normal none running skeleton-animation;
}
@keyframes skeleton-animation {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}
</style>
