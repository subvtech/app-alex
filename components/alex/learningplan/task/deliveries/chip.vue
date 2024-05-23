<template>
  <div
    class="delivery d-flex flex-column overflow-hidden border border-red rounded-lg"
    :class="
      config[delivery.status]?.bg ? `bg-${config[delivery.status]?.bg}` : ''
    "
  >
    <!-- Header -->
    <div
      class="header d-flex align-center ga-3 pa-3 cursor-pointer"
      :class="`${config[delivery.status]?.reversed ? 'flex-row-reverse' : ''} ${
        delivery.status
      }`"
    >
      <!-- Seção 1 (Ícone) -->
      <v-icon
        :color="
          config[delivery.status].iconColor || config[delivery.status].color
        "
        class="semibig-icon"
        >{{ config[delivery.status].icon }}</v-icon
      >

      <!-- Seção 2 (Título e nota/subtexto) -->
      <div class="flex-fill">
        <p
          class="font-weight-bold text-p4"
          :class="`text-${config[delivery.status].color}`"
        >
          {{ config[delivery.status].title }}
        </p>

        <!-- Subtexto ou nota -->
        <p
          v-if="delivery.grade && delivery.maxGrade"
          :class="
            delivery.status === 'accepted'
              ? ' text-gray-600 text-h5 font-weight-bold '
              : 'text-gray-500 text-p5'
          "
        >
          {{ formatGrade(delivery.grade) }}/{{ formatGrade(delivery.maxGrade) }}
        </p>

        <p v-if="delivery.status === 'done'" class="text-p5 text-gray-500">
          {{ $t('components.learningPlan.deliveries.done.subtitle') }}
        </p>
      </div>

      <!-- Seção 3 (opções) -->
      <div
        v-if="delivery.status !== 'done'"
        class="d-none d-sm-block flex-fill text-end"
      >
        <p v-if="delivery.time" class="text-gray-500 text-p5">
          {{ formatTime(delivery.time) }}
        </p>

        <div v-if="!props.hideInfos">
          <v-icon color="gray-600" class="medium-icon"
            >mdi-text-box-outline</v-icon
          >
          <v-icon
            v-if="delivery.text || delivery.audioUrl"
            color="gray-600"
            class="medium-icon ml-2"
            >mdi-message-outline</v-icon
          >
        </div>
      </div>
    </div>

    <!-- Justificativa -->
    <div v-if="delivery.text || delivery.audioUrl" class="pa-3 border-t">
      <p class="text-p4 text-gray-600 font-weight-bold mb-2">
        {{ $t('components.learningPlan.deliveries.justification') }}
      </p>

      <!-- Audio e/ou video -->
      <p v-if="delivery.audioUrl" class="text-gray-600 text-p5">
        > -----Componente de audio aqui---- 01:30
      </p>
      <p v-if="delivery.text" class="text-gray-600 text-p5">
        {{ delivery.text }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface DeliveryProps {
  status: 'denied' | 'accepted' | 'done';
  time?: Date;
  grade?: number;
  maxGrade?: number;
  text?: string | null;
  audioUrl?: string;
}

const props = defineProps({
  hideInfos: {
    type: Boolean,
    required: false,
    default: false,
  },
  delivery: {
    type: Object as PropType<DeliveryProps>,
    required: true,
  },
});

const i18n = useI18n();
const t = i18n.t;

// Formatação de valores
function formatTime(dt: Date) {
  let hours: number | string = dt.getHours();
  let mins: number | string = dt.getMinutes();
  let month: number | string = dt.getMonth();

  hours = hours < 10 ? `0${hours}` : hours;
  mins = mins < 10 ? `0${mins}` : mins;
  month = t(`components.learningPlan.deliveries.months[${month}]`);

  return `${dt.getDate()} de ${month} - ${hours}:${mins}`;
}

// ver essa aqui
function formatGrade(grade: number) {
  if (Number.isInteger(grade)) {
    return grade;
  }

  return grade.toFixed(1);
}

// Propriedades de cada tipo de entrega (Avaliada, Recusada ou entregue)
interface StatusProps {
  icon: string;
  title: string;
  color: string;
  iconColor?: string;
  bg?: string;
  reversed?: boolean;
}

type StatusConfigProps = {
  [status in 'accepted' | 'denied' | 'done']: StatusProps;
};

const config: StatusConfigProps = {
  accepted: {
    icon: 'mdi-check',
    title: t('components.learningPlan.deliveries.accepted.title'),
    color: 'success-0',
  },
  denied: {
    icon: 'mdi-alert-circle-outline',
    title: t('components.learningPlan.deliveries.denied.title'),
    color: 'error-0',
  },
  done: {
    icon: 'mdi-text-box-outline',
    title: t('components.learningPlan.deliveries.done.title'),
    color: 'secondary-0',
    iconColor: 'gray-500',
    bg: 'gray-blue',
    reversed: true,
  },
};
</script>

<style scoped>
/** Formatação de textos e icones */
.text-p4 {
  font-family: Sen;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 135%; /* 18.9px */
  letter-spacing: 0.28px;
}

.text-p5 {
  font-family: Sen;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 135%; /* 16.2px */
  letter-spacing: 0.24px;
}

.text-h5 {
  font-family: Sen;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.36px;
}

.medium-icon {
  font-size: 20px;
}

.semibig-icon {
  font-size: 24px;
}

/** Geral */
.delivery .header:hover {
  background-color: rgb(var(--v-theme-gray-blue));
  transition: background-color 0.3s;
}

/** Entregas realizadas */
.delivery .header.done:hover {
  background-color: rgb(var(--v-theme-gray-100));
}

.delivery .header.done:active {
  background-color: rgb(var(--v-theme-gray-200));
}
</style>
