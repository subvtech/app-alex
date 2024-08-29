<template>
  <div
    v-if="!loading"
    class="d-flex align-center tw-h-[48px] tw-ml-[26px] tw-cursor-pointer hover:tw-bg-gray-50 tw-transition rounded-lg"
  >
    <div
      class="tw-h-full tw-w-[2px]"
      :class="selected ? 'bg-secondary-0' : 'bg-gray-200'"
    ></div>
    <p
      class="text-body-4 px-4 tw-truncate"
      :class="selected ? 'text-secondary-0' : 'text-gray-600'"
    >
      {{ title }}
    </p>
  </div>
  <alex-custom-skeleton v-else class="tw-h-[48px] tw-ml-[26px] rounded-lg" />
</template>

<script setup lang="ts">
interface DocumentProps {
  id: number;
  title: string;
  selected: boolean;
  loading?: boolean;
}

defineProps<DocumentProps>();
</script>
