<template>
  <v-expansion-panel flat>
    <!-- Data -->
    <v-expansion-panel-title flat style="border: none; outline: none">
      <hr class="ml-3 w-full border-sm border-gray-600" />
      <span class="ml-2 text-gray-600">{{ date }}</span>
    </v-expansion-panel-title>

    <!-- Eventos -->
    <v-expansion-panel-text style="padding: 0 12px" flat>
      <div v-for="(event, index) in events" :key="index" class="py-2 my-1">
        <div class="d-flex align-center ga-3">
          <p class="flex-fill">
            <span class="font-weight-bold text-gray-800">{{
              event.user + ' '
            }}</span
            ><span class="text-gray-800">{{ event.action }}</span>
          </p>
          <span class="text-gray-700">{{ event.time }}</span>
        </div>
        <hr v-if="index < events.length - 1" class="mt-2 border-thin" />
      </div>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup lang="ts">
interface EventProps {
  user: string;
  action: string;
  time: string;
}
interface DayEventsProps {
  date: string;
  events: Array<EventProps>;
}
defineProps<DayEventsProps>();
</script>

<style></style>
