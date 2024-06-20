<template>
  <div
    class="card w-[150px] h-[100px] rounded-lg overflow-hidden cursor-pointer bg-cover d-flex align-end"
    :style="`background-image: url('${cover}')`"
  >
    <div class="text-shadow height-15 w-100">
      <p class="ellipsis lines-2 text-body-6 text-white mx-2 my-4">
        {{ title }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface CardProps {
  title: string;
  cover?: string;
}

withDefaults(defineProps<CardProps>(), {
  cover: '/images/cover_image_course.svg',
});
</script>

<style scoped>
.card {
  position: relative;
  background-position: center;
  transition:
    box-shadow 0.5s,
    transform 0.3s;
}

.text-shadow {
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 10.81%,
    rgba(0, 0, 0, 0.37) 48.72%,
    rgba(0, 0, 0, 0.7) 100%
  );
}

.card:hover {
  transform: scale(1.05);
}
</style>
