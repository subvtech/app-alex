<template>
  <div class="mt-6">
    <p class="text-body-4 text-gray-800 mb-2">
      {{ $t('components.learningPlan.drawer.task.goals.label') }}
    </p>

    <div class="d-flex align-center flex-wrap ga-2">
      <v-menu
        v-if="props.edit"
        v-model="open"
        :close-on-content-click="false"
        attach
      >
        <!-- Adicionar objetivo -->
        <template #activator="{ props: vMenuProps }">
          <alex-custom-button
            v-bind="vMenuProps"
            icon="mdi-plus"
            size="small"
            variant="tertiary"
          />
        </template>

        <v-list
          class="alex-task-goals-search pa-4 rounded-lg"
          style="width: 320px; max-height: 95%"
        >
          <!-- Header -->
          <p class="text-body-1 text-gray-800">
            {{ $t('components.learningPlan.drawer.task.goals.select') }}
          </p>

          <alex-inputs-text-field
            v-model="search"
            autofocus
            name="goals"
            class="alex-search-goals tw-w-full mt-2"
            :placeholder="
              $t('components.learningPlan.drawer.task.goals.search')
            "
            append-inner-icon="mdi-magnify"
            density="compact"
          />

          <!-- Opções -->
          <div class="d-flex flex-column ga-1 mt-2">
            <template v-if="searchedGoals.length">
              <alex-learningplan-task-goals-card
                v-for="goal in searchedGoals"
                :id="ids[goal.id]"
                :key="goal.id"
                :verb="goal.verb?.text"
                :description="goal.description"
                @click="addGoal(goal)"
            /></template>
            <div v-else class="text-center text-gray-400">
              {{ $t('components.learningPlan.drawer.missing.general') }}
            </div>
          </div>
        </v-list>
      </v-menu>

      <!-- Objetivos selecionados -->
      <alex-custom-chip
        v-for="goal in selectedGoals"
        :key="goal.id"
        :text="`OA #${ids[goal.id]}`"
        :clickable="props.edit"
        :closable="props.edit"
        size="small"
        status="secondary"
        variant="tonal"
        @click:close="removeGoal(goal)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type VMenu } from 'vuetify/components/VMenu';
interface CompProps {
  edit?: boolean;
  attach?: VMenu['attach'];
}

const props = withDefaults(defineProps<CompProps>(), {
  attach: true,
});
const selectedGoals = defineModel<LearningPlanGoalSimple[]>({ default: [] });

const open = ref<boolean>(false);
const search = ref<string>('');
const searchedGoals = ref<LearningPlanGoalSimple[]>([]);

const learningPlanStore = useLearningPlanStore();

const selectedIds = computed(() => selectedGoals.value.map((goal) => goal.id));

// Id dos objetivos baseado no seu index no learning plan
const ids = computed(() => {
  const goals = learningPlanStore.learningPlan?.learning_goals;

  if (!goals) {
    return {};
  }

  const idsIndex = {};
  let index = 1;

  goals.forEach((goal) => {
    idsIndex[goal.id] = index++;
  });

  return idsIndex;
});

function resetTextField() {
  searchedGoals.value = [];
  search.value = '';
}

function addGoal(goal: LearningPlanGoalSimple) {
  const selectedGoalsId = selectedGoals.value.map((goal) => goal.id);

  if (!selectedGoalsId.includes(goal.id)) {
    const selected = [...selectedGoals.value, goal];
    selectedGoals.value = selected.sort(
      (a, b) => ids.value[a.id] - ids.value[b.id],
    );
  }

  open.value = false;
}

function removeGoal(goal: LearningPlanGoalSimple) {
  selectedGoals.value = selectedGoals.value.filter(
    (selectedGoal) => selectedGoal.id !== goal.id,
  );
}

function queryGoals() {
  const isNumber = !isNaN(Number(search.value));

  const unfilteredGoals =
    learningPlanStore.learningPlan?.learning_goals.map((goal) => goal) || [];

  const goals: LearningPlanGoalSimple[] = unfilteredGoals.filter((goal) => {
    if (selectedIds.value.includes(goal.id)) {
      return false;
    }

    const verb: string = goal.verb?.text.toLowerCase() || '';
    const description: string = goal.description.toLowerCase();

    const targetText: string = `${verb}${verb ? ' ' : ''}${description}`;

    return (
      targetText.includes(search.value.toLowerCase().trim()) ||
      (isNumber && goal.id === parseInt(search.value))
    );
  });

  searchedGoals.value = goals;
}

useOnStopTyping(search, queryGoals);

watch(open, () => {
  if (!open.value) {
    resetTextField();
  }
});
</script>

<style>
.alex-search-goals .v-input__details {
  display: none !important;
}
</style>
