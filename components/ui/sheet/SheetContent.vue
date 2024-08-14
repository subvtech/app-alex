<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue';
import {
  DialogContent,
  type DialogContentEmits,
  type DialogContentProps,
  DialogPortal,
  useForwardPropsEmits,
} from 'radix-vue';
import { type SheetVariants, sheetVariants } from '.';
import { cn } from '@/lib/utils';

interface SheetContentProps extends DialogContentProps {
  class?: HTMLAttributes['class'];
  side?: SheetVariants['side'];
}

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<SheetContentProps>();

const emits = defineEmits<DialogContentEmits>();

const delegatedProps = computed(() => {
  const { class: _, side, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <DialogPortal to=".v-overlay-container">
    <DialogContent
      :class="cn(sheetVariants({ side }), props.class)"
      v-bind="{ ...forwarded, ...$attrs }"
      disable-outside-pointer-events
      @pointer-down-outside="
        (event) => {
          const originalEvent = event.detail.originalEvent;
          const target = originalEvent.target as HTMLElement;
          if (!target.getAttribute('lang')) {
            event.preventDefault();
          }
        }
      "
    >
      <div class="tw-flex tw-flex-col tw-h-[calc(100%-64px)]">
        <slot name="header" />
        <slot />
        <slot name="footer" />
      </div>
    </DialogContent>
  </DialogPortal>
</template>
