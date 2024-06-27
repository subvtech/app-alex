<template>
  <div
    class="d-flex tw-w-full tw-h-[200px] tw-gap-4 ga-4 tw-mt-6 pa-6 tw-bg-white tw-rounded-lg"
  >
    <div class="d-flex tw-flex-col tw-w-full tw-gap-4">
      <alex-custom-skeleton class="tw-w-24 tw-h-8" color="gray-100" />
      <alex-custom-skeleton class="w-[60%] tw-h-6" color="gray-100" />
      <div class="tw-flex tw-flex-col tw-gap-2">
        <alex-custom-skeleton class="tw-w-full tw-h-4" color="gray-100" />
        <alex-custom-skeleton class="tw-w-full tw-h-4" color="gray-100" />
        <alex-custom-skeleton class="tw-w-full tw-h-4" color="gray-100" />
      </div>
    </div>
    <alex-custom-skeleton class="tw-w-full tw-h-full" color="gray-100" />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
