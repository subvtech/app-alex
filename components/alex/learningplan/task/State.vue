<template>
  <alex-custom-dropdown
    :disabled="config[model]?.immutable || props.config === undefined"
    :items="props.config ? configOptions : mode == 'teacher' ? filteredTeacher : filteredStudent"
  >
    <template #activator="{ props: vMenuProps }">
      <p class="text-body-4 text-gray-800 mb-2">
        {{ $t('components.learningPlan.drawer.task.status.label') }}
      </p>
      <alex-custom-chip
        v-bind="vMenuProps"
        :text="props.config || props.config?.length ? customState?.title ?? '(No state)' : config[model]?.text"
        :status="props.config ? customState?.status ?? 'secondary' : config[model]?.status"
        :prepend-icon="config[model]?.immutable || props.config === undefined ? '' : 'mdi-chevron-down'"
        :clickable="!config[model]?.immutable || props.config"
        :size="size"
        variant="tonal"
      />
    </template>
  </alex-custom-dropdown>
</template>

<script setup lang="ts">
import { AlexDropdownItem } from '../../custom/Dropdown.vue';
import { TaskMemberStatus, TaskStatus } from '~/models/simple/taskSimple.model';

// Tipos
interface StateConfig {
  text: string;
  status: 'secondary' | 'blue' | 'orange' | 'green' | 'red';
  immutable?: boolean;
}

// Props e model do componente
interface StateProps {
  // Visão do professor
  edit?: boolean;

  // Teacher: Editando a tarefa  | Student: Editando entrega
  mode?: 'teacher' | 'student';
  size?: 'x-small' | 'small' | 'large' | 'medium';
  readonly?: boolean;
  individualJourney?: boolean;
}

const props = withDefaults(defineProps<StateProps>(), {
  edit: false,
  mode: 'teacher',
  size: 'x-small',
  readonly: false,
  individualJourney: false,
});

const model = defineModel<TaskStatus | TaskMemberStatus | string>({
  required: true,
});

const emit = defineEmits(['change-status', 'change-kanban-col']);

const { t } = useI18n();

const customState = ref<any>(model.value);

// Estilização e props
const config = computed(() => {
  const value: Record<TaskStatus | TaskMemberStatus, StateConfig> = {
    // Professor
    draft: {
      text: t('components.learningPlan.drawer.task.status.draft'),
      status: 'secondary',
      immutable: !props.edit && !props.individualJourney,
    },
    published: {
      text: t('components.learningPlan.drawer.task.status.published'),
      status: 'blue',
      immutable: !props.edit && !props.individualJourney,
    },
    finished: {
      text: t('components.learningPlan.drawer.task.status.finished'),
      status: 'red',
      immutable: !props.edit && !props.individualJourney,
    },
    // Aluno
    to_do: {
      text: t('components.learningPlan.drawer.task.status.toDo'),
      status: 'secondary',
      immutable: props.edit && !props.individualJourney,
    },
    in_progress: {
      text: t('components.learningPlan.drawer.task.status.inProgress'),
      status: 'blue',
      immutable: props.edit && !props.individualJourney,
    },
    in_review: {
      text: t('components.learningPlan.drawer.task.status.underReview'),
      status: 'orange',
      immutable: !props.edit && !props.individualJourney,
    },
    done: {
      text: t('components.learningPlan.drawer.task.status.finished'),
      status: 'green',
      immutable: !props.individualJourney,
    },
  };

  return value;
});

// Professor (Items do dropdown)
const teacherOptions: AlexDropdownItem[] = [
  {
    text: config.value.draft?.text,
    onClick: () => (model.value = 'draft'),
  },
  {
    text: config.value.published?.text,
    onClick: () => (model.value = 'published'),
  },
  {
    text: config.value.finished?.text,
    onClick: () => (model.value = 'finished'),
  },
];

// Aluno (Opções do dropdown)
const studentOptions: AlexDropdownItem[] = [
  {
    text: config.value.to_do?.text,
    onClick: () => (model.value = 'to_do'),
  },
  {
    text: config.value.in_progress?.text,
    onClick: () => (model.value = 'in_progress'),
  },
  {
    text: config.value.in_review?.text,
    onClick: () => (model.value = 'in_review'),
  },
  {
    text: config.value.done.text,
    onClick: () => (model.value = 'done'),
  },
].filter(({ text }) => {
  if (!props.individualJourney && text === config.value.done.text) {
    return false;
  }

  return true;
});

const themes = {
  to_do: 'secondary',
  doing: 'blue',
  done: 'green',
};

const filteredTeacher = computed(() =>
  teacherOptions.filter((item) => item !== undefined).filter((item) => item.text !== config.value[model.value]?.text),
);

const filteredStudent = computed(() =>
  studentOptions.filter((item) => item !== undefined).filter((item) => item.text !== config.value[model.value]?.text),
);
</script>
