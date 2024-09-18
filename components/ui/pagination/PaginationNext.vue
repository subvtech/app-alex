<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue';
import { PaginationNext, type PaginationNextProps } from 'radix-vue';
import { ChevronRight } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const props = withDefaults(
  defineProps<PaginationNextProps & { class?: HTMLAttributes['class'] }>(),
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
  <PaginationNext v-bind="delegatedProps">
    <Button
      :class="cn('tw-w-10 tw-h-10 tw-p-0', props.class)"
      variant="outline"
    >
      <slot>
        <ChevronRight class="tw-h-4 tw-w-4" />
      </slot>
    </Button>
  </PaginationNext>
</template>
