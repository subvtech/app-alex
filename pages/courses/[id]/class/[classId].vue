<template>
  <NuxtPage />
</template>
<script setup lang="ts">
const route = useRoute();
const classStore = useClassStore();
const classId = computed(() => parseInt(route.params.classId.toString()));
const learningPlanId = computed(() => parseInt(route.params.id.toString()));

async function getClass() {
  await classStore.loadClass(classId.value, learningPlanId.value);
}

onBeforeMount(async () => {
  await getClass();

  if (!classStore.currentClass) {
    return navigateTo(`/courses/${learningPlanId.value}/class`);
  }
});

watch(classId, async () => {
  await getClass();
});
</script>
