<template>
  <div
    class="tw-flex tw-gap-2 tw-ml-[40px] tw-sm:ml-[60px] tw-md:ml-[80px] tw-relative group tw-h-[75px] bg-white tw-rounded-lg tw-p-4 border-1 border-gray-100"
  >
    <alex-custom-skeleton
      color="gray-200"
      class="tw-w-[32px] tw-h-[32px] rounded-pill"
    />
    <div class="tw-flex-grow tw-flex tw-flex-col tw-gap-1">
      <alex-custom-skeleton
        color="gray-200"
        class="tw-w-[50%] tw-h-[14px] tw-rounded-sm tw-mb-1"
      />
      <alex-custom-skeleton
        color="gray-200"
        class="tw-w-[30%] tw-h-[10px] tw-rounded-sm"
      />
      <alex-custom-skeleton
        color="gray-200"
        class="tw-w-[60%] tw-h-[10px] tw-rounded-sm"
      />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
