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
      <app-editor ref="editor" :allowed-blocks="['embed', 'link', 'header']" />
    </div>
    <template #footer>
      <v-container
        class="bg-white rounded-b-lg border-top-gray-100 d-flex justify-end ga-3 pa-6 align-center"
      >
        <p v-if="savedTime > 0" class="text-body-4 text-gray-400">
          Salvo Automaticamente há
          {{ savedTime }} minutos
        </p>
        <alex-custom-button
          size="large"
          variant="secondary"
          text="Salvar"
          :loading="isLoading"
          @click="saveSubmission"
        />
        <alex-custom-button
          size="large"
          variant="primary"
          text="Enviar para avaliação"
          :loading="isLoading"
        />
      </v-container>
    </template>
  </alex-custom-dialog>
</template>
<script setup lang="ts">
interface submissionProps {
  title: string;
  deadline: string;
  taskMemberId: number;
  restrictions?: string[];
  lastSubmission?: TaskSubmissionSimple;
}

const props = withDefaults(defineProps<submissionProps>(), {
  title: '',
  deadline: '',
  restrictions: undefined,
  lastSubmission: undefined,
});

const { setMessage } = useMessageStore();
const dialog = ref(false);
const editor = ref();
const isLoading = ref(false);
const { create, update } = useStrapi();
const savedTime = ref<number>(-1);
const currentData = ref<string>();
const taskMemberId = toRef(props, 'taskMemberId');
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

const checkDataChanges = computed(async () => {
  await checkEditorReady();
  const editorData = await editor.value?.getData();
  const data1 = JSON.stringify(editorData.data.blocks);
  const data2 = JSON.stringify(props.lastSubmission?.submission.blocks);
  console.log(data1, data2);
  const test = Object.is(data1, data2);
  return test;
});

const autoSave = async () => {
  setInterval(async () => {
    const teste = await checkDataChanges.value;
    console.log(teste);
    // check if the editor data is different from the last submission
    // if (currentData.value != (await editor.value?.getData()).data) {
    //   // saveContent();
    //   console.log('saved');
    //   savedTime.value = 0;
    // } else if (savedTime.value >= 0) savedTime.value += 1;
  }, 6000);
};

const openDialog = async () => {
  dialog.value = true;
  isLoading.value = true;
  currentData.value = props.lastSubmission?.submission || '';
  autoSave();
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

/* const allowedBlocks = computed(() => {
  const blocks = [];
  
}); */

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
