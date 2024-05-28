<template>
  <v-navigation-drawer
    location="right"
    temporary
    floating
    scrim="transparent"
    sticky
    :width="380"
    class="py-6 px-4 rounded-s-lg"
  >
    <div class="d-flex flex-column ga-4 h-full w-full bg-white">
      <!-- Header -->
      <div class="d-flex align-center ga-4 pb-2">
        <p class="text-h4 flex-fill">
          {{ $t('components.learningPlan.drawer.filter') }}
        </p>
        <alex-custom-button
          icon="mdi-close"
          variant="text"
          size="small"
          flat
          @click="closeDrawer"
        />
      </div>

      <hr class="mb-2" />

      <!-- Inputs -->
      <div class="flex-fill">
        <alex-inputs-select
          name="convite"
          :items="classes"
          :placeholder="$t('components.learningPlan.drawer.srchClass')"
          clearable
          density="comfortable"
          hide-details
          :label="$t('components.learningPlan.drawer.class')"
        />

        <p class="text-p1 text-gray-800 mt-4 mb-2">
          {{ $t('components.learningPlan.drawer.finalDate') }}
        </p>
        <div class="d-flex align-center ga-1">
          <alex-inputs-date
            class="flex-1-1"
            name="startDate"
            hide-details
            density="comfortable"
          />
          <alex-inputs-date
            class="flex-1-1"
            hide-details
            name="finalDate"
            density="comfortable"
          />
        </div>
      </div>

      <hr />

      <!-- Opcoes -->
      <div class="d-flex ga-1 pt-4">
        <alex-custom-button class="flex-1-1" variant="secondary" size="large">{{
          $t('components.learningPlan.drawer.clean')
        }}</alex-custom-button>
        <alex-custom-button class="flex-1-1" size="large">{{
          $t('components.learningPlan.drawer.filter')
        }}</alex-custom-button>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
const classes: Array<string> = ['Turma A', 'Turma B', 'Turma C', 'Turma D'];

const emitClose = defineEmits(['close']);

function closeDrawer() {
  emitClose('close');
}
</script>

<style scoped></style>
