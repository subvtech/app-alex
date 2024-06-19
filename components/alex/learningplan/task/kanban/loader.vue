<template>
  <div class="d-flex w-full flex-col gap-4 ga-4 mt-6 pa-6 bg-white rounded-lg">
    <div class="d-flex w-full gap-4 ga-4">
      <alex-custom-skeleton
        class="w-[320px] mr-auto h-[40px]"
        color="gray-100"
      />
      <alex-custom-skeleton class="w-[40px] h-[40px]" color="gray-100" />
    </div>
    <div class="d-flex w-full h-[70px] gap-4 ga-4">
      <alex-custom-skeleton class="w-full" color="gray-100" />
      <alex-custom-skeleton class="w-full" color="gray-100" />
      <alex-custom-skeleton class="w-full" color="gray-100" />
      <alex-custom-skeleton class="w-full" color="gray-100" />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
