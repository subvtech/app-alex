<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <tfoot
    :class="
      cn(
        'tw-border-t tw-bg-muted/50 tw-font-medium [&>tr]:last:tw-border-b-0',
        props.class,
      )
    "
  >
    <slot />
  </tfoot>
</template>
