<script setup lang="ts">
import StatisticCard from '../../../-components/StatisticCard.vue';
import Events from './-components/events.vue';
import Progress from './-components/myProgress.vue';
import Performance from './-components/performance.vue';

// TODO @Eliezir - Add custom icons & i18n
const totalizers = ref({
  tasks: {
    title: 'Total de tarefas',
    icon: 'alex:Sprint',
    value: '02',
    percentage: 50,
  },
  objectives: {
    title: 'Total de objetivos',
    icon: 'alex:ManageHistory',
    value: '03',
    percentage: 33,
  },
  contributions: {
    title: 'Total de contribuições',
    icon: 'alex:HistoryEdu',
    value: '21',
    percentage: 10, // TODO @Eliezir - Add custom percentage label
    color: 'warning-0',
    chipColor: 'warning--2',
  },
});

const grades = [
  { name: 'Média', grade: 10 },
  { name: 'AV2', grade: 2 },
  { name: 'AV1', grade: 8 },
];
</script>

<template>
  <div>
    <div class="tw-flex tw-flex-wrap gap-4 tw-mb-5">
      <StatisticCard v-for="item in Object.values(totalizers)" :key="item.title" v-bind="item" />
    </div>
    <v-row class="mb-6">
      <v-col cols="12" lg="8">
        <Progress />
      </v-col>
      <v-col cols="12" lg="4">
        <Performance :data="grades" />
      </v-col>
    </v-row>
    <Events />
  </div>
</template>
