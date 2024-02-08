<template>
  <v-container fluid class="bg-white rounded">
    <div v-if="trailStore.loading" class="pa-12">
      <alex-custom-skeleton color="gray-300" class="w-100 height-96" />
    </div>
    <div
      v-else
      class="d-flex height-100 pa-6 align-center justify-center rounded text-gray-600"
    >
      <span class="text-h4 text-gray-800">{{
        $t('components.trails.tasks.empty')
      }}</span>
    </div></v-container
  >
</template>
<script setup lang="ts">
const headerStore = usePageHeaderStore();
const { t } = useI18n();
const { id, trailId } = useRoute().params;
const learningPlanStore = useLearningPlanStore();
const trailStore = useTrailStore();
onBeforeMount(() => {
  headerStore.showHeader = true;
  headerStore.title = t('components.trails.header.breadcrumbs.title');
  headerStore.items = [
    {
      title: learningPlanStore.learningPlan.title,
      disabled: false,
      to: `/courses/${id}`,
    },
    {
      title: t('pages.courses.trails'),
      disabled: false,
      to: `/courses/${id}/trails`,
    },
    {
      title: trailStore.trail.title,
      disabled: false,
      to: `/courses/${id}/trails/${trailId}/`,
    },
    {
      title: t('components.trails.header.secondTab'),
      disabled: true,
      to: `/courses/${id}/trails/${trailId}/tasks`,
    },
  ];
});
</script>
<style scoped lang="scss"></style>
