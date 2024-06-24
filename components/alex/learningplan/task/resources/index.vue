<template>
  <alex-custom-dialog
    v-model="open"
    class="alex-trails-modal"
    body-classes="pa-0"
    :title="$t('components.learningPlan.drawer.task.learningResources.label')"
    :no-footer="hideFooter"
    :max-width="selectedTrail ? 1080 : 769"
    main-button-text="Selecionar Recursos"
    :loading="isLoading"
    :disabled="!props.edit"
    @on-secondary-action="open = false"
    @on-main-action="selectMode ? updateBlocks('ADD') : handleNewTrail()"
  >
    <!-- Activate -->
    <template #activator="{ props }">
      <p class="text-h3 mb-4">
        {{ $t('components.learningPlan.drawer.task.learningResources.label') }}
      </p>
      <v-scroll-x-transition leave-absolute>
        <alex-learningplan-task-resources-card
          v-if="trail && blocks"
          :title="trail?.title"
          :cover="trail?.cover_image?.url"
          :delete-button="true"
          @delete="updateBlocks('REMOVE')"
          @open-trail="
            () => {
              selectedTrail = trail;
              selectMode = true;
              open = true;
            }
          "
        />
        <alex-custom-button
          v-else
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
          @click="
            () => {
              selectedTrail = undefined;
              selectMode = true;
              activePage = 1;
            }
          "
        />
      </v-scroll-x-transition>
    </template>
    <!-- Content -->
    <div
      v-if="!selectedTrail"
      class="pa-6 bg-white"
      :class="{ 'rounded-b-lg': paginationLength <= 1 }"
    >
      <div class="d-flex align-center mb-4">
        <p class="flex-1-1 text-h5 text-gray-800 lines-1 ellipsis">
          {{
            $t('components.learningPlan.drawer.task.learningResources.select')
          }}
        </p>

        <alex-custom-button
          variant="secondary"
          append-icon="mdi-plus"
          @click="createTrailDialog = true"
          >{{
            $t('components.learningPlan.drawer.task.learningResources.new')
          }}</alex-custom-button
        >
      </div>

      <div v-if="trails.length" class="d-flex ga-4 flex-wrap">
        <alex-learningplan-task-resources-card
          v-for="trailItem in trailsView"
          :key="trailItem.id"
          :title="trailItem.title"
          :cover="trailItem.cover_image?.url"
          @click="handleTrailClick(trailItem)"
        />
      </div>
      <alex-learningplan-task-resources-empty v-else-if="!trails.length" />
    </div>

    <alex-learningplan-task-resources-selected-blocks
      v-else-if="selectedTrail"
      ref="editor"
      :selected-trail="selectedTrail"
      :blocks="blocks"
      :select-mode="selectMode"
    />

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
  <alex-learningplan-trails-dialogs-create
    :model-value="createTrailDialog"
    :learning-structure="learningStructure"
    @course-created="handleCreatedTrail"
    @update:model-value="(e) => (createTrailDialog = e)"
  />
</template>

<script setup lang="ts">
const { update, create } = useStrapi();
const { findOne } = useStrapiUtils();
const learningPlanStore = useLearningPlanStore();
const taskStore = useTaskStore();
const isLoading = ref(false);
const { setMessage } = useMessageStore();
const { t } = useI18n();
const paginationBlock: number = 12;
const createTrailDialog = ref(false);
const selectMode = ref(true);
const open = defineModel<boolean>({ required: true });

interface propsType {
  taskId: number;
  trailId?: number;
  blocks?: BlockSimple[] | number[];
  edit?: boolean;
}

const props = withDefaults(defineProps<propsType>(), {
  taskId: -1,
  trailId: undefined,
  blocks: undefined,
  edit: false,
});

const learningStructure = computed(() => {
  return (
    learningPlanStore.learningPlan?.learning_structures.find(
      (structure) => structure.type === 'standard',
    )?.id || 0
  );
});

const hideFooter = computed(() => {
  if (selectedTrail.value) {
    return false;
  }
  return paginationLength.value <= 1;
});

const handleCreatedTrail = async (id) => {
  const newTrail = await findOne('trails', id, {
    populate: ['cover_image', 'structures.blocks'],
  });
  const trail: TrailSimple = newTrail.data as TrailSimple;
  learningPlanStore.standardTrails.unshift({
    ...trail,
  });
  selectedTrail.value = trail;
  selectMode.value = false;
  createTrailDialog.value = false;
};

const editor = ref();
const activePage = ref<number>(1);
const structures = ref<LearningPlanStructureSimple[]>([]);

structures.value = learningPlanStore.learningPlan?.learning_structures || [];

const trail = computed(() =>
  trails.value.find((trail) => trail.id === props.trailId),
);

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

const isValidTrail = (trail: TrailSimple) => {
  if (!trail.structures.length) return false;
  if (!trail.structures[trail.structures.length - 1].blocks.length)
    return false;
  return true;
};

const handleTrailClick = (trail: TrailSimple) => {
  if (isValidTrail(trail)) {
    selectedTrail.value = trail;
  } else {
    setMessage(
      'Esta trilha não possui nenhum conteúdo. Selecione outra trilha ou adicione conteúdo a esta trilha.',
      'warning',
      true,
      false,
      true,
    );
  }
};

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

const updateBlocks = async (
  type: 'ADD' | 'REMOVE',
  selectedBlocks?: number[],
) => {
  try {
    isLoading.value = true;
    const blocks = selectedBlocks || editor.value?.getSelectedBlocks() || [];
    if ((!blocks.length || props.taskId === -1) && type === 'ADD') return;
    await updateTask(blocks, type);
    taskStore.task?.id === props.taskId
      ? updateTaskStore(blocks, type)
      : updateLearningplanStore(blocks, type);
  } catch (e) {
    setMessage(
      t('components.learningPlan.drawer.task.learningResources.updateError'),
      'red',
      true,
    );
  } finally {
    isLoading.value = false;
    open.value = false;
  }
};

const updateTask = async (blocks: BlockSimple[], type: 'ADD' | 'REMOVE') => {
  await update('tasks', props.taskId, {
    blocks: type === 'ADD' ? blocks : [],
    trail: type === 'ADD' ? selectedTrail.value?.id : null,
  });
};

const updateLearningplanStore = (
  blocks: BlockSimple[],
  type: 'ADD' | 'REMOVE',
) => {
  if (learningPlanStore.learningPlan?.tasks) {
    const taskIndex = learningPlanStore.learningPlan?.tasks.findIndex(
      (task) => task.id === props.taskId,
    );
    const taskToUpdate = learningPlanStore.learningPlan.tasks[taskIndex];
    if (taskIndex !== -1) {
      const updatedTask = {
        ...taskToUpdate,
        blocks: type === 'ADD' ? blocks : [],
        trail: type === 'ADD' ? selectedTrail.value : null,
      };
      learningPlanStore.learningPlan.tasks[taskIndex] = updatedTask;
      learningPlanStore.learningPlan = {
        ...learningPlanStore.learningPlan,
        tasks: [...learningPlanStore.learningPlan.tasks],
      };
    }
  }
};

const updateTaskStore = (blocks: BlockSimple[], type: 'ADD' | 'REMOVE') => {
  if (taskStore.task?.id === props.taskId && selectedTrail.value) {
    taskStore.task.blocks = type === 'ADD' ? blocks : [];
    taskStore.task.trail = type === 'ADD' ? selectedTrail.value : undefined;
  }
};

const handleNewTrail = async () => {
  isLoading.value = true;
  try {
    const res = await editor.value.handleNewTrail();
    if (!res.success || !selectedTrail.value) {
      setMessage(t('pages.trailId.overview.saveError'), 'error', true);
      return;
    }

    const structureData = await create<StructureSimple>('structures', {
      trail: selectedTrail.value,
      time: Date.now(),
      version: res.data.version,
      blocks: res.data.blocks,
    });

    const StructureBlocks = await findOne<StructureSimple>(
      'structures',
      structureData.data.id,
      {
        populate: ['blocks'],
      },
    );
    const localTrail =
      learningPlanStore.learningPlan?.learning_structures[0].trails.find(
        (trail) => trail.id === selectedTrail.value?.id,
      );
    localTrail?.structures.push({
      id: StructureBlocks.data.id,
      time: Date.now(),
      version: StructureBlocks.data.version,
      blocks: StructureBlocks.data.blocks,
      trail: localTrail,
    });
    const blocksId = StructureBlocks.data.blocks.map((block) => block.id);
    updateBlocks('ADD', blocksId);
  } catch (e) {
    setMessage(t('pages.trailId.overview.saveError'), 'warning', true);
  } finally {
    isLoading.value = true;
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
