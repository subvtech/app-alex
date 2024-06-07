<template>
  <alex-custom-dropdown
    :disabled="config[model]?.immutable"
    :items="mode == 'teacher' ? filteredTeacher : filteredStudent"
  >
    <template #activator="{ props }">
      <alex-custom-chip
        v-bind="props"
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

// Tipos
export type TeacherTaskStatus = 'draft' | 'published' | 'closed';
export type StudentTaskStatus =
  | 'toDo'
  | 'inProgress'
  | 'underReview'
  | 'finished';

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

const model = defineModel<TeacherTaskStatus | StudentTaskStatus>({
  required: true,
});

const { t } = useI18n();

// Estilização e props
const config: Record<TeacherTaskStatus | StudentTaskStatus, StateConfig> = {
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
  closed: {
    text: t('components.learningPlan.drawer.task.status.closed'),
    status: 'red',
    immutable: !props.edit,
  },
  // Aluno
  toDo: {
    text: t('components.learningPlan.drawer.task.status.toDo'),
    status: 'secondary',
    immutable: props.edit,
  },
  inProgress: {
    text: t('components.learningPlan.drawer.task.status.inProgress'),
    status: 'blue',
    immutable: props.edit,
  },
  underReview: {
    text: t('components.learningPlan.drawer.task.status.underReview'),
    status: 'orange',
    immutable: !props.edit,
  },
  finished: {
    text: t('components.learningPlan.drawer.task.status.finished'),
    status: 'green',
    immutable: true,
  },
};

// Professor (Items do dropdown)
const teacherOptions: AlexDropdownItem[] = [
  {
    text: config.draft.text,
    onClick: () => (model.value = 'draft'),
  },
  {
    text: config.published.text,
    onClick: () => (model.value = 'published'),
  },
  {
    text: config.closed.text,
    onClick: () => (model.value = 'closed'),
  },
];

// Aluno (Opções do dropdown)
const studentOptions: AlexDropdownItem[] = [
  {
    text: config.toDo.text,
    onClick: () => (model.value = 'toDo'),
  },
  {
    text: config.inProgress.text,
    onClick: () => (model.value = 'inProgress'),
  },
  {
    text: config.underReview.text,
    onClick: () => (model.value = 'underReview'),
  },
  {
    text: config.finished.text,
    onClick: () => (model.value = 'finished'),
  },
];

const filteredTeacher = computed(() =>
  teacherOptions
    .filter((item) => item !== undefined)
    .filter((item) => item.text !== config[model.value].text),
);

const filteredStudent = computed(() =>
  studentOptions
    .filter((item) => item !== undefined)
    .filter((item) => item.text !== config[model.value].text),
);

onMounted(() => {
  console.log(filteredTeacher);
  console.log(filteredStudent);
});
</script>
