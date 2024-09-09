<script setup lang="ts">
import CardTotalizer from '../../-components/CardTotalizer.vue';

const { t } = useI18n();

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
</script>

<template>
  <div>
    <div class="tw-flex tw-flex-wrap gap-4 tw-mb-5 tw-flex-wrap">
      <CardTotalizer v-for="totalizer in Object.values(totalizers)" :key="totalizer.title" :totalizer="totalizer" />
    </div>
    <v-row class="mb-6">
      <v-col cols="12" lg="8">
        <alex-custom-card title="Meu Progresso" no-footer sizing-class="py-0 px-6" class="tw-h-[470px]">
          <template #content>
            <div class="d-flex flex-wrap w-100">
              <div
                class="lg:tw-w-1/2 tw-w-full lg:tw-border-r-[1px] tw-border-b-[1px] lg:tw-border-b-0 tw-border-gray-100 d-flex justify-center tw-flex-col align-center pa-4"
              >
                <div class="width-100 height-60 bg-gray-200" />
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
              <div class="lg:tw-w-1/2 tw-w-full">
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
              </div>
            </div>
          </template>
        </alex-custom-card>
      </v-col>
      <v-col cols="12" lg="4">
        <alex-custom-card title="Desempenho" no-footer sizing-class="py-0 px-6" class="tw-h-[470px]">
        </alex-custom-card>
      </v-col>
    </v-row>
    <alex-custom-card title="Eventos" no-footer></alex-custom-card>
  </div>
</template>
