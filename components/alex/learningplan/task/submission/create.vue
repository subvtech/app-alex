<template>
  <alex-custom-dialog
    v-model="dialog"
    :persistent="true"
    :max-width="1080"
    :no-footer="isReadOnly"
    :retain-focus="false"
    no-click-animation
  >
    <template #header>
      <alex-custom-dialog-header :title="title" @on-close="dialog = false">
        <template #default>
          <div class="ml-auto">
            <alex-learningplan-task-date-chip
              :date="deadline"
              :is-published="true"
            />
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
      />
    </div>
    <template v-if="!isReadOnly" #footer>
      <v-container
        class="bg-white rounded-b-lg border-top-gray-100 d-flex justify-end ga-3 pa-6 align-center"
      >
        <p v-if="saveCountDown" class="text-body-4 text-gray-400">
          {{
            $t('components.learningPlan.drawer.savingIn', {
              seconds: saveTime - saveCountDown,
            })
          }}
        </p>
        <p v-else class="text-body-4 text-gray-400">
          {{ $t('components.learningPlan.drawer.saving') }}
        </p>

        <alex-custom-button
          size="large"
          variant="secondary"
          :text="t('components.courses.tasks.submission_modal.save_btn')"
          :loading="isLoading"
          :disabled="!hasEditorChanges"
          @click="saveSubmission"
        />
      </v-container>
    </template>
  </alex-custom-dialog>
</template>
<script setup lang="ts">
import lodash from 'lodash';
import { EditorSubmission } from '~/models/simple/taskSubmissionSimples.model';
interface submissionProps {
  title: string;
  deadline: string;
  taskStatus: TaskMemberStatus;
  taskMemberId: number;
  restrictions?: string[];
  lastSubmission?: TaskSubmissionSimple;
  docName?: string;
  readOnly?: boolean;
}

const props = withDefaults(defineProps<submissionProps>(), {
  title: '',
  deadline: undefined,
  restrictions: undefined,
  lastSubmission: undefined,
  readOnly: false,
  docName: undefined,
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

watch(editorContent, (_, previous) => {
  prevEditorContent.value = previous;
});

const saveSubmissionLoop = async () => {
  if (saveCountDown.value) {
    saveCountDown.value = saveCountDown.value - 1;
    return;
  }

  const changed = await checkDataChanges();

  if (changed) {
    hasEditorChanges.value = changed;
    saveContent();
  }

  saveCountDown.value = saveTime;
};

const checkDataChanges = async () => {
  const taskSubmission = await findOne('task-submissions', {
    filters: {
      id: props.lastSubmission?.id || 0,
    },
  });
  const submissionStatus = taskSubmission.data[0]?.attributes?.submitted_at;

  if (submissionStatus) {
    setMessage(
      t('components.courses.tasks.submission_modal.in_review'),
      'blue',
      true,
      false,
      true,
    );
    isReadOnly.value = true;
    clearInterval(saveInterval);
    return false;
  }

  const lastSubmission =
    taskSubmission.data && taskSubmission.data[0]?.attributes?.submission;

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
    if (
      !lodash.isEqual(
        lastSubmission.content[i].content,
        toRaw(editorContent.value?.content[i].content),
      )
    ) {
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
  if (props.lastSubmission?.id) {
    await update('task-submissions', props.lastSubmission.id, {
      submission: editorContent.value,
    });
    emit('update-submission');
  } else {
    await create('task-submissions', {
      task_member: props.taskMemberId,
      submission: editorContent.value,
    });
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
    setMessage(
      t('components.courses.tasks.submission_modal.save_success'),
      'success',
      true,
    );
    executeSubmissions();
  } catch (error) {
    setMessage(
      t('components.courses.tasks.submission_modal.save_error'),
      'error',
      true,
    );
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
