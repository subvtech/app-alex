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
const { t } = useI18n();
const route = useRoute();
const headerStore = usePageHeaderStore();

const trailStore = useTrailStore();
const learningPlanStore = useLearningPlanStore();

const getTrailData = async () => {
  await trailStore.loadTrailData(trailId.value);
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
  if (route.name?.toString().includes('tasks')) {
    return 1;
  } else if (route.name?.toString().includes('settings')) {
    return 2;
  }
  return 0;
});
onBeforeMount(async () => {
  await getTrailData();
  headerStore.showHeader = true;
  headerStore.title = t('components.trails.header.breadcrumbs.title');
  headerStore.items = [
    {
      title: t('components.trails.header.breadcrumbs.0.title'),
      disabled: false,
      href: '/',
    },
    {
      title: t('components.trails.header.breadcrumbs.1.title'),
      disabled: false,
      href: '/courses/me',
    },
    {
      title: learningPlanStore.learningPlan?.title,
      disabled: false,
      href: `/courses/${learningPlanId.value}`,
    },
    {
      title: trailStore.trail?.title,
      disabled: false,
      href: `/courses/${learningPlanId.value}/trails/${trailId}`,
    },
  ];
});

const pageRoute = computed(() => route.name);

watch(pageRoute, async () => {
  if (pageRoute.value?.toString().includes('courses-id-trails-trailId')) {
    await getTrailData();
  }
});
</script>
