<template>
  <v-container fluid class="bg-white rounded">
    <div class="empty-state">
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
      title: t('components.trails.header.breadcrumbs.1.title'),
      disabled: false,
      href: '/courses/me',
    },
    {
      title: learningPlanStore.learningPlan.title,
      disabled: false,
      href: `/courses/${id}`,
    },
    {
      title: trailStore.trail.title,
      disabled: false,
      href: `/courses/${id}/trails/${trailId}/`,
    },
    {
      title: t('components.trails.header.secondTab'),
      disabled: true,
      href: `/courses/${id}/trails/${trailId}/tasks`,
    },
  ];
});

</script>
<style scoped lang="scss">
.empty-state {
  display: flex;
  height: 250px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid var(--cinza-cinza-100, #ebedef);
}
</style>
