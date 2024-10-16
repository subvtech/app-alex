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
          <p class="text-body-3 text-gray-600">{{ eventMessages?.[item.event] ?? '' }}</p>
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

type EventType = {
  id: number;
  title: string;
  event: string;
  date: string;
};

defineProps<{
  items: EventType[];
}>();

const eventMessages = {
  task_created: 'Task created',
  task_start_date: 'Task start date',
  task_deadline: 'Task deadline',
  task_submission: 'Task submission',
  task_archived: 'Task archived',
  task_deadline_ended: 'Task deadline ended',
  student_deadline: 'Student deadline',
  student_status: 'Student status',
  student_added: 'Student added',
  student_removed: 'Student removed',
  group_added: 'Group added',
  group_removed: 'Group removed',
  submission_send: 'Submission send',
  submission_denied: 'Submission denied',
  submission_evaluated: 'Submission evaluated',
  message: 'Message',
};

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
