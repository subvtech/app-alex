<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <caption
    :class="cn('tw-mt-4 tw-text-sm tw-text-muted-foreground', props.class)"
  >
    <slot />
  </caption>
</template>
