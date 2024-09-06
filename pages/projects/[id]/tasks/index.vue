<template>
  <div class="tw-flex tw-flex-col bg-white rounded tw-flex-grow">
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
        class="w-100 d-flex justify-space-between align-center height-18 header px-6 gap-2"
      >
        <alex-inputs-text-field
          v-model="search"
          :placeholder="t('pages.task.searchPlaceholder')"
          prepend-inner-icon="mdi-magnify"
          class="tw-w-[300px]"
          density="comfortable"
          name="search"
          hide-details
        />
        <alex-inputs-select
          v-if="mode === 'kanban'"
          v-model="selectedSprint"
          :items="sprints"
          :placeholder="t('pages.task.searchPlaceholder')"
          class="tw-w-[300px] tw-mr-auto"
          density="comfortable"
          name="search"
          item-title="sprint"
          return-object
          hide-details
        />
        <div class="tw-flex tw-gap-2">
          <alex-custom-button
            size="large"
            :prepend-icon="
              mode === 'list' ? 'alex:Kanban' : 'mdi-clipboard-text-outline'
            "
            variant="secondary"
            @click="toggleMode"
            >{{
              mode === 'list' ? 'Ver Kanban' : 'Ver Backlog'
            }}</alex-custom-button
          >
          <alex-custom-button
            size="large"
            icon="mdi-filter-variant"
            variant="secondary"
            @click="openFilterDrawer = true"
          />
        </div>
      </div>
    </Transition>

    <div class="w-100 px-6 py-4 ga-6 d-flex flex-column tw-flex-grow">
      <alex-learningplan-task-table-skeleton v-if="learningPlanStore.loading" />

      <template v-else>
        <TransitionGroup
          v-if="chips.length"
          name="list"
          tag="div"
          class="tw-flex tw-gap-2"
        >
          <alex-custom-chip
            v-for="chip in chips"
            :key="chip"
            :text="t(`pages.task.filterChip.${chip}`)"
            status="secondary"
            variant="outlined"
            class="mr-2 bg-gray-blue text-gray-600 text-body-5 tw-w-fit"
            append-icon="mdi-close"
            clickable
            @click="filterDrawer.removeFilter(chip)"
          />
        </TransitionGroup>

        <alex-learningplan-task-project-kanban
          v-if="mode === 'kanban'"
          v-model="columns"
          :items="filteredItemsBySprint"
        >
          <template #card="{ item }">
            <alex-learningplan-task-project-card
              :date="item.finish_at ? new Date(item.finish_at) : undefined"
              :name="item.title"
              :tags="item.tags"
              :participants="getMembers(item?.task_members)"
            />
          </template>
        </alex-learningplan-task-project-kanban>
        <alex-learningplan-task-project-list
          v-else
          ref="taskList"
          :search="search"
          :filter="filter"
        />
      </template>
    </div>
    <alex-learningplan-task-project-filter-tasks
      ref="filterDrawer"
      v-model="openFilterDrawer"
      @filter="handleFilter"
    />
  </div>
</template>
<script setup lang="ts">
export interface filterType {
  members?: any[];
  startDate?: {
    start: string | null;
    end: string | null;
  };
  finalDate?: {
    start: string | null;
    end: string | null;
  };
}
// Composables
const route = useRoute();
const { t } = useI18n();
const learningPlanStore = useLearningPlanStore();
const headerStore = usePageHeaderStore();

// refs
const mode = ref<'list' | 'kanban'>('list');
const search = ref('');
const sprints = ref([
  {
    id: 0,
    sprint: 'sprint 1',
    columns: [
      { title: 'UX/UI', group: 'ux_ui', color: 'gray' },
      { title: 'Frontend', group: 'frontend', color: 'gray' },
    ],
  },
  {
    id: 1,
    sprint: 'Sprint 2',
    columns: [{ title: 'BackEnd', group: 'BackEnd', color: 'gray' }],
  },
]);
const columns = computed({
  get: () => {
    return selectedSprint.value.columns;
  },
  set: (value) => {
    selectedSprint.value.columns = value;
  },
});
const selectedSprint = ref(sprints.value[0]);
const items = ref<{ sprint_id: number; group: string; raw: TaskSimple }[]>([
  {
    sprint_id: 1,
    group: 'ux_ui',
    raw: {
      title: 'UX/UI',
      finish_at: '2024-08-22',
      id: 1,
      status: 'ux_ui',
      position: 0,
      task_members: [],
      allowed_editor_plugins: '',
      submission_required: false,
      learning_plan_id: 1,
      can_submit_after_deadline: false,
      can_change_from_review: false,
      submission_description: '',
      tags: [
        {
          id: 12,
          isGeneral: false,
          text: 'UX UI',
          verified: false,
          isPublic: false,
          verified_date: new Date(),
        },
      ],
    },
  },
  {
    sprint_id: 0,
    group: 'ux_ui',
    raw: {
      title: 'Design',
      finish_at: '2024-08-22',
      id: 2,
      status: 'ux_ui',
      position: 1,
      task_members: [
        {
          id: 1,
          status: 'in_progress',
          can_submit_after_deadline: false,
          started_at: new Date().toISOString(),
          finished_at: new Date().toISOString(),
          learning_plan_member: {
            user: {
              fullname: 'John Doe',
              avatar: {
                url: 'https://thispersondoesnotexist.com/',
                id: 1,
              },
            },
          },
        },
        {
          id: 2,
          status: 'in_progress',
          can_submit_after_deadline: false,
          started_at: new Date().toISOString(),
          finished_at: new Date().toISOString(),
          learning_plan_member: {
            user: {
              fullname: 'John Doe',
              avatar: {
                url: 'https://thispersondoesnotexist.com/',
                id: 1,
              },
            },
          },
        },
      ],
      allowed_editor_plugins: '',
      submission_required: false,
      learning_plan_id: 1,
      can_submit_after_deadline: false,
      can_change_from_review: false,
      submission_description: '',
      tags: [
        {
          id: 1,
          text: 'UX UI',
          verified: false,
          verified_date: new Date(),
          isGeneral: false,
          isPublic: false,
        },
      ],
    },
  },
]);
const filteredItems = computed({
  get: () => {
    return items.value.filter(
      (item) =>
        item.raw.title.toLowerCase().includes(search.value.toLowerCase()) ||
        item.raw.tags?.some((tag) =>
          tag.text.toLowerCase().includes(search.value.toLowerCase()),
        ),
    );
  },
  set: (value) => {
    items.value = value;
  },
});
const filteredItemsBySprint = computed(() => {
  return filteredItems.value.filter(
    (item) => item.sprint_id === selectedSprint.value.id,
  );
});
const { id } = route.params;
const filter = ref<filterType>();
const filterDrawer = ref();
const chips = ref<string[]>([]);
const isProfessor = ref<boolean>(false);
const classes = ref<string[]>([]);
const openFilterDrawer = ref(false);

const handleFilter = (newFilter: filterType) => {
  filter.value = newFilter;
  chips.value = [];
  if (filter) {
    Object.keys(filter.value).forEach((key) => {
      chips.value.push(key);
    });
  }
};
const toggleMode = () => {
  if (mode.value === 'kanban') {
    mode.value = 'list';
    return;
  }
  mode.value = 'kanban';
};
const getMembers = (taskMembers?: TaskMember[]) => {
  return (
    taskMembers?.map((member) => ({
      name: member.learning_plan_member?.user?.fullname || '',
      ...(member.learning_plan_member?.user?.avatar?.url && {
        image: {
          url: member.learning_plan_member?.user?.avatar?.url,
        },
      }),
    })) || []
  );
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
      headerStore.title = t('pages.projects.my_projects');
      headerStore.items = [
        {
          title: t('components.courses.settings.home'),
          disabled: false,
          to: '/',
        },
        {
          title: t('pages.projects.my_projects'),
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
