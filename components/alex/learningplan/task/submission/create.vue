<template>
  <alex-custom-dialog
    v-if="!taskSubmissionEvaluationData || (!taskSubmissionEvaluationData.evaluated_at && memberType === 'student')"
    v-model="dialog"
    :persistent="true"
    :max-width="1080"
    :retain-focus="false"
    no-click-animation
    no-footer
  >
    <template #header>
      <alex-custom-dialog-header :title="title" @on-close="dialog = false">
        <template #default>
          <div class="ml-auto">
            <alex-learningplan-task-date-chip :date="deadline" :is-published="true" />
          </div>
        </template>
      </alex-custom-dialog-header>
    </template>
    <div class="mx-auto my-6 px-sm-6 px-md-0 w-100 editor tw-max-w-full">
      <tip-tap
        v-model="editorContent"
        :doc-name="docName"
        :edit="!isReadOnly"
        :collaboration="!!docName"
        :allowed-blocks="props.restrictions ? props.restrictions : []"
        :show-loader="true"
      />
    </div>
  </alex-custom-dialog>
  <alex-custom-dialog
    v-else
    v-model="dialog"
    :persistent="true"
    :retain-focus="false"
    :no-footer="taskSubmissionEvaluationData.evaluated_at"
    body-classes="bg-white pa-0"
    main-button-text="Avaliar"
    secondary-button-text="Recusar entrega"
    :max-width="1680"
    :fullscreen="fullscreen"
    no-click-animation
    @on-main-action="finishEvaluation"
  >
    <template #header>
      <alex-custom-dialog-header
        :title="title"
        :maximizable="true"
        :is-fullscreen="fullscreen"
        @on-close="dialog = false"
        @toggle-fullscreen="toggleMaximize"
      >
        <template #default>
          <div class="ml-auto">
            <alex-learningplan-task-date-chip :date="deadline" :is-published="true" />
          </div>
        </template>
      </alex-custom-dialog-header>
    </template>
    <div v-if="student || group" class="w-full tw-border-b pa-6 d-flex">
      <v-avatar v-if="student" :size="40" :image="student?.avatar || ''" color="gray-100" class="mr-4">
        <template v-if="!student?.avatar" #default>
          <p class="text-gray-300 text-body-3">
            {{ student?.name?.split(' ')[0][0] }}{{ student?.name?.split(' ')[1]?.[0] || '' }}
          </p>
        </template>
      </v-avatar>
      <div v-else class="mr-4 bg-secondary-0 pa-2 rounded-pill tw-w-[40px] tw-h-[40px]">
        <v-icon size="24" color="white"> mdi-account-group </v-icon>
      </div>
      <div>
        <p class="text-gray-700 text-body-2">{{ student?.name || group?.title }}</p>
        <p class="text-body-3 text-gray-500">{{ student?.email || studentsFirstName }}</p>
      </div>
      <alex-custom-chip v-if="studentClass" :text="studentClass" class="ml-auto" size="small" status="blue" />
    </div>
    <alex-custom-tabs
      v-model="tab"
      class="tw-border-b px-6 pb-[2px]"
      :tabs="[
        {
          label: 'Conteúdo',
          value: 'content',
        },
        {
          label: 'Avaliação',
          value: 'evaluation',
        },
      ]"
    />
    <div
      class="w-full d-flex tw-flex-col-reverse tw-items-center lg:tw-flex-row lg:tw-items-start tw-relative gap-6 pa-6"
    >
      <v-tabs-window v-model="tab" class="w-75">
        <v-tabs-window-item value="content" class="w-100">
          <div class="mx-auto px-sm-6 px-md-0 d-flex justify-center editor tw-max-w-full">
            <tip-tap
              v-model="editorContent"
              class=""
              :doc-name="docName"
              :edit="!isReadOnly"
              :collaboration="!!docName"
              :allowed-blocks="props.restrictions ? props.restrictions : []"
              :show-loader="true"
            />
          </div>
        </v-tabs-window-item>
        <v-tabs-window-item value="evaluation">
          <div class="mx-auto px-sm-6 px-md-0 w-100">
            <div class="d-flex flex-wrap">
              <h3 class="text-h3 text-gray-700 w-100">
                {{ taskSubmissionEvaluationData?.evaluation_group?.type === 'rubric' ? 'Rubrica' : 'Grupo' }}:
              </h3>
              <p class="text-gray-700 text-subtitle-2">
                {{ taskSubmissionEvaluationData?.evaluation_group?.name }}
              </p>
              <div class="tw-w-full flex-wrap gap-2 mt-4 tw-pb-[150px] sm:tw-pb-0">
                <div v-if="taskSubmissionEvaluationData?.evaluation_group?.type === 'standard'" class="d-flex gap-2">
                  <div
                    v-for="(evaluation_criteria, i) in taskSubmissionEvaluationData.criteria_evaluations"
                    :key="`criteria-evaluation-grade-${i}`"
                    class="tw-border rounded-lg pt-4 tw-w-full sm:tw-w-[300px] tw-max-h-[230px] tw-justify-between d-flex tw-flex-col"
                  >
                    <div class="px-4">
                      <h5 class="text-secondary-0 text-h5 ellipsis lines-1 mb-2">
                        {{ evaluation_criteria.criteria.criteria.name }}
                      </h5>
                      <p class="text-body-3 text-gray-600 ellipsis lines-6 tw-max-h-[115px] tw-h-full mb-2">
                        {{ evaluation_criteria.criteria.criteria.description }}
                      </p>
                    </div>
                    <div class="tw-border-t pa-2 text-center text-body-2">
                      <span v-if="taskSubmissionEvaluationData.evaluated_at" class="text-center text-gray-600">
                        Nota:
                        {{ evaluation_criteria.grade || 'Nao avaliado' }}</span
                      >
                      <v-number-input
                        v-else
                        :model-value="evaluation_criteria.grade || 0"
                        :name="`criteria-evaluation-grade-${evaluation_criteria.id}`"
                        class="w-full text-gray-600"
                        density="compact"
                        control-variant="split"
                        hide-details
                        variant="outlined"
                        base-color="transparent"
                        color="secondary-0"
                        :min="0"
                        :max="10"
                        :step="0.5"
                        @update:model-value="(grade) => onCriteriaGrading(grade, evaluation_criteria.id)"
                      />
                    </div>
                  </div>
                </div>

                <div v-else class="">
                  <alex-learningplan-evaluation-rubrics
                    class="tw-w-full !tw-min-h-full"
                    :readonly="taskSubmissionEvaluationData.evaluated_at"
                    :editable="false"
                    :data="rubricRows"
                    :headers="headers"
                    @cell-selected="(data) => onCriteriaGrading(data.grade, data.criterion.id, true)"
                  />
                </div>
              </div>
            </div>
          </div>
        </v-tabs-window-item>
      </v-tabs-window>
      <div
        class="d-flex gap-2 flex-wrap tw-w-[400px] tw-border pa-6 rounded-lg text-body-1 text-gray-800 tw-transition-all"
        :class="tab === 'evaluation' && 'tw-mt-[68px]'"
      >
        <h3 class="text-gray-800 text-h3 mb-4">Avaliação de Entrega</h3>
        <div class="w-100 d-flex justify-space-between">
          Tipo:
          <alex-custom-chip
            status="secondary"
            :text="taskSubmissionEvaluationData?.evaluation_group?.type === 'rubric' ? 'Rubrica' : 'Grupo de critérios'"
          />
        </div>
        <div class="w-100 d-flex justify-space-between align-center">
          {{ taskSubmissionEvaluationData?.evaluation_group?.type === 'rubric' ? 'Rubrica' : 'Grupo' }} :
          <alex-custom-chip status="secondary" :text="taskSubmissionEvaluationData?.evaluation_group?.name" />
        </div>
        <h5 class="text-gray-800 text-h5 mt-4">
          {{ taskSubmissionEvaluationData?.evaluation_group?.type === 'rubric' ? 'Analise da tarefa' : 'Critérios' }}
        </h5>
        <div
          v-for="(evaluation_criteria, i) in taskSubmissionEvaluationData.criteria_evaluations"
          :key="`criteria-${i}`"
          class="w-100 d-flex justify-space-between align-center"
        >
          <span>
            {{ evaluation_criteria.criteria.criteria.name }}
          </span>
          <span class="text-gray-600 text-body-3">
            <alex-custom-chip
              class="!tw-min-w-[48px]"
              text-classes="text-body-3 text-gray-600"
              :text="evaluation_criteria.grade !== null ? evaluation_criteria.grade.toString().padStart(2, '0') : '00'"
              variant="outlined"
              status="secondary"
            />
            x
            <alex-custom-chip
              text-classes="text-body-3 text-gray-600"
              :text="evaluation_criteria.criteria.weight"
              status="secondary"
            />
          </span>
        </div>
        <div class="d-flex justify-space-between align-center w-100 mt-4">
          <span class="text-gray-800 text-h5">Nota final: </span>
          <alex-custom-chip :text="`${finalGrade}/10`" status="secondary" text-classes="text-gray-600 text-body-2" />
        </div>
      </div>
    </div>
  </alex-custom-dialog>
</template>
<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query';
import lodash from 'lodash';
import type { EditorSubmission } from '~/models/simple/taskSubmissionSimples.model';
import type { Student } from '../drawer/Student.vue';
interface submissionProps {
  title: string;
  deadline: string;
  taskStatus: TaskMemberStatus;
  taskMemberId: number;
  restrictions?: string[];
  lastSubmission?: TaskSubmissionSimple;
  docName?: string;
  readOnly?: boolean;
  learningPlanId?: number;
  taskId?: number;
  memberType?: 'student' | 'professor';
  group?: LearningPlanGroupSimple;
  student?: Student;
  studentClass?: string;
}

type criterionType = {
  text: string;
  id: number;
};

type rubricRow = {
  criterion: criterionType;
  excellent: string;
  good: string;
  reasonable: string;
  bad: string;
  selected?: 'excellent' | 'good' | 'reasonable' | 'bad';
};

type CriteriaEvaluation = {
  id: number;
  grade: number | null;
  criteria: {
    id: number;
    weight: number;
    criteria: {
      id: number;
      name: string;
      description: string;
    };
  };
};

const props = withDefaults(defineProps<submissionProps>(), {
  title: '',
  deadline: undefined,
  restrictions: undefined,
  lastSubmission: undefined,
  readOnly: false,
  docName: undefined,
  learningPlanId: 0,
  taskId: 0,
  memberType: 'student',
  group: undefined,
  student: undefined,
  studentClass: '',
});

const isReadOnly = ref(props.readOnly);

type Emits = {
  'update-task-status': [status: TaskMemberStatus];
  'update-submission': [];
};

const studentsFirstName = computed(() => {
  return props.group?.group_members.map((m) => m.student_member.user.fullname.split(' ')[0]).join(', ');
});

const saveTime = 6; // Tempo em que a request vai ser repetida (em s)
let saveInterval;

const emit = defineEmits<Emits>();
const { t } = useI18n();
const { setMessage } = useMessageStore();
const dialog = ref(false);
const fullscreen = ref(false);
const prevEditorContent = ref('');
const editorContent = ref<any | undefined>(undefined);
const isLoading = ref(false);
const { create, update, findOne } = useStrapi();
const currentData = ref<EditorSubmission>();
const taskMemberId = toRef(props, 'taskMemberId');
const hasEditorChanges = ref(false);
const lastSaveDate = ref<Date | null>(null);
const saveCountDown = ref<number>(saveTime);
const submissionId = ref<number>(props.lastSubmission?.id || 0);
const tab = ref(null);

const user = useStrapiUser();
const taskId = toRef(props, 'taskId');
const learningPlanId = toRef(props, 'learningPlanId');

const { getTaskSubmissionEvaluation, gradeSubmissionEvaluationCriteriasMutation, setEvaluationDateMutation } =
  useTaskEvaluation(learningPlanId, taskId, user, submissionId);

const { data: taskSubmissionEvaluationData } = getTaskSubmissionEvaluation();
const { mutate: updateEvaluationGrades } = gradeSubmissionEvaluationCriteriasMutation();
const { mutate: setEvaluationDate } = setEvaluationDateMutation();

const rubricGradeLevels = computed(() => {
  return taskSubmissionEvaluationData.value.evaluation_group.rubric_grade_levels.map((l) => {
    return {
      ...l,
      grade_level_criterias: l.grade_level_criterias.map((c) => {
        return { id: c.criteria.id, justification: c.justification };
      }),
    };
  });
});

const headers = computed(() => {
  const headers = {
    excellent: '',
    good: '',
    reasonable: '',
    poor: '',
  };

  for (const gradeLevel of taskSubmissionEvaluationData.value?.evaluation_group.rubric_grade_levels) {
    switch (gradeLevel.grade) {
      case 10:
        headers.excellent = gradeLevel.title;
        break;
      case 7.5:
        headers.good = gradeLevel.title;
        break;
      case 5:
        headers.reasonable = gradeLevel.title;
        break;
      case 2.5:
        headers.poor = gradeLevel.title;
        break;
    }
  }
  return headers;
});

const gradeToRating = (grade: number | null): 'excellent' | 'good' | 'reasonable' | 'bad' | undefined => {
  switch (grade) {
    case 10:
      return 'excellent';
    case 7.5:
      return 'good';
    case 5:
      return 'reasonable';
    case 2.5:
      return 'bad';
    default:
      return undefined;
  }
};

const rubricRows = computed<rubricRow[]>(() => {
  const criteriaEvaluationsMap = new Map<number, CriteriaEvaluation>();
  for (const evaluation of taskSubmissionEvaluationData.value?.criteria_evaluations) {
    criteriaEvaluationsMap.set(evaluation.criteria.criteria.id, evaluation);
  }

  const rowsMap = new Map<number, rubricRow>();

  for (const gradeLevel of taskSubmissionEvaluationData.value?.evaluation_group.rubric_grade_levels) {
    for (const gradeCriteria of gradeLevel.grade_level_criterias) {
      const criteriaId = gradeCriteria.criteria.id;
      const evaluation = criteriaEvaluationsMap.get(criteriaId);

      if (evaluation) {
        if (!rowsMap.has(criteriaId)) {
          rowsMap.set(criteriaId, {
            criterion: { text: evaluation.criteria.criteria.name, id: criteriaId },
            excellent: '',
            good: '',
            reasonable: '',
            bad: '',
            selected: gradeToRating(evaluation.grade),
          });
        }

        const row = rowsMap.get(criteriaId);
        if (row) {
          switch (gradeLevel.grade) {
            case 10:
              row.excellent = gradeCriteria.justification;
              break;
            case 7.5:
              row.good = gradeCriteria.justification;
              break;
            case 5:
              row.reasonable = gradeCriteria.justification;
              break;
            case 2.5:
              row.bad = gradeCriteria.justification;
              break;
          }
        }
      }
    }
  }

  return Array.from(rowsMap.values());
});

const criteriaWithGradeLevels = computed(() => {
  return taskSubmissionEvaluationData.value.criteria_evaluations.map((ce) => {
    const gradeLevels = rubricGradeLevels.value.map((g) => {
      const criteriaId = ce.criteria.criteria.id;
      const { justification } = g.grade_level_criterias.find((glc) => glc.id === criteriaId);
      return { ...g, justification };
    });
    return { ...ce, gradeLevels };
  });
});

const queryClient = useQueryClient();

const onCriteriaGrading = (grade, criteriaId, isRubric?) => {
  const evaluationData = structuredClone(toRaw(taskSubmissionEvaluationData.value));

  const criteriaIdx = isRubric
    ? evaluationData.criteria_evaluations.findIndex((c) => c.criteria.criteria.id === criteriaId)
    : evaluationData.criteria_evaluations.findIndex((c) => c.id === criteriaId);

  evaluationData.criteria_evaluations[criteriaIdx].grade = grade;
  queryClient.setQueryData(['taskSumbmissionEvaluationData', submissionId], evaluationData);

  updateEvaluationGrades({
    evaluationId: evaluationData?.id,
    criteriaEvaluations: evaluationData?.criteria_evaluations,
    grade: finalGrade.value,
  });
};

const finalGrade = computed(() => {
  const totalWeight = taskSubmissionEvaluationData.value.criteria_evaluations.reduce(
    (total, c) => (c.criteria?.weight || 1) + total,
    0,
  );

  const grades = taskSubmissionEvaluationData.value.criteria_evaluations.map(
    (c) => (c.grade || 0) * (c.criteria?.weight || 0),
  );

  const totalGrade = grades?.reduce((total, grade) => total + grade, 0);

  const grade = totalGrade / totalWeight;
  return grade.toFixed(2);
});

watch(editorContent, (_, previous) => {
  prevEditorContent.value = previous;
});

const saveSubmissionLoop = async () => {
  if (saveCountDown.value) {
    saveCountDown.value = saveCountDown.value - 1;
    return;
  }

  await checkDataChanges();

  saveCountDown.value = saveTime;
};

const checkDataChanges = async () => {
  const taskSubmission = await findOne('task-submissions', {
    filters: {
      id: submissionId.value || 0,
    },
  });
  const submissionStatus = taskSubmission.data[0]?.attributes?.submitted_at;

  if (submissionStatus) {
    setMessage(t('components.courses.tasks.submission_modal.in_review'), 'blue', true, false, true);
    isReadOnly.value = true;
    clearInterval(saveInterval);
    emit('update-task-status', 'in_review');
    saveSubmission();
    return false;
  }

  const lastSubmission = taskSubmission.data && taskSubmission.data[0]?.attributes?.submission;

  if (!lastSubmission) {
    return editorContent.value !== undefined;
  }

  if (editorContent.value === undefined) {
    return false;
  }

  // Compare nested arrays
  if (lastSubmission.content.length !== editorContent.value?.content.length) {
    return true;
  }

  for (let i = 0; i < lastSubmission.content.length; i++) {
    if (!lodash.isEqual(lastSubmission.content[i].content, toRaw(editorContent.value?.content[i].content))) {
      return true;
    }
  }

  return false;
};

const openDialog = async () => {
  dialog.value = true;
  isLoading.value = true;
  currentData.value = props.lastSubmission?.submission || undefined;

  await executeSubmissions();

  if (!isReadOnly.value) {
    hasEditorChanges.value = await checkDataChanges();
    saveInterval = setInterval(async () => await saveSubmissionLoop(), 1000);
  } else {
    loadEditorData();
  }

  saveCountDown.value = saveTime;

  isLoading.value = false;
};
const saveContent = async () => {
  if (submissionId.value) {
    await update('task-submissions', submissionId.value, {
      submission: editorContent.value,
    });
    emit('update-submission');
  } else {
    const submission = await create('task-submissions', {
      task_member: props.taskMemberId,
      submission: editorContent.value,
    });
    submissionId.value = submission.data.id;
    emit('update-submission');
  }
  if (props.taskStatus === 'to_do') {
    await update('task-members', props.taskMemberId, {
      status: 'in_progress',
    });
    emit('update-task-status', 'in_progress');
  }

  hasEditorChanges.value = await checkDataChanges();
};

const { execute: executeSubmissions } = useTaskSubmission(taskMemberId);
const saveSubmission = async () => {
  isLoading.value = true;
  try {
    await saveContent();
    setMessage(t('components.courses.tasks.submission_modal.save_success'), 'success', true);
    executeSubmissions();
  } catch (error) {
    setMessage(t('components.courses.tasks.submission_modal.save_error'), 'error', true);
  } finally {
    isLoading.value = false;
  }
};

// Caso a tarefa esteja em avaliação ou enviada, pega o valor do banco
const loadEditorData = () => {
  editorContent.value = props.lastSubmission?.submission;
};

const toggleMaximize = () => {
  fullscreen.value = !fullscreen.value;
};

const finishEvaluation = () => {
  if (!taskSubmissionEvaluationData.value) return;
  setEvaluationDate(taskSubmissionEvaluationData.value.id);
  dialog.value = false;
};

watch(dialog, (value) => {
  if (!value) {
    lastSaveDate.value = null;
    clearInterval(saveInterval);

    if (!isReadOnly.value) {
      saveSubmission();
    }
  }
});

defineExpose({
  openDialog,
});
</script>

<style scoped>
.editor {
  width: 785px !important;
  position: relative;
  min-height: 400px;
}

.border-top-gray-100 {
  border-top: 1px solid rgb(var(--v-theme-gray-100)) !important;
}

:global(.v-input__control .v-field) {
  padding: 0 16px !important;
}
</style>
