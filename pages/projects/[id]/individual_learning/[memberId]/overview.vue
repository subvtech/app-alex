<script setup lang="ts">
import CardTotalizer from '../../-components/CardTotalizer.vue';

const { t } = useI18n();

// Todo - Add custom icons & i18n
const totalizers = ref({
  sprints: {
    title: 'Total de tarefas',
    icon: 'alex:Sprint',
    value: '02',
    percentage: 50,
  },
  epics: {
    title: 'Total de objetivos',
    icon: 'alex:ManageHistory',
    value: '03',
    percentage: 33,
  },
  stories: {
    title: 'Total de contribuições',
    icon: 'alex:HistoryEdu',
    value: '21',
    percentage: 10,
    color: 'warning-0',
    chipColor: 'warning--2',
  },
});
</script>

<template>
  <div>
    <div class="tw-flex tw-flex-wrap gap-4 tw-mb-5 tw-flex-wrap">
      <CardTotalizer v-for="totalizer in Object.values(totalizers)" :key="totalizer.title" :totalizer="totalizer" />
    </div>
    <v-row>
      <v-col cols="8">
        <v-card>
          <v-card-title>Meu progresso</v-card-title>
          <v-card-text> teste </v-card-text>
          <v-card-text>
            <p>50% das tarefas foram terminadas</p>
            <p>Última atualização: 15 de setembro de 2024</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card>
          <v-card-title>Desempenho</v-card-title>
          <v-card-text>teste</v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-card>
      <v-card-title>Objetivos</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>OA1</v-list-item-title>
              <v-list-item-subtitle>Consertar o Header e Sidebar do ALEX</v-list-item-subtitle>
              <v-list-item-subtitle>Término: 2 de janeiro de 2024</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-chip color="green">Concluído</v-chip>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>
