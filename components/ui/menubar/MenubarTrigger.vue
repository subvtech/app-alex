<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue';
import {
  MenubarTrigger,
  type MenubarTriggerProps,
  useForwardProps,
} from 'radix-vue';
import { cn } from '@/lib/utils';

const props = defineProps<
  MenubarTriggerProps & { class?: HTMLAttributes['class'] }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <MenubarTrigger
    v-bind="forwardedProps"
    :class="
      cn(
        'tw-flex tw-cursor-default tw-select-none tw-items-center tw-rounded-sm tw-px-3 tw-py-1.5 tw-text-sm tw-font-medium tw-outline-none focus:tw-bg-accent focus:tw-text-accent-foreground data-[state=open]:tw-bg-accent data-[state=open]:tw-text-accent-foreground',
        props.class,
      )
    "
  >
    <slot />
  </MenubarTrigger>
</template>
