<script lang="ts" setup>
import { Toaster as Sonner, type ToasterProps } from 'vue-sonner';

const props = defineProps<ToasterProps>();
</script>

<template>
  <Sonner
    class="toaster group [&_[data-content]]:tw-text-sm"
    v-bind="props"
    :toast-options="{
      classes: {
        toast:
          'group toast group-[.toaster]:tw-bg-background group-[.toaster]:tw-text-foreground group-[.toaster]:tw-border-border group-[.toaster]:tw-shadow-lg',
        description: 'group-[.toast]:tw-text-muted-foreground',
        actionButton: 'group-[.toast]:tw-bg-primary group-[.toast]:tw-text-primary-foreground',
        cancelButton: 'group-[.toast]:tw-bg-muted group-[.toast]:tw-text-muted-foreground',
      },
    }"
  />
</template>
