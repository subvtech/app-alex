<template>
  <div class="bg-white rounded wrapper">
    <div
      v-if="learningPlanStore.loading"
      class="w-100 d-flex justify-space-between align-center height-18 header px-6"
    >
      <alex-custom-skeleton
        color="gray-300"
        class="w-100 max-w-80 mr-6 min-w-60 height-11"
      />
      <alex-custom-skeleton color="gray-300" class="w-100 max-w-11 height-11" />
    </div>
    <div
      v-else
      class="w-100 d-flex justify-space-between align-center height-18 header px-6"
    >
      <alex-inputs-text-field
        v-model="search"
        :placeholder="t('pages.task.searchPlaceholder')"
        prepend-inner-icon="mdi-magnify"
        class="w-100 max-w-80 mr-6 min-w-60"
        density="comfortable"
        name="search"
        hide-details
        clearable
      />
      <alex-custom-button
        size="large"
        icon="mdi-filter-variant"
        variant="secondary"
        @click="console.log('filter')"
      />
    </div>

    <div class="w-100 px-6 py-4 ga-6 d-flex flex-column">
      <Transition name="fade" mode="out-in">
        <div v-if="learningPlanStore.loading">
          <alex-learningplan-tasks-table-skeleton />
        </div>
        <div v-else>
          <alex-learningplan-tasks-container :search="search" />
        </div>
      </Transition>
    </div>
  </div>
</template>
<script setup lang="ts">
const route = useRoute();
const { t } = useI18n();
const learningPlanStore = useLearningPlanStore();
const headerStore = usePageHeaderStore();
const { id } = route.params;

const search = ref('');

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

<style scoped>
.header {
  border-bottom: 1px solid var(--Cinza-Cinza-100, #ebedef);
}

.wrapper {
  min-height: calc(100vh - 548px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
