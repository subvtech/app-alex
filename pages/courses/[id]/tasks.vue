<template>
  <v-container fluid class="bg-white rounded">
    <div v-if="learningPlanStore.loading" class="pa-12">
      <alex-custom-skeleton color="gray-300" class="w-100 height-96" />
    </div>
    <div
      v-else
      class="d-flex height-100 pa-6 align-center justify-center rounded text-gray-600"
    >
      <span class="text-h4 text-gray-800">{{
        $t('components.courses.tasks.noTasks')
      }}</span>
    </div></v-container
  >
</template>
<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

const route = useRoute();
const { t } = useI18n();
const learningPlanStore = useLearningPlanStore();
const headerStore = usePageHeaderStore();
const { id } = route.params;

onBeforeMount(() => {
  headerStore.showHeader = true;
});

watch(
  () => [learningPlanStore.loading],
  () => {
    if (!learningPlanStore.loading) {
      headerStore.title = t('components.courses.settings.breadcrumbTitle');
      headerStore.items = [
        {
          title: t('components.courses.settings.home'),
          disabled: false,
          to: '/',
        },
        {
          title: t('components.courses.settings.myCourses'),
          disabled: false,
          to: '/courses/me',
        },
        {
          title: learningPlanStore.learningPlan?.title || '',
          disabled: false,
          to: `/courses/${id}`,
        },
        {
          title: t('components.courses.tasks.title'),
          disabled: true,
          to: `/courses/${id}/tasks`,
        },
      ];
    }
  },
);
</script>
