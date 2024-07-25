<template>
  <alex-custom-dropdown
    :disabled="config[model]?.immutable"
    :items="mode == 'teacher' ? filteredTeacher : filteredStudent"
  >
    <template #activator="{ props: vMenuProps }">
      <p class="text-body-4 text-gray-800 mb-2">
        {{ $t('components.learningPlan.drawer.task.status.label') }}
      </p>
      <alex-custom-chip
        v-bind="vMenuProps"
        :text="config[model]?.text"
        :status="config[model]?.status"
        :prepend-icon="!config[model]?.immutable ? 'mdi-chevron-down' : ''"
        :clickable="!config[model]?.immutable"
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
}

const props = withDefaults(defineProps<StateProps>(), {
  edit: false,
  mode: 'teacher',
  size: 'x-small',
  readonly: false,
});

const model = defineModel<TaskStatus | TaskMemberStatus>({
  required: true,
});

const { t } = useI18n();

// Estilização e props
const config = computed(() => {
  const value: Record<TaskStatus | TaskMemberStatus, StateConfig> = {
    // Professor
    draft: {
      text: t('components.learningPlan.drawer.task.status.draft'),
      status: 'secondary',
      immutable: !props.edit,
    },
    published: {
      text: t('components.learningPlan.drawer.task.status.published'),
      status: 'blue',
      immutable: !props.edit,
    },
    finished: {
      text: t('components.learningPlan.drawer.task.status.finished'),
      status: 'red',
      immutable: !props.edit,
    },
    // Aluno
    to_do: {
      text: t('components.learningPlan.drawer.task.status.toDo'),
      status: 'secondary',
      immutable: props.edit,
    },
    in_progress: {
      text: t('components.learningPlan.drawer.task.status.inProgress'),
      status: 'blue',
      immutable: props.edit,
    },
    in_review: {
      text: t('components.learningPlan.drawer.task.status.underReview'),
      status: 'orange',
      immutable: !props.edit,
    },
    done: {
      text: t('components.learningPlan.drawer.task.status.finished'),
      status: 'green',
      immutable: true,
    },
  };
  return value;
});

// Professor (Items do dropdown)
const teacherOptions: AlexDropdownItem[] = [
  {
    text: config.value.draft.text,
    onClick: () => (model.value = 'draft'),
  },
  {
    text: config.value.published.text,
    onClick: () => (model.value = 'published'),
  },
  {
    text: config.value.finished.text,
    onClick: () => (model.value = 'finished'),
  },
];

// Aluno (Opções do dropdown)
const studentOptions: AlexDropdownItem[] = [
  {
    text: config.value.to_do.text,
    onClick: () => (model.value = 'to_do'),
  },
  {
    text: config.value.in_progress.text,
    onClick: () => (model.value = 'in_progress'),
  },
  {
    text: config.value.in_review.text,
    onClick: () => (model.value = 'in_review'),
  },
];

const filteredTeacher = computed(() =>
  teacherOptions
    .filter((item) => item !== undefined)
    .filter((item) => item.text !== config[model.value]?.text),
);

const filteredStudent = computed(() =>
  studentOptions
    .filter((item) => item !== undefined)
    .filter((item) => item.text !== config[model.value]?.text),
);
</script>
