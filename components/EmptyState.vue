<script setup lang="ts">
import emptyImage from '@/assets/svg/empty-journey.svg';

defineProps<{
  emptyMessage?: string;
}>();
</script>

<template>
  <div
    class="tw-flex tw-flex-col tw-m-auto tw-items-center tw-justify-center tw-gap-6"
  >
    <img
      class="tw-max-h-[360px] tw-max-w-[400px] tw-w-[240px]"
      :src="emptyImage"
      :alt="emptyMessage"
    />
    <p class="tw-text-xl tw-opacity-45 tw-mt-4">
      {{ emptyMessage || $t('errors.default') }}
    </p>
  </div>
</template>
