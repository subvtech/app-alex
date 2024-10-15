<script setup lang="ts">
// eslint-disable-next-line import/no-duplicates
import { format } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import { enIN, ptBR } from 'date-fns/locale';
import Tooltip from './tooltip.vue';
const activePage = ref(0);
const i18n = useI18n();

const data = [
  {
    id: 123,
    name: 'Pesquisar o aprendizado do aluno por meio de metodologias funcionais. o aprendizado do aluno por meio de metodologias funcionais. o aprendizado do aluno por meio de metodologias funcionais.',
    percentage: 100,
    tasks: [
      { id: 1, name: 'Consertar a Sidebar da plataforma ALEX', endDate: '09-03-2024', status: 'done' },
      {
        id: 2,
        name: 'Fazer algo muito importante que tem uma importância extrema',
        endDate: '01-29-2025',
        status: 'to_do',
      },
      { id: 3, name: 'Tarefa 3', endDate: '02-18-2025', status: 'doing' },
      { id: 4, name: 'Tarefa 4', endDate: '02-18-2025', status: 'doing' },
      { id: 5, name: 'Tarefa 5', endDate: '02-18-2025', status: 'doing' },
    ],
  },
  {
    id: 124,
    name: 'Pesquisar o aprendizado do aluno por meio de metodologias funcionais. o aprendizado do aluno por meio de metodologias funcionais. o aprendizado do aluno por meio de metodologias funcionais.',
    percentage: 0,
    tasks: [],
  },
  {
    id: 125,
    name: 'Apender sobre a vida a verdade e o universo',
    percentage: 80,
    tasks: [],
  },
  {
    id: 200,
    name: 'Vital, adanava a pé e achava que assim estava mal',
    percentage: 50,
    tasks: [],
  },
];
const processedData = computed(() => {
  return data.map((item) => ({
    ...item,
    total: 100 - item.percentage,
  }));
});

const tabs = computed(() =>
  data.map((_item, index) => ({
    label: `OA${index}`,
    value: index,
  })),
);

const formattedDate = (strDate: string) => {
  const date = new Date(strDate);
  return format(date, `d MMM y`, {
    locale: i18n.locale.value === 'pt' ? ptBR : enIN,
  });
};

const chipStatus = (status: string) => {
  const mapedColors = {
    to_do: 'secondary',
    doing: 'orange',
    done: 'green',
  };
  return mapedColors[status] as 'secondary' | 'blue' | 'orange' | 'green';
};
</script>

<template>
  <alex-custom-card title="Meu Progresso" no-footer sizing-class="py-0 px-6" class="tw-min-h-[400px]">
    <template #content>
      <div class="d-flex flex-wrap w-100">
        <div
          class="lg:tw-w-1/2 tw-w-full lg:tw-border-r-[1px] tw-border-b-[1px] lg:tw-border-b-0 tw-border-gray-100 d-flex justify-center tw-flex-col align-center pa-6"
        >
          <BarChart
            class="!tw-h-[270px] mb-4"
            index="name"
            :data="processedData"
            :categories="['percentage', 'total']"
            :type="'stacked'"
            :show-legend="false"
            :colors="['#00b7cc', '#e1f9fc']"
            :bar-width="65"
            :custom-tooltip="Tooltip"
            :x-formatter="
              (tick) => {
                return `OA${processedData[tick].id}`;
              }
            "
          />
          <div class="footer mt-4">
            <div class="text-body-1 text-gray-900 d-flex align-center ga-2 mb-1">
              <span
                class="tw-w-[40px] tw-h-[30px] d-flex tw-justify-center align-center rounded gap-1 text-body-1 bg-secondary--2 text-secondary-0"
              >
                50%
              </span>
              das tarefas foram terminadas
            </div>
            <p class="text-gray-600 text-body-3">Ultima atualização: 19 de setembro de 2024</p>
          </div>
        </div>
        <div class="lg:tw-w-1/2 tw-w-full pb-6 pl-6 tw-max-h-[400px]">
          <alex-custom-tabs v-model="activePage" :tabs="tabs" />
          <v-window v-model="activePage" class="tw-h-[90%]">
            <v-window-item v-for="(OA, index) in data" :key="OA.name" :value="index" class="tw-h-full">
              <div v-if="!OA.tasks.length" class="tw-flex justify-center align-center tw-h-full">
                <span>
                  <v-img src="/svg/emptyOAProgress.svg" class="tw-h-[120px] my-4" />
                  <p class="text-gray-400 text-body-3">Nenhuma tarefa associada a este objetivo</p></span
                >
              </div>
              <div v-else class="tw-overflow-y-auto tw-h-full mt-4 minimalist-scrollbar">
                <div
                  v-for="task in OA.tasks"
                  :key="task.id"
                  class="w-100 tw-h-[80px] pa-3 rounded-lg tw-border tw-flex align-center justify-space-between my-1"
                >
                  <div>
                    <p class="text-body-5 text-gray-400 mb-2 ellipsis lines-1">
                      <alex-custom-chip
                        :text="task.status"
                        :status="chipStatus(task.status)"
                        size="small"
                        class="width-20 mr-2"
                      ></alex-custom-chip>
                      Término {{ formattedDate(task.endDate) }}
                    </p>
                    <p class="text-body-2 text-gray-800 ellipsis lines-1">{{ task.name }}</p>
                  </div>
                  <nuxt-link to="/projects/1/individual_learning/1/overview/1" class="text-body-5 text-primary-0"
                    ><v-icon icon="mdi-chevron-right" size="28"
                  /></nuxt-link>
                </div>
              </div>
            </v-window-item>
          </v-window>
        </div>
      </div>
    </template>
  </alex-custom-card>
</template>

<style>
.minimalist-scrollbar::-webkit-scrollbar {
  width: 10px;
}

.minimalist-scrollbar::-webkit-scrollbar-track-piece {
  background-color: #fff;
}

.minimalist-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbcbcb;
  outline: 2px solid #fff;
  outline-offset: -2px;
  border: 0.1px solid #b7b7b7;
  border-radius: 10px;
}

.minimalist-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #909090;
}
</style>
