<script setup lang="ts">
import { contains } from '@/utils/contains';
import { get } from '@/utils/get';
import { Column } from '~/components/alex/learningplan/task/project/kanban/types';

type FilterType = {
  members?: any[];
  startDate?: {
    start: string | null;
    end: string | null;
  };
  finalDate?: {
    start: string | null;
    end: string | null;
  };
};

type Item = {
  sprint_id: number;
  group: string;
  raw: TaskSimple;
};

type Sprint = {
  id: number;
  sprint: string;
  columns: Column[];
};

enum Mode {
  List = 'list',
  Kanban = 'kanban',
}

const { t } = useI18n();
const learningPlanStore = useLearningPlanStore();

const mode = ref<Mode>(Mode.List);
const search = ref('');
const sprints = ref<Sprint[]>([]);
const items = ref<Item[]>([]);
const selectedSprint = ref(sprints.value[0] || {});
const filter = ref<FilterType>();
const filterDrawer = ref();
const chips = ref<string[]>([]);
const isProfessor = ref<boolean>(false);
const classes = ref<string[]>([]);
const openFilterDrawer = ref(false);

const columns = computed<Column[]>({
  get: () => selectedSprint.value?.columns || [],
  set: (value) => (selectedSprint.value.columns = value),
});

const filteredItems = computed({
  get() {
    return items.value.filter((item) => {
      return (
        contains(item.raw.title, search.value) ||
        item.raw.tags?.some((tag) => contains(tag.text, search.value))
      );
    });
  },
  set(value) {
    items.value = value;
  },
});

const filteredItemsBySprint = computed(() => {
  return filteredItems.value.filter(
    (item) => item.sprint_id === selectedSprint.value.id,
  );
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
    const { learningPlan, userIsFacilitator } = learningPlanStore;
    isProfessor.value = userIsFacilitator || false;
    classes.value = learningPlan?.classes?.map(get('name')) || [];
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
            variant="secondary"
            :disabled="!sprints.length"
            :prepend-icon="
              mode === Mode.List ? 'alex:Kanban' : 'mdi-clipboard-text-outline'
            "
            :title="
              sprints.length
                ? ''
                : 'É necessário ter pelo menos uma Sprint para ver o modo Kanban'
            "
            @click="toggleMode"
          >
            {{ mode === Mode.List ? 'Ver Kanban' : 'Ver Backlog' }}
          </alex-custom-button>
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
          v-if="mode === Mode.Kanban"
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
