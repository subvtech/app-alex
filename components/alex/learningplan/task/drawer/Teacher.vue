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
          icon="mdi-close"
          size="small"
          variant="text"
          @click="handleCloseModal"
        />
      </div>
    </template>

    <div>
      <!-- Tags -->
      <alex-learningplan-task-tags edit />

      <!-- Informações -->
      <p class="mt-4 text-h2 ellipsis lines-2">
        Criar um mapa mental sobre o assunto abordado em sala de aula
        previamente e isso é um título muito grande grande grande
      </p>

      <v-row class="my-5">
        <v-col cols="6"
          ><p class="text-body-4 text-gray-800 mb-2">
            {{ $t('components.learningPlan.drawer.task.status.label') }}
          </p>
          <alex-learningplan-task-state edit />
        </v-col>
        <v-col cols="6"
          ><p class="text-body-4 text-gray-800 mb-1">
            <span class="text-tag-orange-light">* </span
            >{{ $t('components.learningPlan.drawer.task.type.label') }}
          </p>
          <alex-learningplan-task-options :items="types" edit />
        </v-col>
        <v-col cols="6"
          ><p class="text-body-4 text-gray-800 mb-1">
            <span class="text-tag-orange-light">* </span
            >{{ $t('components.learningPlan.drawer.task.date.startLabel') }}
          </p>

          <alex-learningplan-task-date ref="startDate" edit />
        </v-col>
        <v-col cols="6"
          ><p class="text-body-4 text-gray-800 mb-1">
            <span class="text-tag-orange-light">* </span
            >{{ $t('components.learningPlan.drawer.task.date.finalLabel') }}
          </p>

          <alex-learningplan-task-date ref="finalDate" edit />
        </v-col>
        <v-col cols="6"
          ><p class="text-body-4 text-gray-800 mb-1">
            <span class="text-tag-orange-light">* </span
            >{{
              $t(
                'components.learningPlan.drawer.task.postClosingSubmission.label',
              )
            }}
          </p>
          <alex-learningplan-task-options :items="postClosingOptions" edit
        /></v-col>
      </v-row>

      <alex-learningplan-task-description edit />

      <!-- Objetivos de aprendizagem -->
      <alex-learningplan-task-goals edit />

      <!-- Entregas-->
      <p class="text-h3 mt-6">
        {{ $t('components.learningPlan.drawer.task.submission.label') }}
      </p>
      <v-row class="mx-0 mt-3 mb-4">
        <v-col class="pa-0 d-flex align-center" cols="6">
          <alex-custom-switch
            :label="
              $t('components.learningPlan.drawer.task.submission.reqSubmission')
            "
          />
        </v-col>
        <v-col class="pa-0 d-flex align-center" cols="6">
          <alex-custom-switch
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
    <template v-if="activePage === '3'" #append>
      <alex-learningplan-task-chat-input
        @submit="(data) => console.log(data)"
      />
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
const { t } = useI18n();

// Date picker
const startDate = ref(null);
const finalDate = ref(null);

interface TaskTeacherDrawerProps {
  messages: Message[];
}
defineProps<TaskTeacherDrawerProps>();
const model = defineModel({ default: false });

// Close drawer
function handleCloseModal() {
  model.value = false;
}

// Tipos
const types = ref<string[]>([
  t('components.learningPlan.drawer.task.type.individual'),
  t('components.learningPlan.drawer.task.type.collective'),
]);

// Aceitar depois do prazo
const postClosingOptions = ref<string[]>([
  t('components.learningPlan.drawer.task.postClosingSubmission.accept'),
  t('components.learningPlan.drawer.task.postClosingSubmission.deny'),
]);

// Tabs
const activePage = ref('1');
const tabs = [
  { label: t('components.learningPlan.drawer.tabs.events.label'), value: '1' },
  { label: t('components.learningPlan.drawer.tabs.members.label'), value: '2' },
];
</script>

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
