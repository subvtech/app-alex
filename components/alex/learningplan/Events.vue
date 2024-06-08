<template>
  <v-expansion-panels class="events-rows" flat>
    <v-expansion-panel
      v-for="(evtDay, dayIndx) in eventDays"
      :key="dayIndx"
      flat
    >
      <!-- Data -->
      <v-expansion-panel-title flat style="border: none; outline: none">
        <hr class="ml-3 w-full border-sm border-gray-600" />
        <span class="ml-2 text-gray-600">{{ evtDay.date }}</span>
      </v-expansion-panel-title>

      <!-- Eventos -->
      <v-expansion-panel-text style="padding: 0 12px" flat>
        <div
          v-for="(evt, evtIndx) in evtDay.events"
          :key="evtIndx"
          class="py-2 my-1"
        >
          <div class="d-flex align-center ga-3">
            <p class="flex-fill">
              <span class="font-weight-bold text-gray-800">{{
                evt.user + ' '
              }}</span
              ><span class="text-gray-800">{{ evt.action }}</span>
            </p>
            <span class="text-gray-700">{{ evt.time }}</span>
          </div>
          <hr
            v-if="evtIndx < evtDay.events.length - 1"
            class="mt-2 border-thin"
          />
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
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

// Exemplo
const eventDays: Array<DayEventsProps> = [
  {
    date: '24/02/2024',
    events: [
      {
        user: 'Lucas da Silva Sobrenome',
        action: 'criou dois blocos',
        time: '15:03',
      },
      {
        user: 'Sérgio Ramos de Almeida',
        action: 'entregou uma tarefa',
        time: '15:03',
      },
      {
        user: 'Daniel Sílvio Macedo',
        action: 'se matriculou na turma',
        time: '15:03',
      },
    ],
  },
  {
    date: '20/02/2024',
    events: [
      {
        user: 'Lucas da Silva Sobrenome',
        action: 'criou dois blocos',
        time: '15:03',
      },
      {
        user: 'Daniel Sílvio Macedo',
        action: 'se matriculou na turma',
        time: '15:03',
      },
    ],
  },
  {
    date: '19/02/2024',
    events: [
      {
        user: 'Lucas da Silva Sobrenome',
        action: 'criou dois blocos',
        time: '15:03',
      },
      {
        user: 'Sérgio Ramos de Almeida',
        action: 'entregou uma tarefa',
        time: '15:03',
      },
    ],
  },
];
</script>

<style>
/** Personaliza layout do expandivel */
.events-rows .v-expansion-panel-title {
  flex-direction: row-reverse;
  gap: 3px;

  padding: 0 12px;
}

.events-rows.v-expansion-panels {
  border: none !important;
}

/** Remove o padding natural do componente  */
.events-rows .v-expansion-panel-text > div {
  padding: 0 !important;
}

/** Remove a sombra divisora dentro do painel */
.events-rows .v-expansion-panels {
  position: inherit !important;
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
