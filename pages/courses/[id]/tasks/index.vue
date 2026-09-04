<template>
  <div v-if="learningPlanStore.loading" class="bg-white rounded wrapper">
    <div class="w-100 d-flex justify-space-between align-center height-18 header px-6">
      <alex-custom-skeleton color="gray-300" class="w-100 max-w-80 mr-6 min-w-60 height-11" />
      <alex-custom-skeleton color="gray-300" class="w-100 max-w-11 height-11" />
    </div>

    <div class="w-100 px-6 py-4 ga-6 d-flex flex-column">
      <alex-learningplan-task-table-skeleton />
    </div>
  </div>
  <div v-else-if="isProfessor" class="bg-white rounded wrapper">
    <div class="w-100 d-flex justify-space-between align-center height-18 header px-6">
      <alex-inputs-text-field
        v-model="search"
        :placeholder="t('pages.task.searchPlaceholder')"
        prepend-inner-icon="mdi-magnify"
        class="w-100 max-w-80 mr-6 min-w-60"
        density="comfortable"
        name="search"
        hide-details
      />
      <alex-custom-button size="large" icon="mdi-filter-variant" variant="secondary" @click="openFilterDrawer = true" />
    </div>

    <div class="w-100 px-6 py-4 ga-6 d-flex flex-column">
      <TransitionGroup name="list">
        <alex-custom-chip
          v-for="chip in chips"
          :key="chip"
          :text="t(`pages.task.filterChip.${chip}`)"
          status="secondary"
          variant="outlined"
          class="mr-2 bg-gray-blue text-gray-600 text-body-5"
          append-icon="mdi-close"
          clickable
          @click="filterDrawer.removeFilter(chip)"
        />
      </TransitionGroup>

      <alex-learningplan-task-container ref="tasksContainer" :search="search" :filter="filter" />
    </div>
    <alex-learningplan-task-drawer-filter
      ref="filterDrawer"
      :model-value="openFilterDrawer"
      @filter="handleFilter"
      @update:model-value="(value) => (openFilterDrawer = value)"
    />
  </div>
  <alex-learningplan-task-student
    v-else-if="learningPlanStore.learningPlan?.id && learningPlanStore.userLearningMember?.id"
    :learningplan-id="learningPlanStore.learningPlan!.id!"
    :student-id="learningPlanStore.userLearningMember!.id!"
  />
</template>
<script setup lang="ts">
import { MemberRoles } from '@/models/simple/learningPlanMemberSimple.model';

export interface filterType {
  select?: string | null;
  archivedTasks?: boolean;
  startDate?: {
    start: string | null;
    end: string | null;
  };
  finalDate?: {
    start: string | null;
    end: string | null;
  };
}

const route = useRoute();
const { t } = useI18n();
const learningPlanStore = useLearningPlanStore();
const headerStore = usePageHeaderStore();
const { id } = route.params;
const search = ref('');
const filterDrawer = ref();
const chips = ref<string[]>([]);
const isProfessor = computed(() => {
  return [MemberRoles.FACILITATOR, MemberRoles.COLLABORATOR].includes(
    learningPlanStore.userLearningMember?.role as MemberRoles,
  );
});

onBeforeMount(() => {
  headerStore.showHeader = true;
});

const openFilterDrawer = ref(false);

const filter = ref<filterType>();

const handleFilter = (newFilter: filterType) => {
  filter.value = newFilter;
  chips.value = [];
  if (filter) {
    Object.keys(filter.value).forEach((key) => {
      chips.value.push(key);
    });
  }
};

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
  border-bottom: 1px solid rgb(var(--v-theme-gray-100));
}

.wrapper {
  min-height: calc(100vh - 548px);
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease-out;
}
.list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.list-leave-active {
  position: absolute;
}
</style>
