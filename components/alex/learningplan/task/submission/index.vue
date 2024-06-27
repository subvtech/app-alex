<template>
  <div
    class="submission pa-3 rounded-lg min-w-64 border-1 border-gray-200"
    :class="[colorsAndSizes.background, (clickable || remake) && 'clickable']"
    @click="openDialog"
  >
    <v-icon
      v-if="!hasPrepend && icons.prependIcon"
      :icon="icons.prependIcon"
      :class="colorsAndSizes.title"
      :size="24"
    />
    <slot name="prependIcon" />
    <div class="w-100">
      <h5 class="text-body-4" :class="colorsAndSizes.title">
        {{ text.title }}
      </h5>
      <p :class="[colorsAndSizes.subtitle, colorsAndSizes.subtitleSize]">
        {{ text.subtitle }}
      </p>
    </div>
    <slot name="appendIcon" />
    <v-icon
      v-if="!hasAppend && icons.appendIcon"
      :icon="icons.appendIcon"
      :class="colorsAndSizes.subtitle"
      :size="24"
    />
  </div>
  <alex-learningplan-task-submission-create
    ref="dialog"
    :title="taskTitle"
    :deadline="taskDeadline"
    :restrictions="restrictions"
    :task-member-id="taskMemberId"
    :last-submission="content"
    :task-status="taskStatus"
    @update-task-status="(status) => $emit('update-task-status', status)"
  />
</template>

<script setup lang="ts">
interface Submission {
  mark?: number | null;
  maxMark?: number | null;
  taskTitle?: string;
  taskDeadline?: string;
  restrictions?: string[];
  content?: TaskSubmissionSimple;
  taskMemberId: number;
  taskStatus: TaskMemberStatus;
}
interface StudentSubimission {
  status: 'not_started' | 'started' | 'in_review' | 'reviewed' | 'denied';
  type: 'student';
}
interface ProfessorSubimission {
  status: 'in_review' | 'reviewed' | 'denied';
  type: 'professor';
}
type SubimissionProps = Submission &
  (StudentSubimission | ProfessorSubimission);

const props = withDefaults(defineProps<SubimissionProps>(), {
  clickable: false,
  mark: 0,
  maxMark: 0,
  taskTitle: undefined,
  taskDeadline: undefined,
  restrictions: undefined,
  content: undefined,
});
type Emits = {
  'update-task-status': [status: TaskMemberStatus];
};
defineEmits<Emits>();
const { t } = useI18n();
const slots = useSlots();
const hasPrepend = computed(() => !!slots.prependIcon);
const hasAppend = computed(() => !!slots.appendIcon);
const dialog = ref();
const formattedMark = computed(() => {
  if (!props.mark) {
    return '';
  }
  if (props.maxMark) {
    return `${props.mark}/${props.maxMark}`;
  }
  return `${props.mark}`;
});
const clickable = computed(
  () =>
    ['not_started', 'started'].includes(props.status) ||
    (props.status === 'in_review' && props.type === 'professor'),
);
const remake = computed(
  () => props.status === 'denied' && props.type === 'student',
);
const colorsAndSizes = computed(() => {
  let subtitle = 'text-gray-500';
  let subtitleSize = 'text-body-5';
  let background = 'bg-white';
  let title = 'text-secondary-0';
  if (clickable.value) {
    background = 'bg-gray-blue';
    subtitle = 'text-gray-500';
  } else if (remake.value) {
    title = 'text-error-0';
  } else if (props.status === 'denied') {
    title = 'text-error-0';
    subtitle = 'text-gray-500';
  } else if (props.status === 'in_review') {
    title = 'text-warning-0';
  } else if (props.status === 'reviewed') {
    title = 'text-success-0';
    subtitle = 'text-gray-600';
    subtitleSize = 'text-h5';
  }
  return {
    title,
    subtitle,
    background,
    subtitleSize,
  };
});
const icons = computed(() => {
  if (props.status === 'in_review' && props.type === 'student') {
    return { prependIcon: 'mdi-text-box-outline' };
  } else if (props.status === 'denied') {
    return { prependIcon: 'mdi-alert-circle-outline' };
  } else if (props.status === 'reviewed') {
    return { prependIcon: 'mdi-check' };
  }
  return {
    appendIcon: 'mdi-text-box-outline',
  };
});

const text = computed(() => {
  if (props.status === 'not_started') {
    return {
      title: t('components.courses.tasks.submission.no_started'),
      subtitle: t('components.courses.tasks.submission.click_to_start'),
    };
  }
  if (props.status === 'started') {
    return {
      title: t('components.courses.tasks.submission.started'),
      subtitle: t('components.courses.tasks.submission.click_to_continue'),
    };
  }
  if (props.status === 'in_review' && props.type === 'student') {
    return {
      title: t('components.courses.tasks.submission.in_review'),
      subtitle: t('components.courses.tasks.submission.sent_task'),
    };
  }
  if (props.status === 'denied' && props.type === 'professor') {
    return {
      title: t('components.courses.tasks.submission.denied'),
      subtitle: formattedMark.value,
    };
  }
  if (props.status === 'denied' && props.type === 'student') {
    return {
      title: t('components.courses.tasks.submission.denied'),
      subtitle: t('components.courses.tasks.submission.click_to_remake'),
    };
  }
  if (props.status === 'reviewed') {
    return {
      title: t('components.courses.tasks.submission.reviewed'),
      subtitle: formattedMark.value,
    };
  }
  return {
    title: t('components.courses.tasks.submission.reviewed'),
    subtitle: t('components.courses.tasks.submission.click_to_review'),
  };
});

const openDialog = () => {
  if (clickable.value) {
    dialog.value.openDialog('edit');
  }
};
</script>

<style scoped>
.clickable {
  cursor: pointer;
}
.clickable:hover {
  background-color: rgb(var(--v-theme-gray-100)) !important;
}
.clickable:active {
  background-color: rgb(var(--v-theme-gray-200)) !important;
}
.border-1 {
  border: 1px solid rgb(var(--v-border-color));
}
.submission {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
