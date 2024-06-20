<template>
  <div
    class="flex gap-2 ml-[40px] sm:ml-[60px] md:ml-[80px] relative group h-[75px] bg-white rounded-lg p-4 border-1 border-gray-100"
  >
    <alex-custom-skeleton
      color="gray-200"
      class="w-[32px] h-[32px] rounded-pill"
    />
    <div class="flex-grow flex flex-col gap-1">
      <alex-custom-skeleton
        color="gray-200"
        class="w-[50%] h-[14px] rounded-sm mb-1"
      />
      <alex-custom-skeleton
        color="gray-200"
        class="w-[30%] h-[10px] rounded-sm"
      />
      <alex-custom-skeleton
        color="gray-200"
        class="w-[60%] h-[10px] rounded-sm"
      />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
