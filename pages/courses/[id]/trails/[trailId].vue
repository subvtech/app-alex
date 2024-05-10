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
      :course-id="learningPlanId"
      :course-title="learningPlanStore.learningPlan?.title"
      :trails-title="trailStore.trail.title"
      :page="activePage"
    />
    <NuxtPage @update="getTrailData()" />
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  hideLearningPlanBanner: true,
});
const learningPlanId = computed(() => parseInt(route.params?.id.toString()));
const trailId = computed(() => parseInt(route.params?.trailId.toString()));
const route = useRoute();
const headerStore = usePageHeaderStore();

const trailStore = useTrailStore();
const learningPlanStore = useLearningPlanStore();

const getTrailData = async () => {
  await trailStore.loadTrailData(trailId.value);
  headerStore.isLoading = false;
  if (!trailStore.trail) {
    navigateTo(`/courses/${learningPlanId.value}`);
  }
  if (
    !(
      trailStore.trail?.learning_structure.learningplan.id ===
      learningPlanId.value
    )
  ) {
    navigateTo(`/courses/${learningPlanId.value}/trails`);
  }
};

const activePage = computed(() => {
  const routeName = route.name?.toString() || '';
  const routes = ['---', 'tasks', 'settings'];
  const index = routes.findIndex((a) => routeName.includes(a));

  console.log({ activePage: index, routeName });

  return (index < 0 ? 0 : index).toString();
});

onBeforeMount(async () => {
  headerStore.isLoading = true;
  await getTrailData();
});
onUnmounted(() => {
  trailStore.trail = undefined;
  trailStore.loading = true;
  headerStore.isLoading = false;
});

const pageRoute = computed(() => route.name);

watch(pageRoute, async () => {
  if (pageRoute.value?.toString().includes('courses-id-trails-trailId')) {
    await getTrailData();
  }
});

watch(activePage, () => console.log({ trailId: activePage.value }));
</script>
<style lang="scss">
@media screen and (max-width: 579px) {
  .breadcrumb-block {
    padding-top: 24px !important;
    gap: 0px !important;
  }
}
</style>
