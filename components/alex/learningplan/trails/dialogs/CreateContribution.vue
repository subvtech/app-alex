<template>
  <alex-custom-dialog
    v-model="dialog"
    :title="dialogItens.title"
    persistent
    :main-button-text="dialogItens.mainButtonText"
    :body-classes="dialogItens.bodyClasses"
    :no-footer="dialogItens.isReadonly"
    :max-width="1080"
    @on-main-action="saveContribution"
    @on-secondary-action="dialog = false"
  >
    <template #header>
      <alex-custom-dialog-header
        :title="dialogItens.title"
        @on-close="dialog = false"
      >
        <template #default>
          <div class="ml-auto">
            <alex-custom-dropdown
              :items="[{ text: 'edit' }]"
              variant="text"
              icon="mdi-dots-vertical"
              class="mr-auto"
            ></alex-custom-dropdown>
          </div>
        </template>
      </alex-custom-dialog-header>
    </template>
    <alex-inputs-text-field
      v-if="!dialogItens.isReadonly"
      v-model="title"
      required
      label="Título"
      placeholder="Descreva do que se trata sua contribuição"
      name="contributionTitle"
      class="ma-6 mb-1"
    />
    <div class="divider"></div>
    <div class="mx-auto editor my-6 px-sm-6 px-1 px-md-0">
      <v-progress-circular
        v-if="isLoading"
        indeterminate
        color="accent"
        class="loader"
        theme="light"
      ></v-progress-circular>
      <app-editor ref="editor" />
    </div>
  </alex-custom-dialog>
</template>
<script setup lang="ts">
const dialog = ref(false);
const title = ref();
const editor = ref();
const mode = ref('create');
const isLoading = ref(false);

const dialogItens = computed(() => {
  return {
    title: mode.value !== 'create' ? title.value : 'Nova Contribuição',
    mainButtonText: mode.value === 'create' ? 'Contribuir' : 'Editar',
    bodyClasses:
      mode.value === 'readonly'
        ? 'width-270 pa-0 bg-white rounded-b'
        : 'width-270 pa-0 bg-white',
    isReadonly: mode.value === 'readonly',
  };
});

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

const saveContribution = async () => {
  const res = await editor.value?.getData();
  console.log(res);
};

const openDialog = async (
  editMode: string,
  editorData?: JSON,
  contributionTitle?: string,
) => {
  mode.value = editMode;
  dialog.value = true;
  title.value = contributionTitle;
  isLoading.value = true;
  if ((await checkEditorReady()) && editorData) {
    await editor.value?.loadEditor(JSON.parse(JSON.stringify(editorData)));
    if (editMode === 'readonly') editor.value?.toggleReadOnly();
  }
  isLoading.value = false;
};

defineExpose({
  openDialog,
});
</script>

<style scoped>
.divider {
  border-top: 1px solid #e0e0e0;
}

#editor,
.editor {
  max-width: 785px !important;
  position: relative;
  min-height: 400px;
}

.loader {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
