<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue';
import { PaginationLast, type PaginationLastProps } from 'radix-vue';
import { ChevronsRight } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const props = withDefaults(
  defineProps<PaginationLastProps & { class?: HTMLAttributes['class'] }>(),
  {
    asChild: true,
  },
);

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <PaginationLast v-bind="delegatedProps">
    <Button
      :class="cn('tw-w-10 tw-h-10 tw-p-0', props.class)"
      variant="outline"
    >
      <slot>
        <ChevronsRight class="tw-h-4 tw-w-4" />
      </slot>
    </Button>
  </PaginationLast>
</template>
