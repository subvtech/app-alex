<template>
  <alex-custom-dialog
    v-model="open"
    class="alex-trails-modal"
    :title="$t('components.learningPlan.drawer.task.learningResources.label')"
    :no-footer="paginationLength <= 1"
  >
    <!-- Activate -->
    <template #activator="{ props }">
      <div>
        <p class="text-h3 mb-4">
          {{
            $t('components.learningPlan.drawer.task.learningResources.label')
          }}
        </p>

        <alex-custom-button
          v-if="edit"
          v-bind="props"
          size="large"
          prepend-icon="alex:trail"
          append-icon="mdi-chevron-right"
          :text="
            $t(
              'components.learningPlan.drawer.task.learningResources.noneSelected',
            )
          "
          variant="secondary"
        />
        <alex-learningplan-task-resources-cards
          v-else
          :trails="trailsView"
          :loading="learningPlanStore.loading"
          justify="start"
        />
      </div>
    </template>

    <!-- Content -->
    <div>
      <div class="d-flex align-center mb-4">
        <p class="flex-1-1 text-h5 text-gray-800 lines-1 ellipsis">
          {{
            $t('components.learningPlan.drawer.task.learningResources.select')
          }}
        </p>

        <alex-custom-button variant="secondary" append-icon="mdi-plus">{{
          $t('components.learningPlan.drawer.task.learningResources.new')
        }}</alex-custom-button>
      </div>

      <alex-learningplan-task-resources-cards
        v-if="trails.length || learningPlanStore.loading"
        :trails="trailsView"
        :loading="learningPlanStore.loading"
        edit
      />

      <alex-learningplan-task-resources-empty v-else />
    </div>

    <template v-if="paginationLength > 1" #footer
      ><div class="border-top-gray-100 rounded-b-lg bg-white">
        <alex-custom-pagination
          v-model="activePage"
          class="py-6"
          :length="paginationLength"
          :total-visible="4"
        /></div
    ></template>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
const paginationBlock: number = 12;

const learningPlanStore = useLearningPlanStore();

interface CompProps {
  edit?: boolean;
}

withDefaults(defineProps<CompProps>(), {
  edit: false,
});

const open = defineModel<boolean>({ required: true });

const activePage = ref<number>(1);
const structures = ref<LearningPlanStructureSimple[]>([]);

structures.value = learningPlanStore.learningPlan?.learning_structures || [];

const trails = computed(() => {
  const trailsList: TrailSimple[] = [];

  // Percorre cada estrutura
  structures.value?.forEach((structure) => {
    // Percorre suas respectivas trilhas
    structure.trails.forEach((trail) => {
      trailsList.push(trail);
    });
  });

  return trailsList;
});

const trailsView = computed(() => {
  const length = trails.value.length;

  const start = (activePage.value - 1) * paginationBlock;
  const end =
    start + paginationBlock > length ? length : start + paginationBlock;

  return trails.value.slice(start, end);
});

const paginationLength = computed(() => {
  if (!trails?.value.length) {
    return 0;
  }

  const length: number = trails.value.length;

  return (
    Math.floor(length / paginationBlock) + (length % paginationBlock ? 1 : 0)
  );
});

watch(
  () => [learningPlanStore.loading],
  () => {
    if (!learningPlanStore.loading) {
      structures.value =
        learningPlanStore.learningPlan?.learning_structures || [];
    }
  },
);
</script>

<style>
.alex-trails-modal .v-container.v-locale--is-ltr {
  height: auto !important;
}
</style>

<style scoped>
.border-top-gray-100 {
  border-top: 1px solid rgb(var(--v-theme-gray-100)) !important;
}
</style>
