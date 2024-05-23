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
      <alex-custom-button
        icon="mdi-close"
        size="small"
        variant="text"
        @click="handleCloseModal"
      />
    </template>

    <div>
      <!-- Tags -->
      <div class="d-flex flex-wrap align-stretch gap-3">
        <alex-custom-button
          icon="mdi-plus"
          size="small"
          variant="secondary"
          @click="tags.push('Tag')"
        />
        <alex-custom-chip
          v-for="(tag, index) in tags"
          :key="index"
          :text="tag"
          size="small"
          status="blue"
          variant="tonal"
          clickable
          closable
        />
      </div>

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
          <alex-learningplan-task-state />
        </v-col>
        <v-col cols="6"
          ><p class="text-body-4 text-gray-800 mb-1">
            <span class="text-tag-orange-light">* </span
            >{{ $t('components.learningPlan.drawer.task.type.label') }}
          </p>
          <alex-learningplan-task-type
        /></v-col>
        <v-col cols="6"
          ><p class="text-body-4 text-gray-800 mb-1">
            <span class="text-tag-orange-light">* </span
            >{{ $t('components.learningPlan.drawer.task.date.startLabel') }}
          </p>

          <alex-learningplan-task-date ref="startDate" />
        </v-col>
        <v-col cols="6"
          ><p class="text-body-4 text-gray-800 mb-1">
            <span class="text-tag-orange-light">* </span
            >{{ $t('components.learningPlan.drawer.task.date.finalLabel') }}
          </p>

          <alex-learningplan-task-date ref="finalDate" />
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
          <p class="text-body-3 text-gray-800">
            {{
              $t(
                'components.learningPlan.drawer.task.postClosingSubmission.accept',
              )
            }}
          </p></v-col
        >
      </v-row>

      <p class="text-body-4 text-gray-800 mb-2">
        {{ $t('components.learningPlan.drawer.task.description.label') }}
      </p>
      <alex-inputs-text-area
        name="aluno"
        :placeholder="
          $t('components.learningPlan.drawer.task.description.placeHolder')
        "
        variant="outlined"
        hide-details
        density="comfortable"
      />

      <!-- Entregas-->
      <p class="text-h3 mt-6">
        {{ $t('components.learningPlan.drawer.task.submission.label') }}
      </p>
      <v-row class="mx-0 mt-3 mb-4">
        <v-col class="pa-0 d-flex align-center" cols="6">
          <alex-custom-switch
            color="blue"
            :label="
              $t('components.learningPlan.drawer.task.submission.reqSubmission')
            "
          />
        </v-col>
        <v-col class="pa-0 d-flex align-center" cols="6">
          <alex-custom-switch
            color="blue"
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
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
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

// Tags
const tags = ref<Array<string>>(['Desenvolvimento', 'UI/UX']);
</script>

<style scoped></style>

<style></style>
