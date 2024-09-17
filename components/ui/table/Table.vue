<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <div class="tw-relative tw-w-full tw-overflow-auto">
    <table :class="cn('tw-w-full tw-caption-bottom tw-text-sm', props.class)">
      <slot />
    </table>
  </div>
</template>
