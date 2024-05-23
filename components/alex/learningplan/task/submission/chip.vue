<template>
  <div
    class="submission d-flex flex-column overflow-hidden border border-red rounded-lg"
    :class="
      config[submission.status]?.bg ? `bg-${config[submission.status]?.bg}` : ''
    "
  >
    <!-- Header -->
    <div
      class="header d-flex align-center ga-3 pa-3"
      :class="`${
        config[submission.status]?.reversed ? 'flex-row-reverse' : ''
      } ${submission.status}`"
    >
      <!-- Seção 1 (Ícone) -->
      <v-icon
        :color="
          config[submission.status].iconColor || config[submission.status].color
        "
        class="semibig-icon"
        >{{ config[submission.status].icon }}</v-icon
      >

      <!-- Seção 2 (Título e nota/subtexto) -->
      <div class="flex-fill">
        <p
          class="font-weight-bold text-p4"
          :class="`text-${config[submission.status].color}`"
        >
          {{ config[submission.status].title }}
        </p>

        <!-- Subtexto ou nota -->
        <p
          v-if="submission.grade && submission.maxGrade"
          :class="
            submission.status === 'accepted'
              ? ' text-gray-600 text-h5 font-weight-bold '
              : 'text-gray-500 text-p5'
          "
        >
          {{ formatGrade(submission.grade) }}/{{
            formatGrade(submission.maxGrade)
          }}
        </p>

        <p v-if="submission.status === 'done'" class="text-p5 text-gray-500">
          {{ $t('components.learningPlan.submissions.done.subtitle') }}
        </p>
      </div>

      <!-- Seção 3 (opções) -->
      <div
        v-if="submission.status !== 'done'"
        class="d-none d-sm-block flex-fill text-end"
      >
        <p v-if="submission.time" class="text-gray-500 text-p5">
          {{ formatTime(submission.time) }}
        </p>

        <div v-if="!props.hideInfos">
          <v-icon color="gray-600" class="medium-icon"
            >mdi-text-box-outline</v-icon
          >
          <v-icon
            v-if="submission.text || submission.audioUrl"
            color="gray-600"
            class="medium-icon ml-2"
            >mdi-message-outline</v-icon
          >
        </div>
      </div>
    </div>

    <!-- Justificativa -->
    <div v-if="submission.text || submission.audioUrl" class="pa-3 border-t">
      <p class="text-p4 text-gray-600 font-weight-bold mb-2">
        {{ $t('components.learningPlan.submissions.justification') }}
      </p>

      <!-- Audio e/ou video -->
      <p v-if="submission.audioUrl" class="text-gray-600 text-p5">
        <alex-learningplan-task-audio :src="submission.audioUrl" />
      </p>
      <p v-if="submission.text" class="text-gray-600 text-p5">
        >{{ submission.text }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SubmissionProps {
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
  submission: {
    type: Object as PropType<SubmissionProps>,
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
  month = t(`components.learningPlan.submissions.months[${month}]`);

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
    title: t('components.learningPlan.submissions.accepted.title'),
    color: 'success-0',
  },
  denied: {
    icon: 'mdi-alert-circle-outline',
    title: t('components.learningPlan.submissions.denied.title'),
    color: 'error-0',
  },
  done: {
    icon: 'mdi-text-box-outline',
    title: t('components.learningPlan.submissions.done.title'),
    color: 'secondary-0',
    iconColor: 'gray-500',
    bg: 'gray-blue',
    reversed: true,
  },
};
</script>

<style scoped>
.submission {
  cursor: pointer;
}

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
.submission:hover > .header {
  background-color: rgb(var(--v-theme-gray-blue));
  transition: background-color 0.3s;
}

/** Entregas realizadas */
.submission:hover > .header.done {
  background-color: rgb(var(--v-theme-gray-100));
}

.submission .header.done:active {
  background-color: rgb(var(--v-theme-gray-200));
}
</style>
