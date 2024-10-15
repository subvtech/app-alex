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

const events = [
  { id: 1, title: 'Fazer um vídeo sobre algo', event: 'Tarefa criada', date: '10/15/2024 10:00 AM' },
  { id: 2, title: 'Reunião com a equipe', event: 'Status alterado', date: '10/15/2024 11:00 AM' },
  { id: 3, title: 'Entrega do projeto', event: 'Tarefa entregue', date: '10/15/2024 02:00 PM' },
  { id: 4, title: 'Planejamento do próximo mês', event: 'Tarefa criada', date: '10/10/2024 09:00 AM' },
  { id: 5, title: 'Revisão de código', event: 'Status alterado', date: '10/05/2024 03:00 PM' },
  { id: 6, title: 'Apresentação do produto', event: 'Tarefa entregue', date: '09/03/2024 01:00 PM' },
  { id: 7, title: 'Treinamento da equipe', event: 'Tarefa criada', date: '08/30/2024 10:00 AM' },
  { id: 8, title: 'Atualização do sistema', event: 'Status alterado', date: '07/15/2024 04:00 PM' },
  { id: 9, title: 'Reunião anual', event: 'Tarefa entregue', date: '12/10/2023 11:00 AM' },
  { id: 10, title: 'Avaliação de desempenho', event: 'Tarefa criada', date: '11/05/2023 09:00 AM' },
];

const progress = [
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
</script>

<template>
  <div>
    <div class="tw-flex tw-flex-wrap gap-4 tw-mb-5">
      <StatisticCard v-for="item in Object.values(totalizers)" :key="item.title" v-bind="item" />
    </div>
    <v-row class="mb-6">
      <v-col cols="12" lg="8">
        <Progress :data="progress" />
      </v-col>
      <v-col cols="12" lg="4">
        <Performance :data="grades" />
      </v-col>
    </v-row>
    <Events :items="events" />
  </div>
</template>
