<script setup lang="ts">
import { TaskSimple } from '@/models/simple/taskSimple.model';
import { contains } from '@/utils/contains';
import { get } from '@/utils/get';
import Kanban, { Column } from './-components/Kanban.vue';
import TaskCard from './-components/TaskCard.vue';
import TaskFilterDrawer from './-components/TaskFilterDrawer.vue';
import TaskList from './-components/TaskList.vue';
import { Droppable } from './-types';

type FilterType = {
  finalDate?: { start: string | null; end: string | null };
  startDate?: { start: string | null; end: string | null };
  members?: any[];
};

type KanbanItem = Droppable<TaskSimple> & { sprint_id: number };

type SprintItem = {
  id: number;
  columns: Column[];
  sprint: string;
};

enum Mode {
  List = 'list',
  Kanban = 'kanban',
}

const { t } = useI18n();
const learningPlanStore = useLearningPlanStore();

const mode = ref<Mode>(Mode.List);
const search = ref('');
const sprints = ref<SprintItem[]>([]);
const items = ref<KanbanItem[]>([]);
const selectedSprint = ref(sprints.value[0] || {});
const filter = ref<FilterType>();
const filterDrawer = ref();
const chips = ref<string[]>([]);
const isProfessor = ref<boolean>(false);
const classes = ref<string[]>([]);
const openFilterDrawer = ref(false);

const columns = computed<SprintItem['columns']>({
  get: () => selectedSprint.value?.columns || [],
  set: (value) => (selectedSprint.value.columns = value),
});

const filteredItems = computed(() => {
  const res = items.value.filter(({ raw: { tags, title } }) => {
    return contains(title, search.value) || tags?.some((tag) => contains(tag.text, search.value));
  });

  return selectedSprint.value.id ? res.filter((item) => item.sprint_id === selectedSprint.value.id) : res;
});

const handleFilter = (value: FilterType) => {
  filter.value = value;
  chips.value = Object.keys(filter.value || {});
};

const toggleMode = () => {
  mode.value = mode.value === Mode.Kanban ? Mode.List : Mode.Kanban;
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
    if (learningPlanStore.loading) return;
    classes.value = learningPlanStore.learningPlan?.classes?.map(get('name')) || [];
    isProfessor.value = !!learningPlanStore.userIsFacilitator;
  },
);
</script>

<template>
  <div class="tw-flex tw-flex-col bg-white rounded tw-flex-grow">
    <Transition name="fade" mode="out-in">
      <div
        v-if="learningPlanStore.loading"
        class="w-100 d-flex justify-space-between align-center height-18 header px-6"
      >
        <alex-custom-skeleton class="w-100 max-w-80 mr-6 min-w-60 height-11" color="gray-300" />
        <alex-custom-skeleton class="w-100 max-w-11 height-11" color="gray-300" />
      </div>
      <div v-else class="w-100 d-flex justify-space-between align-center height-18 header px-6 gap-2">
        <alex-inputs-text-field
          v-model="search"
          hide-details
          class="tw-w-[300px]"
          density="comfortable"
          name="search"
          prepend-inner-icon="mdi-magnify"
          :placeholder="t('pages.projects.tasks.find_task')"
        />
        <alex-inputs-select
          v-if="mode === 'kanban'"
          v-model="selectedSprint"
          hide-details
          return-object
          class="tw-w-[300px] tw-mr-auto"
          density="comfortable"
          item-title="sprint"
          name="search"
          :items="sprints"
          :placeholder="t('pages.projects.tasks.find_task')"
        />
        <div class="tw-flex tw-gap-2">
          <alex-custom-button
            size="large"
            variant="secondary"
            :disabled="!sprints.length"
            :prepend-icon="mode === Mode.List ? 'alex:Kanban' : 'mdi-clipboard-text-outline'"
            :title="sprints.length ? '' : t('pages.projects.tasks.kanban_sprint_required')"
            @click="toggleMode"
          >
            {{ mode === Mode.List ? t('pages.projects.tasks.see_kanban') : t('pages.projects.tasks.see_backlog') }}
          </alex-custom-button>
          <alex-custom-button
            icon="mdi-filter-variant"
            size="large"
            variant="secondary"
            @click="openFilterDrawer = true"
          />
        </div>
      </div>
    </Transition>
    <div class="w-100 px-6 py-4 ga-6 d-flex flex-column tw-flex-grow">
      <alex-learningplan-task-table-skeleton v-if="learningPlanStore.loading" />
      <template v-else>
        <TransitionGroup v-if="chips.length" name="list" tag="div" class="tw-flex tw-gap-2">
          <alex-custom-chip
            v-for="chip in chips"
            :key="chip"
            clickable
            append-icon="mdi-close"
            class="mr-2 bg-gray-blue text-gray-600 text-body-5 tw-w-fit"
            status="secondary"
            variant="outlined"
            :text="t(`pages.projects.tasks.${chip}`)"
            @click="filterDrawer.removeFilter(chip)"
          />
        </TransitionGroup>
        <Kanban v-if="mode === Mode.Kanban" v-model="columns" :items="filteredItems">
          <template #card="{ item }">
            <TaskCard
              :date="item.finish_at ? new Date(item.finish_at) : undefined"
              :name="item.title"
              :tags="item.tags"
              :participants="getMembers(item?.task_members)"
            />
          </template>
        </Kanban>
        <TaskList v-else ref="taskList" :search="search" :filter="filter" />
      </template>
    </div>
    <TaskFilterDrawer ref="filterDrawer" v-model="openFilterDrawer" @filter="handleFilter" />
  </div>
</template>

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
