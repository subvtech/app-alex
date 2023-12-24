<template>
  <div class="d-flex flex-column align-center justify-center align-center gap-6">
    <img
      class="img-size"
      :class="hideImage ? 'd-none' : ''"
      :src="emptyTextImage"
    />

    <span class="info max-width align-self-center text-center text-color">
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
  hideImage: {
    type: Boolean,
    default: false,
  },
});
</script>
<style scoped lang="scss">
.max-width {
  max-width: 300px;
}
</style>