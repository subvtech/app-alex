<template>
  <v-expansion-panels v-if="!loading" class="events-rows" flat>
    <alex-learningplan-task-events-card
      v-for="(event, index) in events"
      :key="index"
      :date="event.date"
      :events="event.events"
    />
  </v-expansion-panels>
  <div v-else class="w-full flex flex-col gap-2 py-4">
    <alex-custom-skeleton class="w-full h-16" color="gray-blue" />
    <alex-custom-skeleton class="w-full h-16" color="gray-blue" />
    <alex-custom-skeleton class="w-full h-16" color="gray-blue" />
  </div>
</template>

<script setup lang="ts">
export interface EventProps {
  user?: string;
  action: string;
  time: string | Date;
}

interface DayEventsProps {
  date: string | Date;
  events: Array<EventProps>;
}
const events = defineModel<DayEventsProps[]>();
withDefaults(defineProps<{ loading?: boolean }>(), { loading: false });
</script>

<style>
.events-rows.v-expansion-panels {
  border: none !important;
}

/** Remove a sombra divisora dentro do painel */
.events-rows .v-expansion-panels {
  position: inherit !important;
}

/** Personaliza layout do expandivel */
.events-rows .v-expansion-panel-title {
  flex-direction: row-reverse;
  gap: 3px;

  padding: 0 12px;
}

/** Remove o padding natural do componente  */
.events-rows .v-expansion-panel-text > div {
  padding: 0 !important;
}

/** Remove a sombra do v-panel-text (flat não resolveu) */
.events-rows .v-expansion-panel__shadow {
  display: none !important;
}

/** Remove a linha que divide os expandiveis */
.events-rows .v-expansion-panel:not(:first-child)::after {
  border-top-style: none !important;
}

/** Dps 'enxugar' umas classes */
.events-rows .v-expansion-panel * {
  box-shadow: none !important;
}
</style>
