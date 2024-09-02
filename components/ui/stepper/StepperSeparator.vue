<script lang="ts" setup>
import { type HTMLAttributes, computed } from 'vue';
import type { StepperSeparatorProps } from 'radix-vue';
import { StepperSeparator, useForwardProps } from 'radix-vue';

import { cn } from '@/lib/utils';

const props = defineProps<
  StepperSeparatorProps & { class?: HTMLAttributes['class'] }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <StepperSeparator
    v-bind="forwarded"
    :class="
      cn(
        'tw-bg-muted',
        // Disabled
        'group-data-[disabled]:tw-bg-muted group-data-[disabled]:tw-opacity-50',
        // Completed
        'group-data-[state=completed]:tw-bg-accent-foreground',
        props.class,
      )
    "
  />
</template>
