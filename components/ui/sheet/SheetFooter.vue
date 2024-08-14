<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps<{ class?: HTMLAttributes['class'] }>();
</script>

<template>
  <div
    :class="
      cn(
        'tw-flex tw-flex-col-reverse tw-sm:flex-row tw-sm:justify-end tw-sm:gap-x-2',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
