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
            name="goals"
            class="alex-search-goals w-full mt-2"
            :placeholder="
              $t('components.learningPlan.drawer.task.goals.search')
            "
            append-inner-icon="mdi-magnify"
            density="compact"
          />

          <!-- Opções -->
          <div v-if="searchedGoals.length" class="d-flex flex-column ga-1 mt-2">
            <alex-learningplan-task-goals-card
              v-for="goal in searchedGoals"
              :id="goal.id"
              :key="goal.id"
              :verb="goal.verb?.text"
              :description="goal.description"
              @click="addGoal(goal)"
            />
          </div>
        </v-list>
      </v-menu>

      <!-- Objetivos selecionados -->
      <alex-custom-chip
        v-for="goal in selectedGoals"
        :key="goal.id"
        :text="`OA #${goal.id}`"
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
interface CompProps {
  edit?: boolean;
  availableGoals?: LearningPlanGoalSimple[];
}

const props = withDefaults(defineProps<CompProps>(), {
  availableGoals: () => [],
});

const open = ref<boolean>(false);

// Exibidos no drawer
const selectedGoals = defineModel<LearningPlanGoalSimple[]>({ default: [] });

function resetTextField() {
  searchedGoals.value = [];
  open.value = false;
  search.value = '';
}

function addGoal(goal: LearningPlanGoalSimple) {
  const selectedGoalsId = selectedGoals.value.map((goal) => goal.id);

  if (!selectedGoalsId.includes(goal.id)) {
    selectedGoals.value.push(goal);
  }

  resetTextField();
}

function removeGoal(goal: LearningPlanGoalSimple) {
  selectedGoals.value = selectedGoals.value.filter(
    (selectedGoal) => selectedGoal.id !== goal.id,
  );
}

const { find } = useStrapiUtils();

const search = ref<string>('');
const searchedGoals = ref<LearningPlanGoalSimple[]>([]);

useOnStopTyping(search, async () => {
  const goals = await find<LearningPlanGoalSimple>('learning-goals', {
    populate: ['verb'],
    filters: {
      $or: [
        { description: { $containsi: search.value.toLowerCase() } },
        { verb: { text: { $containsi: search.value.toLowerCase() } } },
      ],
    },
  });

  searchedGoals.value = goals.data;
});

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
