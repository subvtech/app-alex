<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue';
import { PaginationEllipsis, type PaginationEllipsisProps } from 'radix-vue';
import { MoreHorizontal } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

const props = defineProps<
  PaginationEllipsisProps & { class?: HTMLAttributes['class'] }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <PaginationEllipsis
    v-bind="delegatedProps"
    :class="
      cn('tw-w-9 tw-h-9 tw-flex tw-items-center tw-justify-center', props.class)
    "
  >
    <slot>
      <MoreHorizontal />
    </slot>
  </PaginationEllipsis>
</template>
