<script lang="ts" setup>
import { type HTMLAttributes, computed } from 'vue';
import type { StepperTriggerProps } from 'radix-vue';
import { StepperTrigger, useForwardProps } from 'radix-vue';

import { cn } from '@/lib/utils';

const props = defineProps<
  StepperTriggerProps & { class?: HTMLAttributes['class'] }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <StepperTrigger
    v-bind="forwarded"
    :class="
      cn(
        'tw-p-2 tw-flex tw-flex-col tw-items-center tw-text-center tw-gap-2 tw-rounded-md',
        props.class,
      )
    "
  >
    <slot />
  </StepperTrigger>
</template>
