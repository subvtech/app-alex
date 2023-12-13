<template>
  <div class="d-flex flex-column justify-center align-center gap-6">
    <img class="img-size" :src="emptyTextImage" />

    <span class="info text-center text-color">
      {{ emptyTextMessage }}
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  emptyTextImage: {
    type: String,
    default: '/svg/EmptyAbout.svg',
  },
  emptyTextMessage: {
    type: String,
    default: '',
  },
});
</script>
