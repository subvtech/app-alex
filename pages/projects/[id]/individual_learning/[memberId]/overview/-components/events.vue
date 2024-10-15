<template>
  <alex-custom-card id="overview-events" title="Eventos" no-footer>
    <template #content>
      <v-timeline
        side="end"
        class="tw-max-h-[450px] tw-overflow-y-auto tw-w-full tw-justify-start minimalist-scrollbar"
        line-inset="-6"
        truncate-line="start"
      >
        <v-timeline-item v-for="item in items" :key="item.id" dot-color="white" fill-dot min-height="70">
          <template #icon>
            <div class="tw-flex tw-flex-col justify-center align-center">
              <p class="text-gray-400 text-body-3 tw-text-balance text-center">{{ formattedDate(item.date) }}</p>
              <v-icon color="gray-200" icon="mdi-list-box-outline"></v-icon>
            </div>
          </template>
          <p class="text-body-2 text-gray-800">{{ item.title }}</p>
          <p class="text-body-3 text-gray-600">{{ item.event }}</p>
        </v-timeline-item>
      </v-timeline>
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
// eslint-disable-next-line import/no-duplicates
import { format, isSameDay, isSameMonth, isSameYear } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import { enIN, ptBR } from 'date-fns/locale';

const i18n = useI18n();

const items = [
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

const formattedDate = (strDate: string) => {
  const date = new Date(strDate);
  const now = new Date();
  let dateFormat = '';

  if (isSameDay(date, now)) {
    dateFormat = 'HH:mm';
  } else if (isSameMonth(date, now)) {
    dateFormat = 'd MMM HH:mm';
  } else if (isSameYear(date, now)) {
    dateFormat = 'd MMM HH:mm';
  } else {
    dateFormat = 'd MMM y';
  }

  return format(date, dateFormat, {
    locale: i18n.locale.value === 'pt' ? ptBR : enIN,
  });
};
</script>

<style>
#overview-events .v-timeline-divider__dot {
  width: 75px !important;
}
</style>
