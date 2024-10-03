<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  value: {
    type: Object,
    required: true,
  },
});

const slotProps = computed(() => {
  return { ...props.value };
});
</script>

<template>
  <slot v-bind="slotProps" />
</template>
