<template>
  <div class="mt-6">
    <p class="text-body-4 text-gray-800 mb-2">
      {{ $t('components.learningPlan.drawer.task.goals.label') }}
    </p>

    <div class="d-flex align-center flex-wrap ga-2">
      <v-menu v-if="props.edit" v-model="open" :close-on-content-click="false">
        <!-- Adicionar objetivo -->
        <template #activator="{ props: vMenuProps }">
          <alex-custom-button
            v-bind="vMenuProps"
            icon="mdi-plus"
            size="small"
            variant="tertiary"
          />
        </template>

        <v-list class="pa-4 rounded-lg" style="width: 320px; max-height: 95%">
          <!-- Header -->
          <p class="text-body-1 text-gray-800">
            {{ $t('components.learningPlan.drawer.task.goals.select') }}
          </p>

          <alex-inputs-text-field
            class="alex-goals-search w-full my-2"
            name="member"
            :placeholder="
              $t('components.learningPlan.drawer.task.goals.search')
            "
            append-inner-icon="mdi-magnify"
            density="compact"
          />

          <!-- Opções -->
          <div class="d-flex flex-column ga-1">
            <alex-learningplan-task-goals-card
              v-for="goal in availableGoals"
              :id="goal.id"
              :key="goal.id"
              :description="goal.description"
              @click="addGoal(goal.verb.text)"
            />
          </div>
        </v-list>
      </v-menu>

      <!-- Objetivos selecionados -->
      <alex-custom-chip
        v-for="(goal, index) in selectedGoals"
        :key="index"
        :text="goal"
        :clickable="props.edit"
        :closable="props.edit"
        size="small"
        status="secondary"
        variant="tonal"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface CompProps {
  edit?: boolean;
  availableGoals?: LearningPlanGoalSimple[];
}

const props = withDefaults(defineProps<CompProps>(), {
  availableGoals: () => [],
});

const open = ref<boolean>(false);

// Objetivos em si
type SelectedGoal = string;

// Exibidos no drawe
const selectedGoals = defineModel<SelectedGoal[]>({ default: [] });

function addGoal(goal: SelectedGoal) {
  if (!selectedGoals.value.includes(goal)) {
    selectedGoals.value.push(goal);
  }

  open.value = false;
}
</script>

<style>
.alex-goals-search .v-input__details {
  display: none !important;
  background-color: red;
}
</style>
