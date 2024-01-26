<template>
  <div :class="['alex-skeleton', styles, color]" v-bind="$attrs" />
</template>

<script setup lang="ts">
type SkeletonProps = {
  color?: AlexColors;
  rounded?: 'sm' | 'rounded' | 'lg' | 'pill';
};
const props = withDefaults(defineProps<SkeletonProps>(), {
  color: 'gray-100',
  rounded: 'rounded',
});

const styles = computed(() =>
  props.rounded !== 'rounded' ? `rounded-${props.rounded}` : 'rounded',
);

const color = computed(() => `bg-${props.color}`);
</script>

<style scoped lang="scss">
.alex-skeleton {
  animation: 2s ease-in-out 0.5s infinite normal none running skeleton-animation;
}
.skeleton-circle {
  aspect-ratio: 1;
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
