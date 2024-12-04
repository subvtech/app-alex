<script setup lang="ts">
// eslint-disable-next-line import/no-duplicates
import { format } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import { enIN, ptBR } from 'date-fns/locale';
import { useRoute } from 'vue-router';
import ChartTooltip from './ToolTip.vue';

const i18Dir = 'components.projects.individual_learning.overview.myProgress';
const lastUpdate = new Date();
const route = useRoute();
const currentPath = route.fullPath;
const activePage = ref(0);
const i18n = useI18n();

type Task = {
  id: number;
  name: string;
  endDate: string;
  status: string;
};

type Objective = {
  id: number;
  name: string;
  percentage: number;
  tasks: Task[] | [];
};

const props = withDefaults(
  defineProps<{
    data: Objective[];
  }>(),
  {
    data: () => [],
  },
);

const processedData = computed(() => {
  return props.data?.map((item) => ({
    ...item,
    total: 100 - item.percentage,
  }));
});

const selectedGoal = computed(() => {
  return props.data?.find(({ id }) => id === activePage.value);
});

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

watch(
  () => props.data,
  (data, oldData) => {
    if (!oldData.length && data.length) {
      setTimeout(() => (activePage.value = data[0].id), 300);
    }
  },
);
</script>

<template>
  <alex-custom-card :title="$t(`${i18Dir}.title`)" no-footer sizing-class="py-0 px-6" class="tw-min-h-[400px] h-100">
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
            :custom-tooltip="ChartTooltip"
            :tooltip-props="{ text: 'Custom Tooltip Text', color: 'blue' }"
            :x-formatter="
              (tick) => {
                return processedData.length && tick % 1 === 0 ? `${$t(`${i18Dir}.goalAcronym`)}${tick + 1}` : '';
              }
            "
          />
          <div v-if="selectedGoal" class="footer mt-4 tw-mx-auto text-center">
            <div class="text-body-1 text-gray-900 d-flex align-center ga-2 mb-1">
              <span
                class="tw-w-[40px] tw-h-[30px] d-flex tw-justify-center align-center rounded gap-1 text-body-1 bg-secondary--2 text-secondary-0"
              >
                {{ `${selectedGoal?.percentage ?? 100}%` }}
              </span>
              {{ $t(`${i18Dir}.finishedTasks`) }}
            </div>
            <p class="text-gray-600 text-body-3">
              {{ $t(`${i18Dir}.lastUpdate`) }}: {{ formattedDate(lastUpdate.toString()) }}
            </p>
          </div>
        </div>
        <div class="lg:tw-w-1/2 tw-w-full pb-6 pl-6 tw-max-h-[400px]">
          <v-tabs v-model="activePage" class="text-gray-800 w-100">
            <v-tooltip
              v-for="(tab, index) in processedData"
              :key="tab.id"
              :text="tab.name"
              location="top"
              content-class="px-4 py-2 bg-gray-800 text-white rounded-lg"
              max-width="300"
              open-delay="450"
            >
              <template #activator="{ props: tooltip }">
                <v-tab :value="tab.id" v-bind="tooltip" color="accent" @click="activePage = tab.id">
                  <span>{{ $t(`${i18Dir}.goalAcronym`) }}{{ index + 1 }}</span>
                </v-tab>
              </template>
            </v-tooltip>
          </v-tabs>

          <v-window v-if="processedData.length" v-model="activePage" class="tw-h-[90%]">
            <v-window-item v-for="objective in data" :key="objective.name" :value="objective.id" class="tw-h-full">
              <div v-if="!objective.tasks.length" class="tw-flex justify-center align-center tw-h-full">
                <span>
                  <v-img src="/svg/emptyOAProgress.svg" class="tw-h-[120px] my-4" />
                  <p class="text-gray-400 text-body-3">{{ $t(`${i18Dir}.noTaskAttached`) }}</p></span
                >
              </div>
              <div v-else class="tw-overflow-y-auto tw-h-full mt-4 minimalist-scrollbar">
                <div
                  v-for="task in objective.tasks"
                  :key="task.id"
                  class="w-100 tw-h-[80px] pa-3 rounded-lg tw-border tw-flex align-center justify-space-between my-1"
                >
                  <div>
                    <p class="text-body-5 text-gray-400 mb-2 ellipsis lines-1">
                      <alex-custom-chip
                        :text="$t(`components.courses.tasks.task.status.${task.status}`)"
                        :status="chipStatus(task.status)"
                        size="small"
                        class="width-20 mr-2"
                      ></alex-custom-chip>
                      {{ $t(`${i18Dir}.deadline`) }} {{ formattedDate(task.endDate) }}
                    </p>
                    <p class="text-body-2 text-gray-800 ellipsis lines-1">{{ task.name }}</p>
                  </div>
                  <nuxt-link
                    :to="{
                      path: currentPath.replace('/panel', '/tasks'),
                      query: { task: task.id },
                    }"
                    class="text-body-5 text-primary-0"
                    ><v-icon icon="mdi-chevron-right" size="28"
                  /></nuxt-link>
                </div>
              </div>
            </v-window-item>
          </v-window>
          <div v-else class="tw-flex justify-center align-center tw-h-[90%]">
            <span>
              <v-img src="/svg/emptyOAProgress.svg" class="tw-h-[120px] my-4" />
              <p class="text-gray-400 text-body-3">{{ $t(`${i18Dir}.noGoalRegistered`) }}</p></span
            >
          </div>
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
