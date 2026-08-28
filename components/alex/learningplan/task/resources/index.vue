<template>
  <alex-custom-dialog
    v-model="open"
    persistent
    class="alex-trails-modal"
    body-classes="pa-0"
    :title="$t('components.learningPlan.drawer.task.learningResources.label')"
    :no-footer="hideFooter"
    :max-width="selectedTrail ? 1080 : 769"
    main-button-text="Selecionar Recursos"
    :loading="isLoading"
    :disabled="!props.edit"
    @on-secondary-action="open = false"
    @on-main-action="editMode ? updateBlocks('ADD') : handleNewTrail()"
  >
    <!-- Activate -->
    <template #activator="{ props: propsActivator }">
      <p class="text-h3 mb-4">
        {{ $t('components.learningPlan.drawer.task.learningResources.label') }}
      </p>
      <v-scroll-x-transition leave-absolute>
        <alex-learningplan-task-resources-card
          v-if="trail && blocks"
          :title="trail?.title"
          :cover="trail?.cover_image?.url"
          :delete-button="editMode"
          :edit="editMode"
          @delete="updateBlocks('REMOVE')"
          @open-trail="
            () => {
              selectedTrail = trail;
              open = true;
            }
          "
        />
        <alex-custom-button
          v-else
          v-bind="propsActivator"
          size="large"
          prepend-icon="alex:trail"
          append-icon="mdi-chevron-right"
          :text="$t('components.learningPlan.drawer.task.learningResources.noneSelected')"
          variant="secondary"
          @click="
            () => {
              selectedTrail = undefined;
              editMode = true;
              activePage = 1;
            }
          "
        />
      </v-scroll-x-transition>
    </template>
    <!-- Content -->
    <div v-if="!selectedTrail" class="pa-6 bg-white" :class="{ 'rounded-b-lg': paginationLength <= 1 }">
      <div class="d-flex align-center mb-4">
        <p class="flex-1-1 text-h5 text-gray-800 lines-1 ellipsis">
          {{ $t('components.learningPlan.drawer.task.learningResources.select') }}
        </p>

        <alex-custom-button variant="secondary" append-icon="mdi-plus" @click="createTrailDialog = true">{{
          $t('components.learningPlan.drawer.task.learningResources.new')
        }}</alex-custom-button>
      </div>

      <div v-if="trails.length" class="d-flex ga-4 flex-wrap">
        <alex-learningplan-task-resources-card
          v-for="trailItem in trailsView"
          :key="trailItem.id"
          :title="trailItem.title"
          :cover="trailItem.cover_image?.url"
          :edit="editMode"
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
      :edit-mode="editMode"
    />
    <template v-if="paginationLength > 1 && !selectedTrail" #footer
      ><div class="border-top-gray-100 rounded-b-lg bg-white">
        <alex-custom-pagination v-model="activePage" class="py-6" :length="paginationLength" :total-visible="4" /></div
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
const user = useStrapiUser();
const learningPlanStore = useLearningPlanStore();
const taskStore = useTaskStore();
const isLoading = ref(false);
const { setMessage } = useMessageStore();
const { t } = useI18n();
const paginationBlock: number = 12;
const createTrailDialog = ref(false);
const open = defineModel<boolean>({ required: true });

interface propsType {
  taskId: number;
  trailId?: number;
  blocks?: BlockSimple[] | number[];
  edit?: boolean;
  teacher?: boolean;
  project?: boolean;
}

const props = withDefaults(defineProps<propsType>(), {
  taskId: -1,
  trailId: undefined,
  blocks: undefined,
  edit: false,
  teacher: false,
  project: false,
});

const editMode = ref(props.edit);

const learningStructure = computed(() => {
  if (props.project) {
    return (
      learningPlanStore.learningPlan?.learning_structures?.find(
        (structure) => structure.type === 'standard' && structure.author_member?.user?.id === user.value?.id,
      )?.id ?? null
    );
  }

  return (
    learningPlanStore.learningPlan?.learning_structures.find((structure) => structure.type === 'standard')?.id || 0
  );
});

const hideFooter = computed(() => {
  if (selectedTrail.value) {
    return !props.teacher;
  }

  return paginationLength.value <= 1;
});

const handleCreatedTrail = async (id, newStructure) => {
  const newTrail = await findOne('trails', id, {
    populate: ['cover_image', 'structures.blocks'],
  });

  const trail: TrailSimple = newTrail.data as TrailSimple;
  learningPlanStore.standardTrails.unshift({
    ...trail,
  });

  // Adiciona a nova trilha à lista de learningStructures para ser listada em trails
  if (learningStructure.value && learningPlanStore.learningPlan) {
    learningPlanStore.learningPlan.learning_structures =
      learningPlanStore.learningPlan?.learning_structures?.map((structure) => {
        if (structure.id === learningStructure.value) {
          structure.trails = [...structure.trails, { ...trail }];
        }

        return structure;
      }) ?? [];

    structures.value = learningPlanStore.learningPlan.learning_structures;
  }

  selectedTrail.value = trail;
  editMode.value = false;
  createTrailDialog.value = false;

  if (newStructure && learningPlanStore.learningPlan) {
    learningPlanStore.learningPlan.learning_structures = [...structures.value, newStructure];
    structures.value = [...structures.value, newStructure];
  }
};

const editor = ref();
const activePage = ref<number>(1);
const structures = ref<LearningPlanStructureSimple[]>(learningPlanStore.learningPlan?.learning_structures || []);

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

watch(
  () => props.taskId,
  (id) => {
    if (![0, -1].includes(id) && learningPlanStore.learningPlan) {
      taskStore.loadTaskData(id, learningPlanStore.learningPlan.id);
    } else {
      taskStore.task = undefined;
    }
  },
);

const trail = computed(() => {
  return trails.value?.find((trail) => trail.id === taskStore.task?.trail?.id);
});

const handleTrailClick = (trail: TrailSimple) => {
  loadTrail(trail.id);
};

const loadTrail = async (trailId: number) => {
  try {
    isLoading.value = true;
    const response = await findOne<TrailSimple>('trails', trailId, {
      populate: {
        cover_image: true,
        structures: {
          populate: ['blocks'],
        },
      },
    });
    selectedTrail.value = response.data;
  } catch (error) {
    console.error('[TaskResources] trail loading failed', { trailId, error });
    setMessage(t('components.learningPlan.drawer.task.learningResources.updateError'), 'red', true);
  } finally {
    isLoading.value = false;
  }
};

const selectedTrail = ref<TrailSimple | undefined>();

const trailsView = computed(() => {
  const length = trails.value.length;

  const start = (activePage.value - 1) * paginationBlock;
  const end = start + paginationBlock > length ? length : start + paginationBlock;

  return trails.value.slice(start, end);
});

const paginationLength = computed(() => {
  if (!trails?.value.length) {
    return 0;
  }

  const length: number = trails.value.length;

  return Math.floor(length / paginationBlock) + (length % paginationBlock ? 1 : 0);
});

const updateBlocks = async (type: 'ADD' | 'REMOVE', selectedBlocks?: number[]) => {
  try {
    isLoading.value = true;
    const blocks = selectedBlocks || editor.value?.getSelectedBlocks() || [];
    if (props.blocks) {
      blocks.push(...(props.blocks as number[]));
    }
    if (props.taskId === -1 && type === 'ADD') return;
    await updateTask(blocks, type);
    taskStore.task?.id === props.taskId ? updateTaskStore(blocks, type) : updateLearningplanStore(blocks, type);
  } catch (error) {
    console.error('[TaskResources] updateBlocks failed', { error });
    setMessage(t('components.learningPlan.drawer.task.learningResources.updateError'), 'red', true);
  } finally {
    isLoading.value = false;
    open.value = false;
  }
};

const updateTask = async (blocks: BlockSimple[], type: 'ADD' | 'REMOVE') => {
  const payload: { trail: number | null; blocks?: BlockSimple[] | number[] } = {
    trail: type === 'ADD' ? selectedTrail.value?.id || null : null,
  };
  if (type === 'REMOVE' || blocks.length) payload.blocks = type === 'ADD' ? blocks : [];
  await update('tasks', props.taskId, payload);

  if (taskStore.task) {
    taskStore.task.trail = type === 'ADD' ? selectedTrail.value : undefined;
  }
  // if (taskStore.task && learningPlanStore.learningPlan) {
  //   taskStore.loadTaskData(taskStore.task.id, learningPlanStore.learningPlan.id);
  //   learningPlanStore.loadLearningPlan(learningPlanStore.learningPlan.id);
  // }
  // if (learningPlanStore.learningPlan) {
  //   learningPlanStore.loadLearningPlan(learningPlanStore.learningPlan.id);
  // }
};

const updateLearningplanStore = (blocks: BlockSimple[], type: 'ADD' | 'REMOVE') => {
  if (learningPlanStore.learningPlan?.tasks) {
    const taskIndex = learningPlanStore.learningPlan?.tasks.findIndex((task) => task.id === props.taskId);
    const taskToUpdate = learningPlanStore.learningPlan.tasks[taskIndex];
    if (taskIndex !== -1) {
      const updatedTask = {
        ...taskToUpdate,
        blocks: type === 'ADD' ? blocks : [],
        trail: type === 'ADD' ? selectedTrail.value : undefined,
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
  // if (![-1, 0].includes(props.taskId) && learningPlanStore.learningPlan) {
  //   learningPlanStore.loadLearningPlan(learningPlanStore.learningPlan.id);
  //   taskStore.loadTaskData(props.taskId, learningPlanStore.learningPlan.id);
  // }
};

const handleNewTrail = async () => {
  isLoading.value = true;
  try {
    const res = await editor.value.handleNewTrail();
    if (!res.success || !selectedTrail.value) {
      setMessage(t('pages.trailId.overview.saveError'), 'error', true);
      return;
    }

    await create<StructureSimple>('structures', {
      trail: selectedTrail.value,
      time: Date.now(),
      version: res.data.version,
      blocks: res.data.blocks,
    });

    updateBlocks('ADD');
  } catch (e) {
    setMessage(t('pages.trailId.overview.saveError'), 'warning', true);
  } finally {
    isLoading.value = true;
  }
};

watch(
  () => learningPlanStore.loading,
  () => {
    if (!learningPlanStore.loading) {
      structures.value = learningPlanStore.learningPlan?.learning_structures || [];
    }
  },
);

watch(trail, (trail) => {
  if (trail && props.edit) {
    editMode.value = true;
  }
});
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
