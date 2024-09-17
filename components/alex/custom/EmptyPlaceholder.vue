<template>
  <div class="d-flex flex-column align-center justify-center align-center gap-6">
    <img class="img-size" :class="[hideImage ? 'd-none' : '', grayscale ? 'tw-grayscale' : '']" :src="emptyTextImage" />

    <span class="info max-width align-self-center text-center text-color" style="text-wrap: pretty">
      {{ emptyTextMessage }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps({
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
  grayscale: {
    type: Boolean,
    default: false,
  },
});
</script>
<style scoped lang="scss">
.max-width {
  max-width: 300px;
}
.info {
  color: var(--Cinza-Cinza-600, #6e7a87);
  text-align: center;

  /* Body/P1 */
  font-family: Sen;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 135%; /* 21.6px */
  letter-spacing: 0.32px;
}
</style>
