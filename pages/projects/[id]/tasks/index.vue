<script setup lang="ts">
import { get } from '@/utils/get';
import Kanban from './-components/Kanban.vue';
import TaskFilterDrawer from './-components/TaskFilterDrawer.vue';
import TaskList from './-components/TaskList.vue';
import { useGetSprints } from './-composables/useKanban';
import { SprintSimple } from '#imports';

type FilterType = {
  finalDate?: { start: string | null; end: string | null };
  startDate?: { start: string | null; end: string | null };
  members?: any[];
};

enum Mode {
  List = 'list',
  Kanban = 'kanban',
}

const { t } = useI18n();
const learningPlanStore = useLearningPlanStore();

const mode = ref<Mode>(Mode.List);
const search = ref('');
const route = useRoute();
const learninplanId = computed(() => parseInt(route.params.id.toString()));
const { data: sprints } = useGetSprints(learninplanId);
const selectedSprint = ref<SprintSimple | undefined>(sprints.value?.sprints[0]);
const filter = ref<FilterType>();
const filterDrawer = ref();
const chips = ref<string[]>([]);
const isProfessor = ref<boolean>(false);
const classes = ref<string[]>([]);
const openFilterDrawer = ref(false);
const handleFilter = (value: FilterType) => {
  filter.value = value;
  chips.value = Object.keys(filter.value || {});
};

const toggleMode = () => {
  mode.value = mode.value === Mode.Kanban ? Mode.List : Mode.Kanban;
};

watch(
  () => [learningPlanStore.loading],
  () => {
    if (learningPlanStore.loading) return;
    classes.value = learningPlanStore.learningPlan?.classes?.map(get('name')) || [];
    isProfessor.value = !!learningPlanStore.userIsFacilitator;
  },
);
watch(sprints, (value) => {
  if (!selectedSprint.value) {
    selectedSprint.value = value.sprints[0];
  }
});
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
      <div
        v-else
        class="w-100 d-flex justify-space-between align-center min-height-18 pt-6 pb-4 header px-6 gap-2 flex-wrap"
      >
        <alex-inputs-text-field
          v-model="search"
          hide-details
          class="tw-w-full sm:tw-w-[300px]"
          density="comfortable"
          name="search"
          prepend-inner-icon="mdi-magnify"
          :placeholder="t('pages.projects.tasks.find_task')"
        />
        <alex-inputs-select
          v-show="mode === 'kanban'"
          v-model="selectedSprint"
          hide-details
          return-object
          class="tw-w-[300px] tw-mr-auto"
          density="comfortable"
          item-title="title"
          name="search"
          :items="sprints.sprints"
          :placeholder="t('pages.projects.tasks.select_sprint')"
        />

        <div class="tw-flex tw-gap-2">
          <alex-custom-button
            size="large"
            variant="secondary"
            :prepend-icon="mode === Mode.List ? 'alex:Kanban' : 'mdi-clipboard-text-outline'"
            :title="sprints.sprints.length ? '' : t('pages.projects.tasks.kanban_sprint_required')"
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
        <Kanban v-if="mode === Mode.Kanban" key="kanban" :sprint="selectedSprint" />
        <TaskList v-else key="taskList" ref="taskList" :search="search" :filter="filter" />
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
