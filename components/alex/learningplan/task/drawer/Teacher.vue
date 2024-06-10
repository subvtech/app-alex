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
      <alex-learningplan-task-tags :edit="editable" />

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

          <alex-learningplan-task-date v-model="finalDate" :edit="editable" />
        </v-col>
      </v-row>

      <alex-learningplan-task-description
        v-model="description"
        :edit="editable"
      />

      <!-- Objetivos de aprendizagem -->
      <alex-learningplan-task-goals :edit="editable" />

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
          <alex-learningplan-task-restrictions v-model="restrictions" edit />
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
          prepend-icon="alex:trail"
          :text="
            $t(
              'components.learningPlan.drawer.task.learningResources.noneSelected',
            )
          "
          variant="tertiary"
          @click="$emit('click:attached-trail')"
        />
      </div>

      <!-- Eventos e atribuições -->
      <alex-custom-tabs v-model="activePage" :tabs="tabs"></alex-custom-tabs>
      <v-window v-model="activePage">
        <v-window-item value="1">
          <alex-learningplan-task-events
        /></v-window-item>
        <v-window-item value="2">
          <alex-learningplan-task-members
        /></v-window-item>
      </v-window>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { RestrictionValue } from '../Restrictions.vue';
import { StudentTaskStatus, TeacherTaskStatus } from '../State.vue';
import { AlexDropdownItem } from '~/components/alex/custom/Dropdown.vue';

const { t } = useI18n();

interface TaskTeacherDrawerProps {
  title: string;
  messages: Message[];
  description?: string;
  editable?: boolean;
  hasSubmission?: boolean;
  sendAfterDeadline?: boolean;
  kanbanButton?: boolean;
}
const props = withDefaults(defineProps<TaskTeacherDrawerProps>(), {
  editable: true,
  hasSubmission: false,
  sendAfterDeadline: false,
  kanbanButton: false,
  description: undefined,
});
const description = toRef(props.description);
const hasSubmission = toRef(props.hasSubmission);
const sendAfterDeadline = toRef(props.sendAfterDeadline);
const model = defineModel({ default: false });

defineEmits(['click:kanban', 'click:attached-trail']);

// Status
const status = ref<TeacherTaskStatus | StudentTaskStatus>('draft');

// Date picker
const startDate = ref(new Date());
const finalDate = ref(new Date());

// Restrições
const restrictions = ref<RestrictionValue[]>(['text']);

// Tipos
const currType = ref<string>(
  t('components.learningPlan.drawer.task.type.individual'),
);

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
// Close drawer
function handleCloseModal() {
  model.value = false;
}
</script>

<style scoped>
/** Estilização da página */
.text-p3 {
  /* Body/P3 */
  font-family: Sen;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 135%; /* 18.9px */
  letter-spacing: 0.28px;
}

.text-p4 {
  /* Body/P4 */
  font-family: Sen;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 135%; /* 18.9px */
  letter-spacing: 0.28px;
}
</style>

<style>
/** Override do v-switch */
.switches .v-switch.v-switch--inset .v-selection-control__wrapper {
  /** Para de comprimir o input */
  width: auto !important;
}

.switches .v-input__details {
  /** Remove espaços desnecessários */
  display: none !important;
}

.switches .v-switch__thumb {
  /** Para de mudar a aparência do toggle ao selecionar */
  transform: none !important;
}

.switches .v-selection-control__wrapper {
  /** Alinha o componente ao resto do drawer */
  margin-left: 0 !important;
}
</style>
