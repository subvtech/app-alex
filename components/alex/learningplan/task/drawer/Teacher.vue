<template>
  <v-navigation-drawer
    v-model="model"
    location="right"
    temporary
    floating
    :width="640"
    scrim="transparent"
    sticky
    class="pa-6 pt-2 rounded-s-lg"
  >
    <template #prepend>
      <div class="d-flex align-center justify-end">
        <alex-custom-button
          v-if="kanbanButton"
          icon="alex:Kanban"
          size="small"
          variant="text"
          @click="$emit('kanban-click')"
        />
        <alex-custom-button
          icon="mdi-close"
          size="small"
          variant="text"
          @click="handleCloseModal"
        />
      </div>
    </template>

    <div>
      <!-- Tags -->
      <alex-learningplan-task-tags v-model="tags" :edit="editable" />

      <!-- Informações -->
      <p class="mt-4 text-h2 ellipsis lines-2">
        {{
          title ||
          '(' + $t('components.learningPlan.drawer.missing.title') + ')'
        }}
      </p>

      <v-row class="my-5">
        <v-col cols="6"
          ><p class="text-body-4 text-gray-800 mb-2">
            {{ $t('components.learningPlan.drawer.task.status.label') }}
          </p>
          <alex-learningplan-task-state v-model="status" :edit="editable" />
        </v-col>
        <v-col cols="6"
          ><p class="text-body-4 text-gray-800 mb-1">
            <span v-if="editable" class="text-tag-orange-light">* </span
            >{{ $t('components.learningPlan.drawer.task.type.label') }}
          </p>
          <alex-learningplan-task-options
            v-model="currType"
            :items="types"
            :edit="editable"
            placeholder="Selecione um tipo"
          />
        </v-col>
        <v-col cols="6"
          ><p class="text-body-4 text-gray-800 mb-1">
            <span v-if="editable" class="text-tag-orange-light">* </span
            >{{ $t('components.learningPlan.drawer.task.date.startLabel') }}
          </p>

          <alex-learningplan-task-date v-model="startDate" :edit="editable" />
        </v-col>
        <v-col cols="6"
          ><p class="text-body-4 text-gray-800 mb-1">
            <span v-if="editable" class="text-tag-orange-light">* </span
            >{{ $t('components.learningPlan.drawer.task.date.finalLabel') }}
          </p>

          <alex-learningplan-task-date v-model="endDate" :edit="editable" />
        </v-col>
      </v-row>

      <alex-learningplan-task-description
        v-model="description"
        :edit="editable"
      />

      <!-- Objetivos de aprendizagem -->
      <alex-learningplan-task-goals :edit="editable" :goals="goals" />

      <!-- Entregas-->
      <p class="text-h3 mt-6">
        {{ $t('components.learningPlan.drawer.task.submission.label') }}
      </p>
      <v-row class="mx-0 mt-3 mb-4">
        <v-col class="pa-0 d-flex align-center" cols="6">
          <alex-custom-switch
            v-model="hasSubmission"
            :label="
              $t('components.learningPlan.drawer.task.submission.reqSubmission')
            "
          />
        </v-col>
        <v-col class="pa-0 d-flex align-center" cols="6">
          <alex-custom-switch
            v-model="sendAfterDeadline"
            :label="
              $t('components.learningPlan.drawer.task.submission.aftrDeadline')
            "
          />
        </v-col>
        <v-col class="mt-4 pa-0" cols="12">
          <alex-learningplan-task-restrictions
            v-model="restrictionsValue"
            edit
          />
        </v-col>
      </v-row>

      <!-- Recursos de aprendizagem -->
      <div class="my-6">
        <p class="text-h3 mb-4">
          {{
            $t('components.learningPlan.drawer.task.learningResources.label')
          }}
        </p>
        <alex-custom-button
          size="large"
          prepend-icon="alex:trail"
          append-icon="mdi-chevron-right"
          :text="
            $t(
              'components.learningPlan.drawer.task.learningResources.noneSelected',
            )
          "
          variant="tertiary"
          @click="$emit('attached-trail-click')"
        />
      </div>

      <!-- Eventos e atribuições -->
      <alex-custom-tabs v-model="activePage" :tabs="tabs"></alex-custom-tabs>
      <v-window v-model="activePage">
        <v-window-item value="1">
          <alex-learningplan-task-events v-model="taskEvents"
        /></v-window-item>
        <v-window-item value="2">
          <alex-learningplan-task-members
        /></v-window-item>
      </v-window>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { isSameDay } from 'date-fns';
import { WritableComputedRef } from 'nuxt/dist/app/compat/capi';
import { RestrictionValue } from '../Restrictions.vue';
import { StudentTaskStatus, TeacherTaskStatus } from '../State.vue';
import { TaskStatus, TaskType } from '~/models/simple/taskSimple.model';
import { AlexDropdownItem } from '~/components/alex/custom/Dropdown.vue';

const { t } = useI18n();

interface TaskTeacherDrawerProps {
  title: string;
  status: TaskStatus;
  type?: TaskType | null;
  goals?: LearningPlanGoalSimple[];
  events?: TaskEvent[];
  messages?: Message[];
  description?: string;
  restrictions?: string;
  editable?: boolean;
  hasSubmission?: boolean;
  sendAfterDeadline?: boolean;
  kanbanButton?: boolean;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
}
const props = withDefaults(defineProps<TaskTeacherDrawerProps>(), {
  editable: true,
  hasSubmission: false,
  sendAfterDeadline: false,
  kanbanButton: false,
  description: undefined,
  messages: () => [],
  startDate: undefined,
  endDate: undefined,
  restrictions: '',
  goals: () => [],
  events: () => [],
  type: undefined,
});
const description = toRef(props.description);
const hasSubmission = toRef(props.hasSubmission);
const sendAfterDeadline = toRef(props.sendAfterDeadline);
const tags = ref<TagSimple[]>([]);
const model = defineModel({ default: false });

defineEmits(['kanban-click', 'attached-trail-click']);

// Status
const status = ref<TeacherTaskStatus | StudentTaskStatus>(
  props.status as TeacherTaskStatus,
);

// Date picker
const startDate = toRef(props.startDate);
const endDate = toRef(props.endDate);

// Restrições
const restrictions = toRef(props.restrictions);
const restrictionsValue = computed({
  get() {
    return restrictions.value ? restrictions.value.split(',') : [];
  },
  set(newValue) {
    restrictions.value = newValue.join(',');
  },
}) as WritableComputedRef<RestrictionValue[]>;

// Tipos
const currType = toRef<string>(props.type || '');
const types = ref<AlexDropdownItem[]>([
  {
    text: t('components.learningPlan.drawer.task.type.individual'),
    onClick: () => {
      currType.value = t('components.learningPlan.drawer.task.type.individual');
    },
  },
  {
    text: t('components.learningPlan.drawer.task.type.collective'),
    onClick: () => {
      currType.value = t('components.learningPlan.drawer.task.type.collective');
    },
  },
]);

// Tabs
const activePage = ref('1');
const tabs = [
  { label: t('components.learningPlan.drawer.tabs.events.label'), value: '1' },
  { label: t('components.learningPlan.drawer.tabs.members.label'), value: '2' },
];

// Events
const taskEvents = computed(() => orderToDateEvents(props.events));
const orderToDateEvents = (events: TaskEvent[]) => {
  const eventsGroups: { date: Date; events: any[] }[] = [];
  events.forEach((current) => {
    const currentDate = new Date(current.publishedAt);
    const currentElement = {
      user: 'test',
      action: current.event,
      time: current.publishedAt,
    };
    const group = eventsGroups.find((group) =>
      isSameDay(currentDate, new Date(group.date)),
    );
    if (group) {
      group.events.push(currentElement);
      return;
    }
    eventsGroups.push({
      date: currentDate,
      events: [currentElement],
    });
  });
  return eventsGroups;
};
// Close drawer
function handleCloseModal() {
  model.value = false;
}
</script>

<style scoped></style>

<style></style>
