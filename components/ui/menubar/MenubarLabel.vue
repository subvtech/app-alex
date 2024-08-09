<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { MenubarLabel, type MenubarLabelProps } from 'radix-vue';
import { cn } from '@/lib/utils';

const props = defineProps<
  MenubarLabelProps & { class?: HTMLAttributes['class']; inset?: boolean }
>();
</script>

<template>
  <MenubarLabel
    :class="
      cn(
        'tw-px-2 tw-py-1.5 tw-text-sm tw-font-semibold',
        inset && 'pl-8',
        props.class,
      )
    "
  >
    <slot />
  </MenubarLabel>
</template>
