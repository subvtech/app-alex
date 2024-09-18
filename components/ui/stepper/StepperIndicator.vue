<script lang="ts" setup>
import { type HTMLAttributes, computed } from 'vue';
import type { StepperIndicatorProps } from 'radix-vue';
import { StepperIndicator, useForwardProps } from 'radix-vue';

import { cn } from '@/lib/utils';

const props = defineProps<
  StepperIndicatorProps & { class?: HTMLAttributes['class'] }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <StepperIndicator
    v-bind="forwarded"
    :class="
      cn(
        'tw-inline-flex tw-items-center tw-justify-center tw-rounded-full tw-text-muted-foreground/50 tw-w-10 tw-h-10',
        // Disabled
        'group-data-[disabled]:tw-text-muted-foreground group-data-[disabled]:tw-opacity-50',
        // Active
        'group-data-[state=active]:tw-bg-primary group-data-[state=active]:tw-text-primary-foreground',
        // Completed
        'group-data-[state=completed]:tw-bg-accent group-data-[state=completed]:tw-text-accent-foreground',
        props.class,
      )
    "
  >
    <slot />
  </StepperIndicator>
</template>
