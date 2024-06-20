<template>
  <alex-custom-dialog
    v-model="open"
    class="alex-trails-modal"
    :title="$t('components.learningPlan.drawer.task.learningResources.label')"
    :no-footer="paginationLength <= 1 && !selectedTrail"
    :max-width="selectedTrail ? 1080 : 769"
    main-button-text="Selecionar Recursos"
    @on-secondary-action="open = false"
    @on-main-action="selectBlocks"
  >
    <!-- Activate -->
    <template #activator="{ props }">
      <p class="text-h3 mb-4">
        {{ $t('components.learningPlan.drawer.task.learningResources.label') }}
      </p>

      <alex-custom-button
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
        @click="selectedTrail = undefined"
      />
    </template>

    <!-- Content -->
    <v-scale-transition hide-on-leave>
      <div v-if="!selectedTrail">
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

        <div
          v-if="trails.length || learningPlanStore.loading"
          class="cards d-flex align-center flex-wrap ga-4"
        >
          <template v-if="trails.length && !selectedTrail">
            <alex-learningplan-task-resources-card
              v-for="trail in trailsView"
              :key="trail.id"
              :title="trail.title"
              :cover="trail.cover_image?.url"
              @click="
                () => {
                  selectedTrail = trail;
                  console.log(selectedTrail);
                }
              "
            />
          </template>
          <alex-learningplan-task-resources-loader v-else />
        </div>
        <alex-learningplan-task-resources-empty v-else />
      </div>
      <alex-learningplan-task-resources-editor
        v-else
        ref="editor"
        :selected-trail="selectedTrail"
      />
    </v-scale-transition>
    <template v-if="paginationLength > 1 && !selectedTrail" #footer
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
const { update } = useStrapi();
const learningPlanStore = useLearningPlanStore();
const taskStore = useTaskStore();
const paginationBlock: number = 12;
const open = defineModel<boolean>({ required: true });

const props = withDefaults(defineProps<{ taskId: number }>(), {
  taskId: -1,
});

const editor = ref();
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

const selectedTrail = ref<TrailSimple | undefined>();

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

const selectBlocks = async () => {
  const blocks = editor.value?.getSelectedBlocks();
  if (blocks && selectedTrail.value && props.taskId !== -1) {
    await update('tasks', props.taskId, {
      blocks,
      trail: selectedTrail.value.id,
    });
    // if (taskStore.task?.id === props.taskId) {
    //   taskStore.task.blocks = blocks;
    // } else {
    // }
  }
};

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
