<template>
  <!-- <div class="w-100 d-flex fill-height justify-center align-center"> -->
  <alex-custom-carousel :slides="slides"></alex-custom-carousel>
  <!-- <div class="bg-green">123</div>
  </div> -->
</template>

<script setup>
import { ref } from 'vue';
const slides = ref([]);
// const slides = [
//   {
//     title: 'Slide 1',
//     type: 'youtube',
//     image: 'https://picsum.photos/2000/1125',
//     video: 'https://www.youtube.com/watch?v=mUeTwoLORcs',
//   },
//   {
//     title: 'Slide 2',
//     type: 'image',
//     image: 'https://picsum.photos/1000/525',
//   },
//   {
//     title: 'Slide 3',
//     type: 'image',
//     image: 'https://picsum.photos/2000/1123',
//   },
//   {
//     title: 'Slide 4',
//     type: 'image',
//     image: 'https://picsum.photos/1000/1324',
//   },
//   {
//     title: 'Slide 5',
//     type: 'image',
//     image: 'https://picsum.photos/200/1125',
//   },
//   {
//     title: 'Slide 6',
//     type: 'image',
//     image: 'https://picsum.photos/2300/1125',
//   },
//   {
//     title: 'Slide 7',
//     type: 'image',
//     image: 'https://picsum.photos/2000/785',
//   },
//   {
//     title: 'Slide 8',
//     type: 'image',
//     image: 'https://picsum.photos/200/121',
//   },
//   {
//     title: 'Slide 9',
//     type: 'image',
//     image: 'https://picsum.photos/200/112',
//   },
// ];
</script>
