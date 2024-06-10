<template>
  <div class="mt-6">
    <p class="text-body-4 text-gray-800 mb-2">
      {{ $t('components.learningPlan.drawer.task.goals.label') }}
    </p>

    <div class="d-flex align-center flex-wrap ga-2">
      <v-menu v-if="props.edit" v-model="open" :close-on-content-click="false">
        <!-- Adicionar objetivo -->
        <template #activator="{ props }">
          <alex-custom-button
            v-bind="props"
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
              @click="addGoal(goal.chip)"
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
}

const props = defineProps<CompProps>();

const open = ref<boolean>(false);

// Objetivos em si
type SelectedGoal = string;

interface Goal {
  id: number;
  description: string;
  chip: SelectedGoal;
}

const availableGoals = ref<Goal[]>([
  {
    id: 1,
    description:
      '*Melhorar* o aprendizado do aluno por meio de metodologias funcionais.',
    chip: 'CH #5',
  },
  {
    id: 3,
    description:
      '*Pesquisar* o aprendizado do aluno por meio de *metodologias funcionais* com o o aprendizado do aluno por meio de aprendizado.',
    chip: 'PA #8',
  },
  {
    id: 6,
    description:
      '*Criar* o aprendizado do aluno por meio de metodologias funcionais.',
    chip: 'LM #1',
  },
]);

// Exibidos no drawe
const selectedGoals = ref<SelectedGoal[]>(['C1 #3', 'B4 #5', 'C1 #3', 'B4 #5']);

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
