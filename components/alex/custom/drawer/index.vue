<template>
  <Sheet v-model:open="model" side="right">
    <SheetContent class="focus-visible:tw-outline-none" :class="$attrs.class">
      <template #header>
        <div class="tw-px-6 tw-pt-4">
          <slot name="header" />
        </div>
      </template>
      <div class="tw-overflow-y-scroll tw-w-full tw-h-full body-scroll">
        <slot />
      </div>
      <template #footer>
        <div class="tw-pb-4">
          <slot name="footer" />
        </div>
      </template>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
const model = defineModel({ default: false });
interface DrawerProps {
  side?: 'top' | 'bottom' | 'left' | 'right';
}
withDefaults(defineProps<DrawerProps>(), {
  side: 'right',
});
</script>

<style scoped>
.body-scroll::-webkit-scrollbar {
  width: 12px;
  border-radius: 12px;
}
.body-scroll::-webkit-scrollbar-thumb {
  width: 8px;
  border: 2px solid rgb(var(--v-theme-white));
  border-radius: 12px;
  background-color: rgb(var(--v-theme-gray-200));
}
</style>
