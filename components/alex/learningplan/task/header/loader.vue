<template>
  <div class="d-flex w-full h-[200px] gap-4 ga-4 mt-6 pa-6 bg-white rounded-lg">
    <div class="d-flex flex-col w-full gap-4">
      <alex-custom-skeleton class="w-24 h-8" color="gray-100" />
      <alex-custom-skeleton class="w-[60%] h-6" color="gray-100" />
      <div class="flex flex-col gap-2">
        <alex-custom-skeleton class="w-full h-4" color="gray-100" />
        <alex-custom-skeleton class="w-full h-4" color="gray-100" />
        <alex-custom-skeleton class="w-full h-4" color="gray-100" />
      </div>
    </div>
    <alex-custom-skeleton class="w-full h-full" color="gray-100" />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
