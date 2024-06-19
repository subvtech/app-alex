<template>
  <div
    class="card relative w-[150px] h-[100px] rounded-lg overflow-hidden cursor-pointer bg-cover"
    :style="`background-image: url('${cover}')`"
  >
    <p
      class="absolute bottom-0 px-2 mb-3 ellipsis lines-2 text-body-6 text-white"
    >
      {{ title }}
    </p>
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
  box-shadow: black 0px -50px 36px -28px inset;
  transition:
    box-shadow 0.5s,
    transform 0.3s;
}

.card:hover {
  box-shadow: black 0px -50px 36px -20px inset;
  transform: scale(1.05);
}
</style>
