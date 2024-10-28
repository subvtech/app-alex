<script setup lang="ts">
// eslint-disable-next-line import/no-duplicates
import { format } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import { enIN, ptBR } from 'date-fns/locale';
import TaskDrawer from './-components/drawer.vue';

type tasksType = {
  id: number;
  title: string;
  type: 'rubric' | 'criteria' | 'group';
  methodName: string;
  value: number;
  isGroup?: boolean;
};

type assessment = {
  name: string;
  tasks: tasksType[];
  lastUpdate: string;
  id: number;
};

const learningPlanStore = useLearningPlanStore();
// const { t } = useI18n();
const i18n = useI18n();
const assessments = ref<assessment[]>();
const page = ref(1);
const search = ref('');
const isLoading = ref(false);
const drawer = ref();

const testAssessments = [
  {
    name: 'Titulo do assessment, que fala sobre o que é o assessment e o que ele faz',
    tasks: [
      { id: 1, title: 'Ler artigo 1', type: 'rubric', methodName: 'rubric', value: 3 },
      { id: 2, title: 'Ler artigo 2', type: 'rubric', methodName: 'rubric', value: 4 },
      { id: 3, title: 'Fazer relatório', type: 'criteria', methodName: 'criteria', value: 5 },
      { id: 4, title: 'Fazer apresentação', type: 'criteria', methodName: 'criteria', value: 6 },
      { id: 5, title: 'Revisar relatório', type: 'group', methodName: 'group', value: 2, isGroup: true },
      { id: 6, title: 'Revisar apresentação', type: 'group', methodName: 'group', value: 3, isGroup: true },
      { id: 7, title: 'Revisar artigo', type: 'rubric', methodName: 'rubric', value: 4 },
      { id: 8, title: 'Revisar artigo', type: 'rubric', methodName: 'rubric', value: 4 },
      { id: 9, title: 'Revisar artigo', type: 'rubric', methodName: 'rubric', value: 4 },
      { id: 10, title: 'Revisar artigo', type: 'rubric', methodName: 'rubric', value: 4 },
      { id: 11, title: 'Revisar artigo', type: 'rubric', methodName: 'rubric', value: 4 },
    ],
    lastUpdate: '25/09/2024 às 13:32',
    id: 1,
  },
  {
    name: 'Assessment 2',
    tasks: [
      { id: 1, title: 'Task 1', type: 'rubric', methodName: 'rubric', value: 2 },
      { id: 2, title: 'Task 2', type: 'criteria', methodName: 'criteria', value: 3 },
      { id: 3, title: 'Task 3', type: 'group', methodName: 'group', value: 4, isGroup: true },
      { id: 4, title: 'Task 4', type: 'rubric', methodName: 'rubric', value: 5 },
      { id: 5, title: 'Task 5', type: 'criteria', methodName: 'criteria', value: 6 },
    ],
    lastUpdate: '25/09/2024 às 13:32',
    id: 2,
  },
  {
    name: 'Assessment 3',
    tasks: [
      { id: 1, title: 'Task 1', type: 'group', methodName: 'group', value: 2, isGroup: true },
      { id: 2, title: 'Task 2', type: 'rubric', methodName: 'rubric', value: 3 },
      { id: 3, title: 'Task 3', type: 'criteria', methodName: 'criteria', value: 4 },
    ],
    lastUpdate: '26/09/2024 às 14:00',
    id: 3,
  },
  {
    name: 'Assessment 4',
    tasks: [
      { id: 1, title: 'Task 1', type: 'rubric', methodName: 'rubric', value: 2 },
      { id: 2, title: 'Task 2', type: 'criteria', methodName: 'criteria', value: 3 },
      { id: 3, title: 'Task 3', type: 'group', methodName: 'group', value: 4, isGroup: true },
      { id: 4, title: 'Task 4', type: 'rubric', methodName: 'rubric', value: 5 },
    ],
    lastUpdate: '27/09/2024 às 15:45',
    id: 4,
  },
  {
    name: 'Assessment 5',
    tasks: [
      { id: 1, title: 'Task 1', type: 'rubric', methodName: 'rubric', value: 3 },
      { id: 2, title: 'Task 2', type: 'criteria', methodName: 'criteria', value: 4 },
    ],
    lastUpdate: '28/09/2024 às 16:30',
    id: 5,
  },
];

const header = [
  {
    title: 'Name',
    key: 'name',
    with: 400,
  },
  {
    title: 'Tasks',
    key: 'tasks',
    with: 540,
  },
  {
    title: 'Last Update',
    key: 'lastUpdate',
  },
  {
    title: '',
    key: 'actions',
    sortable: false,
  },
];

const formattedDate = (strDate: string | Date) => {
  const date = new Date(strDate);
  const isPortuguese = i18n.locale.value === 'pt';
  const dateFormat = isPortuguese ? "dd/MM/yyyy 'às' HH:mm" : "MM/dd/yyyy 'at' HH:mm";
  const locale = isPortuguese ? ptBR : enIN;

  return format(date, dateFormat, { locale });
};

const getRemainingTasks = (tasks: tasksType[]) => {
  const taskTitles = tasks.map((task) => task.title);
  return taskTitles.join(', ');
};

assessments.value = testAssessments;

// Todo: Delete functionality
const dropdownItems = (assessments: assessment) => [
  {
    // text: t('pages.assessments.edit'),
    text: 'Edit',
    onClick: () => drawer.value.openDrawer(assessments),
  },
  {
    // text: t('pages.assessments.delete'),
    text: 'Delete',
    warning: true,
    onClick: () => console.log('Delete assessment - ', assessments.name),
  },
];
</script>

<template>
  <div class="bg-white rounded-lg pa-6 tw-w-100 tw-min-h-[500px]">
    <div
      class="d-flex flex-wrap w-100 gap-4 gap-sm-1"
      :class="!assessments?.length ? 'justify-end' : 'justify-space-between mb-6'"
    >
      <alex-inputs-text-field
        v-show="assessments?.length"
        v-model="search"
        name="search"
        :placeholder="$t('pages.assessments.findAssessment')"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        class="w-50"
        size="default"
        style="min-width: 160px; max-width: 320px"
        density="comfortable"
      />

      <alex-custom-button
        v-if="learningPlanStore.userIsFacilitator"
        prepend-icon="mdi-plus"
        size="large"
        @click="drawer.openDrawer()"
      >
        {{ $t('pages.assessments.newAssessment') }}</alex-custom-button
      >
    </div>
    <div v-if="isLoading"></div>
    <div
      v-else-if="!assessments?.length"
      class="d-flex align-center justify-center flex-column tw-h-full tw-min-h-[400px]"
    >
      <img src="public/svg/emptyAssessments.svg" alt="Empty trails" />
      <p class="text-center text-gray-400 text-h3 mt-4">{{ $t('pages.assessments.emptyStateText') }}</p>
    </div>
    <div v-else>
      <div class="d-flex flex-wrap gap-4 gap-sm-1 tw-min-h-[500px]">
        <v-data-table
          sort-asc-icon="mdi-arrow-up-thin"
          sort-desc-icon="mdi-arrow-down-thin"
          class="rounded-lg mb-4 text-gray-800 text-body-3 table"
          :header-props="{ class: 'text-gray-600 text-body-2 tw-border-t tw-border-[#e0e0e0]' }"
          items-per-page="-1"
          :items="assessments"
          :headers="header"
          :search="search"
          hide-default-footer
        >
          <template #body="{ items }">
            <transition-group name="list">
              <tr v-for="item in items" :key="item.id" class="text-5 text-no-wrap bg-white">
                <td class="tw-w-[400px]">
                  <span class="text-gray-800 text-body-3 ellipsis lines-1 tw-break-words">
                    {{ item.name }}
                  </span>
                </td>
                <td class="tw-w-[540px] tw-overflow-x-scroll">
                  <template v-for="(task, index) in item.tasks" :key="task">
                    <v-tooltip
                      v-if="index <= 4"
                      :text="index < 4 ? task.title : getRemainingTasks(item.tasks)"
                      location="top"
                      content-class="tw-text-pretty bg-gray-800 text-white text-body-3"
                      max-width="400"
                      transition="fade-transition"
                    >
                      <template #activator="{ props: tooltip }">
                        <!-- TODO: Navigate to task on click -->
                        <alex-custom-chip
                          v-bind="tooltip"
                          :text="index < 4 ? task.title : '+ ' + (item.tasks.length - 4)"
                          variant="outlined"
                          status="secondary"
                          class="mr-2 rounded-lg !tw-max-w-[100px] text-body-5 tw-text-wrap tw-break-all tw-select-none"
                          text-classes="ellipsis lines-1"
                        />
                      </template>
                    </v-tooltip>
                  </template>
                </td>
                <td class="tw-w-[540px]">
                  <span class="text-gray-700 text-body-1">
                    {{ formattedDate(new Date()) }}
                  </span>
                </td>
                <td>
                  <alex-custom-dropdown variant="text" :items="dropdownItems(item)" />
                </td>
              </tr>
            </transition-group>
          </template>
          <template #bottom>
            <div
              v-if="assessments.length > 12"
              class="d-flex w-100 tw-h-[92px] justify-end align-center px-6 tw-border-t-[1px] tw-border-[#e0e0e0] tw-mt-auto"
            >
              <alex-custom-pagination
                v-model="page"
                :length="Math.floor(assessments.length / 12)"
                :total-visible="5"
                class="extra-mb"
              />
            </div>
          </template>
        </v-data-table>
      </div>
    </div>
    <!-- TODO: Pass available tasks (todas as tasks do curso que tenham forma de avaliação associadas ) -->
    <TaskDrawer ref="drawer" :available-tasks="[]" />
  </div>
</template>

<style scoped>
:global(.table table) {
  position: relative !important;
  overflow: hidden !important;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
