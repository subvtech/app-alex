<template>
  <alex-custom-sidebar-bar
    class="tw-hidden tw-fixed md:tw-flex tw-h-full"
    :clipped="clipped"
    :blocks="blocks"
  />
  <DialogRoot v-if="!isPermanent" v-model:open="drawer">
    <DialogPortal>
      <DialogOverlay
        class="tw-fixed tw-inset-0 tw-z-[1006] tw-bg-black/30 data-[state=open]:tw-animate-in data-[state=closed]:tw-animate-out data-[state=closed]:tw-fade-out-0 data-[state=open]:tw-fade-in-0"
        side="left"
      />
      <DialogContent
        class="tw-fixed tw-z-[1006] tw-gap-4 tw-shadow-lg tw-transition tw-ease-in-out data-[state=open]:tw-animate-in data-[state=closed]:tw-animate-out data-[state=closed]:tw-duration-200 data-[state=open]:tw-duration-200 tw-inset-y-0 tw-left-0 tw-h-full tw-w-[256px] data-[state=closed]:tw-slide-out-to-left data-[state=open]:tw-slide-in-from-left sm:tw-max-w-sm tw-flex"
      >
        <alex-custom-sidebar-bar :clipped="false" :blocks="blocks" />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import {
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
} from 'radix-vue';
type SidebarProps = {
  blocks: {
    title: string;
    items: { icon: string; title: string; to: string }[];
  }[];
  isPermanent?: boolean;
};
const clipped = defineModel('clipped', {
  default: false,
});
const drawer = defineModel({
  default: false,
});
withDefaults(defineProps<SidebarProps>(), {
  isPermanent: false,
});
</script>

<style lang="scss" scoped></style>
