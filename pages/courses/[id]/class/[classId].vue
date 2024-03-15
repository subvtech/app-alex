<template>
  <NuxtPage />
</template>
<script setup lang="ts">
const route = useRoute();
const classStore = useClassStore();
const classId = computed(() => parseInt(route.params.classId.toString()));

onBeforeMount(async () => {
  classStore.classId = classId.value;
});

watch(classId, () => {
  classStore.classId = classId.value;
});
</script>
