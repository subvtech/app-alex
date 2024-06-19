<template>
  <div
    :id="id"
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
          class="font-weight-bold text-body-4"
          :class="`text-${config[submission.status].color}`"
        >
          {{ config[submission.status].title }}
        </p>

        <!-- Subtexto ou nota -->
        <p
          v-if="submission.mark && submission.maxMark"
          :class="
            submission.status === 'reviewed'
              ? ' text-gray-600 text-h5 font-weight-bold '
              : 'text-gray-500 text-body-5'
          "
        >
          {{ formatGrade(submission.mark) }}/{{
            formatGrade(submission.maxMark)
          }}
        </p>
      </div>
      <!-- Seção 3 (opções) -->
      <div class="d-none d-sm-block flex-fill text-end">
        <p v-if="submission.time" class="text-gray-500 text-body-5">
          {{ formatTime(submission.time) }}
        </p>

        <div v-if="!props.hideInfo">
          <alex-custom-button
            v-if="submission.justification && !noJustification"
            variant="text"
            size="small"
            icon="mdi-message-outline"
            color="gray-600"
            @click="() => $emit('redirect-to-chat', submission)"
          />
        </div>
      </div>
    </div>

    <!-- Justificativa -->
    <div
      v-if="submission.justification && !noJustification"
      class="pa-3 border-t"
    >
      <p class="text-body-4 text-gray-600 font-weight-bold mb-2">
        {{ $t('components.learningPlan.submissions.justification') }}
      </p>

      <!-- Audio e/ou video -->
      <p
        v-if="submission.justification.audioUrl"
        class="text-gray-600 text-body-5"
      >
        <alex-learningplan-task-audio
          :src="submission.justification.audioUrl"
        />
      </p>
      <p v-if="submission.justification.text" class="text-gray-600 text-body-5">
        {{ submission.justification.text }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
type SubmissonChipProps = {
  submission: AttachedSubmission;
  hideInfo?: boolean;
  noJustification?: boolean;
};
const props = withDefaults(defineProps<SubmissonChipProps>(), {
  noJustification: false,
  hideInfo: false,
});

const { t } = useI18n();
const id = computed(() => `submission-chip-${props.submission.id}`);
type Emits = {
  'redirect-to-chat': [submission: AttachedSubmission];
};
defineEmits<Emits>();
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
  [status in 'reviewed' | 'denied']: StatusProps;
};

const config: StatusConfigProps = {
  reviewed: {
    icon: 'mdi-check',
    title: t('components.learningPlan.submissions.accepted.title'),
    color: 'success-0',
  },
  denied: {
    icon: 'mdi-alert-circle-outline',
    title: t('components.learningPlan.submissions.denied.title'),
    color: 'error-0',
  },
};
</script>

<style scoped>
.submission {
  cursor: pointer;
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
.highlight-submission-chip {
  background-color: rgb(var(--v-theme-gray-100)) !important;
}
</style>
