<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue';
import {
  MenubarItem,
  type MenubarItemEmits,
  type MenubarItemProps,
  useForwardPropsEmits,
} from 'radix-vue';
import { cn } from '@/lib/utils';

const props = defineProps<
  MenubarItemProps & { class?: HTMLAttributes['class']; inset?: boolean }
>();

const emits = defineEmits<MenubarItemEmits>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <MenubarItem
    v-bind="forwarded"
    :class="
      cn(
        'tw-relative tw-flex tw-cursor-default tw-select-none tw-items-center tw-rounded-sm tw-px-2 tw-py-1.5 tw-text-sm tw-outline-none focus:tw-bg-accent focus:text-accent-foreground data-[disabled]:tw-pointer-events-none data-[disabled]:tw-opacity-50 data-[highlighted=true]:tw-bg-accent data-[highlighted=true]:tw-text-accent-foreground',
        inset && 'pl-8',
        props.class,
      )
    "
  >
    <slot />
  </MenubarItem>
</template>
