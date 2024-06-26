<template>
  <alex-custom-dialog v-model="dialog" :persistent="true" :max-width="1080">
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
    <div class="mx-auto editor my-6 px-sm-6 px-1 px-md-0 w-100">
      {{ restrictions }}
      <app-editor
        ref="editor"
        :allowed-blocks="allowedBlocks"
        @change="() => (hasEditorChanges = true)"
      />
    </div>
    <template #footer>
      <v-container
        class="bg-white rounded-b-lg border-top-gray-100 d-flex justify-end ga-3 pa-6 align-center"
      >
        <p v-if="lastSaveDate" class="text-body-4 text-gray-400">
          Salvo Automaticamente há
          {{ differenceInMinutes(currentDate, lastSaveDate) }} minutos
        </p>
        <alex-custom-button
          size="large"
          variant="secondary"
          text="Salvar"
          :loading="isLoading"
          :disabled="!hasEditorChanges"
          @click="saveSubmission"
        />
        <alex-custom-button
          size="large"
          variant="primary"
          text="Enviar para avaliação"
          :loading="isLoading"
          :disabled="!currentData?.blocks.length"
          @click="sendSubmission"
        />
      </v-container>
    </template>
  </alex-custom-dialog>
</template>
<script setup lang="ts">
import { differenceInMinutes } from 'date-fns';
import { useIntervalFn } from '@vueuse/core';
import lodash from 'lodash';
import { EditorSubmission } from '~/models/simple/taskSubmissionSimples.model';
interface submissionProps {
  title: string;
  deadline: string;
  taskMemberId: number;
  restrictions?: string[];
  lastSubmission?: TaskSubmissionSimple;
}

const props = withDefaults(defineProps<submissionProps>(), {
  title: '',
  deadline: undefined,
  restrictions: undefined,
  lastSubmission: undefined,
});
const { setMessage } = useMessageStore();
const dialog = ref(false);
const editor = ref();
const isLoading = ref(false);
const { create, update } = useStrapi();
const currentData = ref<EditorSubmission>();
const taskMemberId = toRef(props, 'taskMemberId');
const hasEditorChanges = ref(false);
const lastSaveDate = ref<Date | null>(null);
const currentDate = ref<Date>(new Date());
const { resume: resumeCurrentDate, pause: pauseCurrentDate } = useIntervalFn(
  () => {
    currentDate.value = new Date();
  },
  1000,
  { immediate: false },
);
const { resume, pause } = useIntervalFn(
  async () => {
    hasEditorChanges.value = await checkDataChanges();
    if (hasEditorChanges.value) {
      await saveContent();
      lastSaveDate.value = new Date();
    }
  },
  6000,
  { immediate: false },
);
const checkEditorReady = async () => {
  let attempts = 0;
  while (attempts < 10) {
    try {
      await editor.value.isReady;
      return true;
    } catch (error) {
      await sleep(100);
      attempts++;
    }
  }
  return false;
};

const checkDataChanges = async () => {
  await checkEditorReady();
  const editorData = await editor.value?.getData();
  const data1 = editorData?.data?.blocks;
  if (!data1 || !data1.length) return false;
  const data2 = toRaw(currentData.value?.blocks);
  const test = lodash.isEqual(data1, data2);
  return !test;
};

const openDialog = async () => {
  dialog.value = true;
  isLoading.value = true;
  currentData.value = props.lastSubmission?.submission || undefined;
  resume();
  resumeCurrentDate();
  await executeSubmissions();
  hasEditorChanges.value = await checkDataChanges();
  if ((await checkEditorReady()) && props.lastSubmission?.submission) {
    await editor.value?.loadEditor(
      JSON.parse(JSON.stringify(props.lastSubmission?.submission)),
    );
  }
  isLoading.value = false;
};
const saveContent = async () => {
  const content = await editor.value.getData();
  currentData.value = content.data;
  if (props.lastSubmission?.id) {
    await update('task-submissions', props.lastSubmission.id, {
      submission: content.data,
    });
  } else {
    await create('task-submissions', {
      task_member: props.taskMemberId,
      submission: content.data,
    });
  }
  hasEditorChanges.value = await checkDataChanges();
};
const { execute: executeSubmissions } = useTaskSubmission(taskMemberId);
const saveSubmission = async () => {
  isLoading.value = true;
  await checkEditorReady();
  try {
    await saveContent();
    setMessage('Submissão salva com sucesso', 'success', true);
    executeSubmissions();
  } catch (error) {
    setMessage('Erro ao salvar, tente novamente', 'error', true);
  } finally {
    isLoading.value = false;
  }
};
const sendSubmission = async () => {
  isLoading.value = true;
  try {
    if (!props.lastSubmission?.id) {
      return;
    }
    const time = new Date();
    await update('task-submissions', props.lastSubmission.id, {
      submitted_at: time,
    });
    await update('task-members', props.taskMemberId, {
      last_submission_at: time,
    });
    executeSubmissions();
    dialog.value = false;
  } catch (error) {
    setMessage('Erro ao entregar, tente novamente', 'error', true);
  } finally {
    isLoading.value = false;
  }
};

const allowedBlocks = computed(() => {
  const blocks = <string[]>[];
  props.restrictions?.forEach((restriction) => {
    if (restriction === 'text') {
      blocks.push('Paragraph');
      blocks.push('header');
      blocks.push('delimiter');
      blocks.push('list');
      blocks.push('inlineCode');
      blocks.push('marker');
      blocks.push('quote');
      blocks.push('table');
      blocks.push('alert');
      blocks.push('warning');
      blocks.push('code');
      blocks.push('alignmentBlockTune');
    }
    if (restriction === 'link') {
      blocks.push('link');
    }
    if (restriction === 'image') {
      blocks.push('image');
    }
    if (restriction === 'gallery') {
      blocks.push('carousel');
      blocks.push('image');
    }
    if (restriction === 'document') {
      blocks.push('fileSet');
    }
  });
  return blocks;
});
watch(dialog, (value) => {
  if (!value) {
    lastSaveDate.value = null;
    pause();
    pauseCurrentDate();
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
