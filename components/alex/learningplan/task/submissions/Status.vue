<template>
  <HoverCard>
    <HoverCardTrigger>
      <v-icon icon="mdi-paperclip" />
      {{ submitted.completed + submitted.underReview }}
      {{
        submitted.completed + submitted.underReview > 1
          ? $t('pages.task.submissions.deliveries')
          : $t('pages.task.submissions.delivery')
      }}
    </HoverCardTrigger>
    <HoverCardContent class="bg-white">
      <div class="d-flex justify-space-between pb-4 divider-row">
        <span class="text-gray-800 text-h5">{{
          $t('pages.task.submissions.progress')
        }}</span>
        <span class="text-secondary-0 text-h5">{{ completedPercentage }}%</span>
      </div>
      <div class="d-flex ga-4 flex-column mt-4 text-gray-600 text-body-1">
        <span v-for="i in 4" :key="i" class="d-flex justify-space-between">
          <alex-custom-chip
            :status="taskStatus[i - 1].color"
            :text="taskStatus[i - 1].text"
          />
          {{ taskStatus[i - 1].value }}
          {{ $t(`${taskType}${taskStatus[i - 1].value > 1 ? 's' : ''}`) }}
        </span>
      </div>
    </HoverCardContent>
  </HoverCard>
</template>

<script setup lang="ts">
import { TaskType } from '~/models/simple/taskSimple.model';

interface Submissions {
  submitted: {
    toDo: number;
    doing: number;
    underReview: number;
    completed: number;
  };
  type?: TaskType | null;
}
type TaskStatus = {
  text: string;
  color: 'secondary' | 'blue' | 'orange' | 'green' | 'primary' | 'red';
  value: number;
};

const { t } = useI18n();
const props = withDefaults(defineProps<Submissions>(), {
  submitted: () => ({
    toDo: 0,
    doing: 0,
    underReview: 0,
    completed: 0,
  }),
  type: 'individual',
});

const taskStatus: TaskStatus[] = [
  {
    text: t('pages.task.submissions.toDo'),
    color: 'secondary',
    value: props.submitted.toDo,
  },
  {
    text: t('pages.task.submissions.doing'),
    color: 'blue',
    value: props.submitted.doing,
  },
  {
    text: t('pages.task.submissions.underReview'),
    color: 'orange',
    value: props.submitted.underReview,
  },
  {
    text: t('pages.task.submissions.done'),
    color: 'green',
    value: props.submitted.completed,
  },
];

const taskType = computed(() =>
  props.type === 'group'
    ? 'pages.task.submissions.group'
    : 'pages.task.submissions.student',
);

const completedPercentage = computed(() => {
  const total =
    props.submitted.toDo +
    props.submitted.doing +
    props.submitted.underReview +
    props.submitted.completed;
  return total === 0
    ? 0
    : Math.round((props.submitted.completed / total) * 100);
});
</script>

<style scoped>
.divider-row {
  border-bottom: 1px solid rgb(var(--v-theme-gray-100));
}
</style>
