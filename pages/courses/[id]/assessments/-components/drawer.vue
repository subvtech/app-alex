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
      <div class="d-flex align-center justify-end">
        <alex-custom-button icon="mdi-close" size="small" variant="text" @click="() => (model = false)" />
      </div>
    </template>

    <alex-inputs-editable-text
      v-model="name"
      tag="h1"
      class="mt-4 text-h2 ellipsis lines-2"
      :cant-edit="true"
      :placeholder="'(' + $t('components.learningPlan.drawer.missing.title') + ')'"
    ></alex-inputs-editable-text>

    <h3 class="text-gray-800 text-h3 my-4">{{ $t(`${i18Dir}.associatedTasks`) }}</h3>
    <div class="mt-4 mb-6 d-flex gap-4 flex-wrap">
      <div v-for="task in selectedTasks" :key="task.id" class="rounded-lg tw-border tw-w-[260px] tw-h-[120px] pa-4">
        <p class="d-flex justify-center">
          <span class="text-body-4 text-gray-800 tw-w-[198px] ellipsis lines-2">{{ task.title }}</span>
          <span class="text-body-2 text-secondary-0">#{{ task.id }}</span>
        </p>
        <div class="mt-4 d-flex align-center">
          <v-icon
            class="mr-2 tw-border rounded-lg tw-border-gray-200"
            size="16"
            style="height: 28px; width: 28px; padding: 6px"
            >mdi-format-list-bulleted</v-icon
          >
          <span>
            <p class="text-gray-800 text-body-4">{{ $t(`${i18Dir}.${task.type}`) }}</p>
            <p class="text-gray-600 text-body-3">{{ task.methodName }}</p>
          </span>
        </div>
      </div>
      <div
        class="rounded-lg tw-border-2 tw-border-dashed tw-w-[260px] tw-h-[120px] d-flex justify-center align-center cursor-pointer"
        @click="() => (dialog = true)"
      >
        <span class="text-body-3 text-black">
          <v-icon class="mr-2">mdi-plus</v-icon>
          {{ $t(`${i18Dir}.addTask`) }}
        </span>
      </div>
    </div>
    <h3 class="text-gray-800 text-h3 mt-6">{{ $t(`${i18Dir}.composition`) }}</h3>
    <p class="text-gray-600 text-body-1 my-4">
      {{ $t(`${i18Dir}.compositionDescription`) }}
    </p>
    <div class="w-100 tw-min-h-[250px] bg-gray-blue rounded-lg d-flex justify-center align-center tw-flex-col gap-4">
      <div v-if="!selectedTasks.length">
        <img src="/svg/emptyComposition.svg" class="mx-auto mb-4" />
        <p class="text-gray-400 text-body-3">{{ $t(`${i18Dir}.noTasksAdded`) }}</p>
      </div>
      <div v-else>
        <div class="d-flex flex-wrap pa-6 tw-justify-center">
          <div v-for="(task, index) in selectedTasks" :key="task.id" class="d-flex align-center mb-6">
            <div class="bg-white rounded-lg d-flex justify-center align-center gap-4 pa-4">
              <span class="text-secondary-0 text-body-2"> #{{ task.id }}</span>
              <span class="text-body-3 text-gray-500">X</span>
              <span
                class="text-body-3 text-gray-600 d-flex tw-border rounded-lg tw-h-[26px] d-flex align-center justify-center gap-1 tw-w-[70px]"
                style="border-color: #a0a8b1"
              >
                <alex-custom-button
                  icon="mdi-chevron-down"
                  size="20"
                  color="gray-600"
                  variant="text"
                  @click="updateTaskWeight(task, 'down')"
                />
                <span>{{ task.value }}</span>
                <alex-custom-button
                  icon="mdi-chevron-up"
                  size="20"
                  color="gray-600"
                  variant="text"
                  @click="updateTaskWeight(task, 'up')"
                />
              </span>
            </div>
            <v-icon v-if="index < selectedTasks.length - 1" size="20" color="gray-800" icon="mdi-plus" class="ma-1" />
          </div>
          <div class="bg-gray-200 w-100 tw-h-[2px]" :thickness="2" />
          <div class="tw-h-14 tw-w-14 bg-white rounded-lg mx-auto d-flex justify-center align-center my-6">
            {{ totalWeight }}
          </div>
        </div>
      </div>
    </div>
    <Dialog v-model="dialog" :available="assessmentAvailableTasks" @on-associate-tasks="onAssociateTasks" />
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import Dialog from './taskPicker.vue';
type taskType = {
  id: number;
  title: string;
  type?: 'rubric' | 'criteria' | 'group';
  methodName?: string;
  value?: number;
  isGroup?: boolean;
  compositionId?: number;
};

type assessmentType = {
  id: number;
  name: string;
  compositionId: number;
  tasks: taskType[];
};

const i18Dir = 'pages.assessments';

const props = defineProps<{
  availableTasks: taskType[];
  assessments: assessmentType[];
}>();

const assessmentAvailableTasks = computed(() => {
  const tasksIds = selectedTasks.value.map((t) => t.id);
  return (props.availableTasks || []).filter((t) => !tasksIds.includes(t.id));
});

const model = defineModel({ default: false });
const selectedAssessmentId = ref<number>();
const assessment = computed(() => (props.assessments || []).find((a) => a.id === selectedAssessmentId.value));
const name = ref('');
const selectedTasks = computed<taskType[]>(() => assessment.value?.tasks || []);
const dialog = ref(false);

const learningPlanStore = useLearningPlanStore();
const learningPlanId = computed(() => learningPlanStore.learningPlan?.id);

const { addTaskToGradeCompositionMutation, updateGradeTitleMutation, updateTaskCompositionWeight } = useTaskEvaluation(
  learningPlanId,
  null,
  null,
);

const openDrawer = (assessment?: assessmentType) => {
  model.value = true;
  selectedAssessmentId.value = assessment?.id;
  name.value = assessment?.name || '';
};

defineExpose({ openDrawer });

const totalWeight = computed(() =>
  selectedTasks.value.reduce((total, currentTask) => total + (currentTask?.value || 1), 0),
);

const updateTaskWeight = async (task: taskType, update: 'up' | 'down') => {
  let weight = task.value || 1;

  if (update === 'up' && weight < 9) {
    weight += 1;
  } else if (update === 'down' && weight > 1) {
    weight -= 1;
  }

  await updateTaskComposition({ taskCompositionId: task.compositionId, weight });
};

const { mutateAsync: addTaskToGradeComposition } = addTaskToGradeCompositionMutation();
const { mutateAsync: updateGradeTitle } = updateGradeTitleMutation();
const { mutateAsync: updateTaskComposition } = updateTaskCompositionWeight();

const onAssociateTasks = async (tasksIds) => {
  await addTaskToGradeComposition({ tasksIds, gradeCompositionId: assessment.value?.compositionId });
  dialog.value = false;
};

useOnStopTyping(
  name,
  async () => await updateGradeTitle({ id: selectedAssessmentId.value, title: name.value }),
  600,
  false,
  false,
);
</script>
