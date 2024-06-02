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
        {{ title }}
      </p>

      <v-row class="my-5">
        <v-col cols="6"
          ><p class="text-body-4 text-gray-800 mb-2">
            {{ $t('components.learningPlan.drawer.task.status.label') }}
          </p>
          <alex-learningplan-task-state
            v-model="status"
            :edit="editable"
            :items="itemsStatus"
          />
        </v-col>
        <v-col cols="6"
          ><p class="text-body-4 text-gray-800 mb-1">
            <span v-if="editable" class="text-tag-orange-light">* </span
            >{{ $t('components.learningPlan.drawer.task.type.label') }}
          </p>
          <alex-learningplan-task-options :items="types" :edit="editable" />
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
        <v-col class="mt-4 pa-0" cols="12"
          ><p class="text-gray-800 font-weight-bold mb-2">
            {{ $t('components.learningPlan.drawer.task.restrictions.label') }}
          </p>
          <p class="text-body-3 text-gray-800">
            {{ $t('components.learningPlan.drawer.missing.restrictions') }}
          </p></v-col
        >
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

const itemsStatus = {
  draft: {
    title: t('components.learningPlan.drawer.task.status.draft'),
    variant: 'secondary' as 'secondary' | 'blue',
  },
  published: {
    title: t('components.learningPlan.drawer.task.status.published'),
    variant: 'blue' as 'secondary' | 'blue',
  },
  closed: {
    title: t('components.learningPlan.drawer.task.status.closed'),
    variant: 'red' as 'secondary' | 'red',
  },
};
// Status
const status = ref('draft');
// Date picker
const startDate = ref(new Date());
const finalDate = ref(new Date());

// Tipos
const types = ref<string[]>([
  t('components.learningPlan.drawer.task.type.individual'),
  t('components.learningPlan.drawer.task.type.collective'),
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

<style></style>
