<script setup lang="ts">
// eslint-disable-next-line import/no-duplicates
import { format } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import { enIN, ptBR } from 'date-fns/locale';

type assessment = {
  name: string;
  tasks: string[];
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

const testAssessments = [
  {
    name: 'Titulo do assessment, que fala sobre o que é o assessment e o que ele faz',
    tasks: [
      'Ler artigo 1',
      'Ler artigo 2',
      'Fazer relatório',
      'Fazer apresentação',
      'Revisar relatório',
      'Revisar apresentação',
      'Revisar artigo',
      'Revisar artigo',
      'Revisar artigo',
      'Revisar artigo',
      'Revisar artigo',
    ],
    lastUpdate: '25/09/2024 às 13:32',
    id: 1,
  },
  {
    name: 'Assessment 2',
    tasks: ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5'],
    lastUpdate: '25/09/2024 às 13:32',
    id: 2,
  },
  {
    name: 'Assessment 3',
    tasks: ['Task 1', 'Task 2', 'Task 3'],
    lastUpdate: '26/09/2024 às 14:00',
    id: 3,
  },
  {
    name: 'Assessment 4',
    tasks: ['Task 1', 'Task 2', 'Task 3', 'Task 4'],
    lastUpdate: '27/09/2024 às 15:45',
    id: 4,
  },
  {
    name: 'Assessment 5',
    tasks: ['Task 1', 'Task 2'],
    lastUpdate: '28/09/2024 às 16:30',
    id: 5,
  },
  {
    name: 'Assessment 6',
    tasks: ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5', 'Task 6'],
    lastUpdate: '29/09/2024 às 17:15',
    id: 6,
  },
  {
    name: 'Assessment 7',
    tasks: ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5', 'Task 6', 'Task 7'],
    lastUpdate: '30/09/2024 às 18:00',
    id: 7,
  },
  {
    name: 'Assessment 8',
    tasks: ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5', 'Task 6', 'Task 7', 'Task 8'],
    lastUpdate: '01/10/2024 às 09:00',
    id: 8,
  },
  {
    name: 'Assessment 9',
    tasks: ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5', 'Task 6', 'Task 7', 'Task 8', 'Task 9'],
    lastUpdate: '02/10/2024 às 10:30',
    id: 9,
  },
  {
    name: 'Assessment 10',
    tasks: ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5', 'Task 6', 'Task 7', 'Task 8', 'Task 9', 'Task 10'],
    lastUpdate: '03/10/2024 às 11:45',
    id: 10,
  },
];

// TODO - Filtro de tarefas por quantidade, filtro de last update data
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

const getRemainingTasks = (tasks: string[]) => {
  const remainingTasks = tasks.slice(4);
  return remainingTasks.join(', ');
};

assessments.value = testAssessments;

const dropdownItems = (assessments: assessment) => [
  {
    // text: t('pages.assessments.edit'),
    text: 'Edit',
    onClick: () => console.log('Edit assessment - ', assessments.name),
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
        @click="console.log"
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
                <td class="tw-w-[540px]">
                  <template v-for="(task, index) in item.tasks" :key="task">
                    <v-tooltip
                      v-if="index <= 4"
                      :text="index < 4 ? task : getRemainingTasks(item.tasks)"
                      location="top"
                      content-class="tw-text-pretty bg-gray-800 text-white text-body-3"
                      max-width="400"
                      transition="fade-transition"
                    >
                      <template #activator="{ props: tooltip }">
                        <!-- TODO: Navigate to task on click -->
                        <alex-custom-chip
                          v-bind="tooltip"
                          :text="index < 4 ? task : '+ ' + (item.tasks.length - 4)"
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
              class="d-flex w-100 tw-h-[92px] justify-end align-center px-6 tw-border-t-[1px] tw-border-[#e0e0e0] tw-mt-auto"
            >
              <alex-custom-pagination
                v-if="assessments.length > 12"
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
