<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue';
import {
  MenubarSeparator,
  type MenubarSeparatorProps,
  useForwardProps,
} from 'radix-vue';
import { cn } from '@/lib/utils';

const props = defineProps<
  MenubarSeparatorProps & { class?: HTMLAttributes['class'] }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <MenubarSeparator
    :class="cn('tw-mx-1 tw-my-1 tw-h-px tw-bg-muted', props.class)"
    v-bind="forwardedProps"
  />
</template>
