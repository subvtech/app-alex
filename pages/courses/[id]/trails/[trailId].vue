<template>
  <div>
    <alex-learningplan-trails-header
      v-if="trailStore.trail"
      :trails-description="trailStore.trail.description"
      :trails-cover="
        trailStore.trail.cover_image
          ? trailStore.trail.cover_image.url
          : '/images/cover_image_course.svg'
      "
      :trail-id="trailId"
      :course-id="id"
      :course-title="learningPlanStore.learningPlan?.title"
      :trails-title="trailStore.trail.title"
    />
    <NuxtPage @update="getTrailData()" />
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  hideLearningPlanBanner: true,
});

const route = useRoute();
const { trailId, id } = route.params;

const trailStore = useTrailStore();
const learningPlanStore = useLearningPlanStore();

const getTrailData = async () => {
  await trailStore.loadTrailData(parseInt(trailId.toString()));

  if (!trailStore.trail) {
    navigateTo(`/courses/${id}`);
  }
  if (
    !(
      trailStore.trail.learning_structure.learningplan.id ===
      parseInt(id.toString())
    )
  ) {
    navigateTo(`/courses/${id}/trails`);
  }
};

onMounted(async () => {
  await getTrailData();
});

const pageRoute = computed(() => route.name);

watch(pageRoute, async () => {
  if (pageRoute.value?.toString().includes('courses-id-trails-trailId')) {
    await getTrailData();
  }
});
</script>
