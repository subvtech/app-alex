<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <td
    :class="
      cn('tw-p-4 tw-align-middle [&:has([role=checkbox])]:tw-pr-0', props.class)
    "
  >
    <slot />
  </td>
</template>
