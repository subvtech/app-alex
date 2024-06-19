<template>
  <v-expansion-panel flat>
    <!-- Data -->
    <v-expansion-panel-title flat style="border: none; outline: none">
      <hr class="ml-3 w-full border-sm border-gray-600" />
      <span class="ml-2 text-gray-600">{{ formatDate(date) }}</span>
    </v-expansion-panel-title>

    <!-- Eventos -->
    <v-expansion-panel-text style="padding: 0 12px" flat>
      <div v-for="(event, index) in events" :key="index" class="py-2 my-1">
        <div class="d-flex align-center ga-3">
          <p class="flex-fill">
            <span
              v-if="hasUserName(event.action)"
              class="font-weight-bold text-gray-800"
              >{{ event.user }}</span
            ><span class="text-gray-800">{{
              ' ' +
              $t(`components.learningPlan.drawer.task.events.${event.action}`)
            }}</span>
          </p>
          <span class="text-gray-700">{{ formatHour(event.time) }}</span>
        </div>
        <hr v-if="index < events.length - 1" class="mt-2 border-thin" />
      </div>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup lang="ts">
import { format } from 'date-fns';

interface EventProps {
  user?: string;
  action: string;
  time: string | Date;
}
interface DayEventsProps {
  date: string | Date;
  events: Array<EventProps>;
}
defineProps<DayEventsProps>();
const formatHour = (date: string | Date) => {
  if (typeof date === 'string') {
    return format(Date.parse(date), 'HH:mm');
  }
  return format(date, 'HH:mm');
};
const formatDate = (date: string | Date) => {
  if (typeof date === 'string') {
    return format(Date.parse(date), 'dd/MM/yyyy');
  }
  return format(date, 'dd/MM/yyyy');
};
const taskWithoutUser = [
  'task_created',
  'task_archived',
  'task_deadline_ended',
  'submission_denied',
  'submission_evaluated',
];
const hasUserName = (event: string) => !taskWithoutUser.includes(event);
</script>

<style></style>
