<template>
  <div v-if="learningPlanStore.loading" class="bg-white rounded wrapper">
    <Transition name="fade" mode="out-in">
      <div
        v-if="learningPlanStore.loading"
        class="w-100 d-flex justify-space-between align-center height-18 header px-6"
      >
        <alex-custom-skeleton
          color="gray-300"
          class="w-100 max-w-80 mr-6 min-w-60 height-11"
        />
        <alex-custom-skeleton
          color="gray-300"
          class="w-100 max-w-11 height-11"
        />
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
        />
        <alex-custom-button
          size="large"
          icon="mdi-filter-variant"
          variant="secondary"
          @click="openFilterDrawer = true"
        />
      </div>
    </Transition>

    <div class="w-100 px-6 py-4 ga-6 d-flex flex-column">
      <Transition name="fade" mode="out-in">
        <div v-if="learningPlanStore.loading">
          <alex-learningplan-task-table-skeleton />
        </div>
        <div v-else>
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

          <alex-learningplan-task-container
            ref="tasksContainer"
            :search="search"
            :filter="filter"
          />
        </div>
      </Transition>
    </div>
    <alex-learningplan-task-drawer-filter
      ref="filterDrawer"
      :model-value="openFilterDrawer"
      @filter="handleFilter"
      @update:model-value="(value) => (openFilterDrawer = value)"
    />
  </div>
  <alex-learningplan-task-student
    v-else
    :learningplan-id="learningPlanStore.learningPlan!.id!"
    :student-id="learningPlanStore.userLearningMember!.id!"
  />
</template>
<script setup lang="ts">
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
const isProfessor = ref<boolean>(false);
const classes = ref<string[]>([]);

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
      isProfessor.value = learningPlanStore.userIsFacilitator || false;
      // Kanban
      classes.value =
        learningPlanStore.learningPlan?.classes?.map((group) => group.name) ||
        [];
      headerStore.title = t('pages.projects.myProjects');
      headerStore.items = [
        {
          title: t('components.courses.settings.home'),
          disabled: false,
          to: '/',
        },
        {
          title: t('pages.projects.myProjects'),
          disabled: false,
          to: '/projects/me',
        },
        {
          title: learningPlanStore.learningPlan?.title || '',
          disabled: false,
          to: `/projects/${id}`,
        },
        {
          title: t('components.courses.tasks.title'),
          disabled: true,
          to: `/projects/${id}/tasks`,
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
