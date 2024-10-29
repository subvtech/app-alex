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
    <div class="mx-auto editor my-6 px-sm-6 px-md-0 w-100">
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
    :max-width="1760"
    :retain-focus="false"
    body-classes="bg-white pa-0"
    main-button-text="Associar"
    secondary-button-text="Recusar entrega"
    no-click-animation
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
    <div class="w-full tw-border-b pa-6 d-flex">
      <!-- TODO: Passar as informações do estudante, se for um grupo remover o email e a foto de perfil -->
      <v-avatar
        :size="40"
        image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAmpNJ11PRen9vRjdesWmQdy1lW1UX49G8wg&s"
        color="gray-100"
        class="mr-4"
      >
        <template v-if="student?.avatar" #default>
          <p class="text-gray-300 text-body-3">EN</p>
        </template>
      </v-avatar>
      <div>
        <p class="text-gray-700 text-body-2">Robert Judson Feitoza Mello</p>
        <p class="text-body-3 text-gray-500">brenojac@email.com</p>
      </div>
      <alex-custom-chip text="Turma A" class="ml-auto" size="small" status="blue" />
    </div>
    <alex-custom-tabs
      v-model="tab"
      class="tw-border-b px-6 pb-[2px]"
      :tabs="[
        {
          label: 'Conteudo',
          value: 'content',
        },
        {
          label: 'Avaliação',
          value: 'evaluation',
        },
      ]"
    />
    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="content">
        <div class="mx-auto editor my-6 px-sm-6 px-md-0 w-100">
          <div class="d-flex justify-space-between">
            <div>
              <tip-tap
                v-model="editorContent"
                :doc-name="docName"
                :edit="!isReadOnly"
                :collaboration="!!docName"
                :allowed-blocks="props.restrictions ? props.restrictions : []"
                :show-loader="true"
              />
            </div>
            <div class="d-flex gap-2 flex-wrap tw-w-[400px] tw-border pa-6 rounded-lg text-body-1 text-gray-800">
              <h3 class="text-gray-800 text-h3 mb-4">Avaliação de Entrega</h3>
              <div class="w-100 d-flex justify-space-between">
                Tipo:
                <alex-custom-chip
                  status="secondary"
                  :text="
                    taskSubmissionEvaluationData?.evaluation_group?.type === 'rubric' ? 'Rubrica' : 'Grupo de critérios'
                  "
                />
              </div>
              <div class="w-100 d-flex justify-space-between align-center">
                {{ taskSubmissionEvaluationData?.evaluation_group?.type === 'rubric' ? 'Rubrica' : 'Grupo' }} :
                <alex-custom-chip status="secondary" :text="taskSubmissionEvaluationData?.evaluation_group?.name" />
              </div>
              <h5 class="text-gray-800 text-h5 mt-4">
                {{
                  taskSubmissionEvaluationData?.evaluation_group?.type === 'rubric' ? 'Analise da tarefa' : 'Critérios'
                }}
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
                    text-classes="text-body-3 text-gray-600"
                    :text="evaluation_criteria.grade || 0"
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
                <alex-custom-chip
                  :text="`${finalGrade}/10`"
                  status="secondary"
                  text-classes="text-gray-600 text-body-2"
                />
              </div>
            </div>
          </div>
        </div>
      </v-tabs-window-item>
      <v-tabs-window-item value="evaluation">
        <div class="mx-auto my-6 px-sm-6 px-md-0 w-100 d-flex flex-wrap">
          <div class="d-flex flex-wrap justify-space-between">
            <div class="d-flex flex-wrap">
              <div class="tw-w-full">
                {{ taskSubmissionEvaluationData?.evaluation_group?.type === 'rubric' ? 'Rubrica' : 'Grupo' }}
              </div>
              <div class="tw-w-full">
                {{ taskSubmissionEvaluationData?.evaluation_group?.name }}
              </div>
              <div class="tw-w-full d-flex flex-wrap">
                <template v-if="taskSubmissionEvaluationData?.evaluation_group?.type === 'standard'">
                  <div
                    v-for="(evaluation_criteria, i) in taskSubmissionEvaluationData.criteria_evaluations"
                    :key="`criteria-evaluation-grade-${i}`"
                    class="tw-w-full"
                  >
                    {{ evaluation_criteria.criteria.criteria.name }}:
                    <span v-if="taskSubmissionEvaluationData.evaluated_at">{{
                      evaluation_criteria.grade || 'Nao avaliado'
                    }}</span>
                    <alex-inputs-text-field
                      v-else
                      :model-value="evaluation_criteria.grade"
                      :name="`criteria-evaluation-grade-${evaluation_criteria.id}`"
                      type="number"
                      @update:model-value="(grade) => onCriteriaGrading(grade, evaluation_criteria.id)"
                    />
                  </div>
                </template>
                <div v-else>Componente de rubrica</div>
              </div>
            </div>
            <div class="d-flex flex-wrap tw-max-w-[400px] sm:tw-w-[400px] tw-border pa-3">
              <div class="tw-w-full">Criterios</div>
              <div
                v-for="(evaluation_criteria, i) in taskSubmissionEvaluationData.criteria_evaluations"
                :key="`criteria-evaluation-${i}`"
                class="tw-w-full"
              >
                {{ evaluation_criteria.criteria.criteria.name }}: {{ evaluation_criteria.grade || 'Nao avaliado' }} x
                {{ evaluation_criteria.criteria.weight }}
              </div>
              <div class="tw-w-full">Nota final: {{ finalGrade }}</div>
            </div>
          </div>
        </div>
      </v-tabs-window-item>
    </v-tabs-window>
  </alex-custom-dialog>
</template>
<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query';
import lodash from 'lodash';
import type { EditorSubmission } from '~/models/simple/taskSubmissionSimples.model';
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
}

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
});

const isReadOnly = ref(props.readOnly);

type Emits = {
  'update-task-status': [status: TaskMemberStatus];
  'update-submission': [];
};

const saveTime = 6; // Tempo em que a request vai ser repetida (em s)
let saveInterval;

const emit = defineEmits<Emits>();
const { t } = useI18n();
const { setMessage } = useMessageStore();
const dialog = ref(false);
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

const { getTaskSubmissionEvaluation, gradeSubmissionEvaluationCriteriasMutation } = useTaskEvaluation(
  learningPlanId,
  taskId,
  user,
  submissionId,
);

const { data: taskSubmissionEvaluationData } = getTaskSubmissionEvaluation();
const { mutate: updateEvaluationGrades } = gradeSubmissionEvaluationCriteriasMutation();

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

const onCriteriaGrading = (grade, criteriaId) => {
  const evaluationData = structuredClone(toRaw(taskSubmissionEvaluationData.value));

  const criteriaIdx = evaluationData.criteria_evaluations.findIndex((c) => c.id === criteriaId);

  let realGrade;

  if (Number.parseInt(grade) > 10) {
    realGrade = '10';
  } else if (Number.parseInt(grade) < 0) {
    realGrade = '0';
  } else {
    realGrade = grade;
  }

  evaluationData.criteria_evaluations[criteriaIdx].grade = realGrade;
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

  return totalGrade / totalWeight;
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
#editor,
.editor {
  max-width: 785px !important;
  position: relative;
  min-height: 400px;
}

.border-top-gray-100 {
  border-top: 1px solid rgb(var(--v-theme-gray-100)) !important;
}
</style>
