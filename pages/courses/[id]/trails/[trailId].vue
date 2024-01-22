<template>
  <div>
    <alex-learningplan-trails-header
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
  middleware: ['load-trail'],
  hideLearningPlanBanner: true,
});

const route = useRoute();
const { trailId, id } = route.params;

const trailStore = useTrailStore();
const learningPlanStore = useLearningPlanStore();

const getTrailData = async () => {
  await trailStore.loadTrailData(parseInt(trailId.toString()));
};
</script>
