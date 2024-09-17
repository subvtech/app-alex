<template>
  <div
    class="d-flex tw-flex-col-reverse md:tw-flex-row ga-4 tw-h-[90vh] tw-w-full"
  >
    <!-- Side bar -->
    <div
      class="d-flex flex-column wrapper py-4 px-2 tw-flex-[0_0_35%] md:tw-flex-[0_0_270px] tw-overflow-y-auto"
    >
      <v-expansion-panels v-model="openFolders" class="!tw-block" multiple>
        <alex-project-folder
          v-for="(folder, index) in folders"
          :id="folder.id"
          :key="folder.id + index"
          :title="folder.title || ''"
          :documents="folder?.documents || []"
          :selected-id="selectedDoc?.id"
          :loading="folder.id === -1"
          :open="openFolders.includes(folder.id)"
          :focus="folder.id === newFolderId"
          @add-doc="
            addDocDialog = true;
            dialogFolderId = folder.id;
          "
          @change-name="
            (name) => updateFolderTitle(name, folder.title, folder.id)
          "
          @set-doc="(doc) => (selectedDoc = doc)"
          @delete="deleteFolder(folder.id)"
        />
      </v-expansion-panels>

      <div
        :class="`
          d-flex align-center ga-4 px-4 py-2
          rounded-lg border border-dashed
          tw-cursor-pointer hover:tw-bg-gray-100 tw-transition`"
        @click="addFolder()"
      >
        <alex-custom-button variant="text" color="gray-400" icon="mdi-plus" />
        <p class="text-body-4 text-gray-400">
          {{ $t('components.project.document.newFolder') }}
        </p>
      </div>
    </div>

    <div
      class="wrapper editor-container tw-flex-[0_0_63%] tw-max-h-[63%] md:tw-max-h-full md:tw-flex-1 d-flex flex-column"
    >
      <!-- Header -->
      <div
        class="d-flex ga-4 align-center py-4 px-6 border-b-sm tw-border-[#EBEDEF]"
      >
        <!-- Ver focus border -->
        <input
          v-model="title"
          class="tw-flex-1 text-h4 px-4 py-2 rounded-lg tw-truncate tw-w-0"
          :class="
            docSelected
              ? `hover:tw-bg-[#F1F5F9] tw-transition tw-duration-200 tw-cursor-pointer
          focus:tw-bg-white focus:tw-border-2 tw-outline-[#2E74B8] text-gray-800`
              : 'text-gray-500'
          "
          :disabled="!docSelected"
          @keydown.enter.prevent="
            (e) => {
              if (e) {
                e.target.blur();
              }
            }
          "
          @blur="
            if (!title.length) {
              title = selectedDoc?.title || '';
            } else if (title !== selectedDoc?.title) {
              saveTitle();
            }
          "
        />
        <div class="d-flex align-center justify-center ga-2">
          <alex-custom-tooltip v-if="docState" :text="docState.text">
            <template #content
              ><v-icon :color="docState.color" :class="docState.styles">{{
                docState.icon
              }}</v-icon></template
            >
          </alex-custom-tooltip>

          <alex-custom-button
            icon="mdi-trash-can-outline"
            size="large"
            variant="text"
            color="error-0"
            :disabled="!docSelected"
            @click="delDocDialog = true"
          />
        </div>
      </div>

      <!-- Editor -->
      <div class="content tw-overflow-y-auto">
        <div class="tw-block tw-py-[6px] pr-6 !tw-pl-[84px] tw-h-full">
          <TipTap
            v-if="!!selectedDoc"
            ref="tiptap"
            :key="selectedDoc.id"
            :doc-name="selectedDoc.doc_name"
            :mention-users="mentionUsers"
            @update:model-value="
              (val) => {
                editorContent = val;
              }
            "
          />
        </div>
      </div>
    </div>

    <!-- Modal de criação de documento -->
    <alex-custom-dialog
      v-model="addDocDialog"
      :title="$t('components.project.document.dialog.create.document.title')"
      :main-button-text="
        $t('components.project.document.dialog.create.document.submit')
      "
      @on-main-action="createDocument"
      @on-secondary-action="addDocDialog = false"
    >
      <template v-if="templates.length">
        <p class="text-body-2 text-gray-700">
          {{ $t('components.project.document.selectTitle') }}
        </p>

        <div class="d-flex tw-flex-wrap ga-4 py-4">
          <alex-project-document-template
            v-for="template in templates"
            :id="template.id"
            :key="template.id"
            :title="template.title"
            :cover-url="template.image?.data?.attributes.url"
            :selected="selectedTemplate === template.id"
            @select="
              (id) => (selectedTemplate = selectedTemplate !== id ? id : 0)
            "
          />
        </div>
      </template>

      <alex-inputs-text-field
        v-model="name"
        class="w-100"
        :label="$t('components.project.document.dialog.create.label')"
        :placeholder="
          $t('components.project.document.dialog.create.placeholder')
        "
        name="doc"
        required
      />
    </alex-custom-dialog>

    <!-- Modal para deletar documento -->
    <alex-custom-confirm-dialog
      v-model="delDocDialog"
      variant="error"
      :image="{ src: '/svg/exclusionImage.svg', width: 120, height: 100 }"
      :title="$t('components.project.document.dialog.del.document.title')"
      :subtitle="$t('components.project.document.dialog.del.document.subtitle')"
      :input-label-confirmation="
        $t('components.project.document.dialog.del.type')
      "
      :input-word-confirmation="
        $t('components.project.document.dialog.del.word')
      "
      :input-placeholder-confirmation="
        $t('components.project.document.dialog.del.placeholder')
      "
      :no-input-confirmation="false"
      :submit-button-text="$t('components.project.document.edit.delete')"
      :cancel-button-text="$t('components.project.document.edit.cancel')"
      @cancel="delDocDialog = false"
      @submit="deleteDoc"
    />
  </div>
</template>

<script setup lang="ts">
import { Document } from '@/models/document';
import { MentionUserPropsArray } from '~/components/TipTap/index.vue';

const learningPlanStore = useLearningPlanStore();
// const headerStore = usePageHeaderStore();
const strapi = useStrapi();
const { setMessage } = useMessageStore();
const { t } = useI18n();

// Dialog
const delDocDialog = ref<boolean>(false);

const addDocDialog = ref<boolean>(false);
const dialogFolderId = ref<number>(0);
const templates = ref<DocumentTemplate[]>([]);
const selectedTemplate = ref<number>(0); // Mudar pra template objeto
const name = ref<string>(''); // Input value

// Folders
const openFolders = ref<number[]>([]);
const newFolderId = ref<number>(0); // Used to set focus aftercreate
const folders = ref<DocumentFolder[]>([
  { id: -1, title: '' },
  { id: -1, title: '' },
  { id: -1, title: '' },
]);

// Document
const selectedDoc = ref<Document | null>(null);
const title = ref<string>(t('components.project.document.selectTitle'));
const savingDoc = ref<null | 'loading' | 'saved' | 'error'>(null);
const editorContent = ref<object | string | null>('');

const tiptap = ref<any | null>(null);

const docSelected = computed(() => selectedDoc.value !== null);

const docState = computed<{
  styles: string;
  icon: string;
  text: string;
  color: string;
} | null>(() => {
  if (!savingDoc.value) {
    return {
      text: t('components.project.document.saving.select'),
      icon: 'mdi-content-save',
      color: 'gray-500',
      styles: '',
    };
  }

  if (savingDoc.value === 'loading') {
    return {
      text: t('components.project.document.saving.loading'),
      icon: 'mdi-loading',
      color: 'gray-600',
      styles: 'loading',
    };
  }

  if (savingDoc.value === 'saved') {
    return {
      text: t('components.project.document.saving.saved'),
      icon: 'mdi-content-save-check',
      color: 'success-1',
      styles: '',
    };
  }

  if (savingDoc.value === 'error') {
    return {
      text: t('components.project.document.saving.error'),
      icon: 'mdi-alert-circle-outline',
      color: 'error-0',
      styles: 'text-error-0',
    };
  }

  return null;
});

let saveInterval;

const mentionUsers = computed<MentionUserPropsArray>(() => {
  if (learningPlanStore.loading || !learningPlanStore.learningPlan?.members) {
    return [];
  }

  const users: (UserSimple | undefined)[] =
    learningPlanStore.learningPlan.members.map((member) => member.user);

  return [...new Set(users)]
    .filter((user) => user !== undefined)
    .map(({ fullname, username, avatar }) => ({
      fullname,
      username,
      avatarUrl: avatar?.url || '',
    }));
});

// Get data
const getTemplates = async () => {
  try {
    const templatesRes = await strapi.find<DocumentTemplate>(
      'document-templates',
      {
        populate: {
          image: true,
        },
      },
    );

    templates.value = templatesRes.data.map((template) => ({
      ...template.attributes,
      id: template.id,
    }));
  } catch (e) {
    setMessage(
      t('components.project.document.messages.error.getTemplate'),
      'error',
      true,
    );
  }
};

// Criar um novo documento
const createDocument = async () => {
  if (!name.value) {
    setMessage(
      t('components.project.document.messages.warning.missName'),
      'warning',
      true,
    );
    return;
  }

  const template = templates.value.find(
    ({ id }) => id === selectedTemplate.value,
  );

  try {
    const docRes = await strapi.create('documents', {
      title: name.value,
      content: template?.content || null,
      document_folder: dialogFolderId.value,
      document_template: selectedTemplate.value || null,
    });

    const newDoc: Document = {
      ...docRes.data.attributes,
      id: docRes.data.id,
    };

    // Atualiza os documentos listados
    folders.value = folders.value.map((folder) => {
      if (folder.id !== dialogFolderId.value) {
        return folder;
      }

      const documents = folder.documents || [];

      // Opens parent folder
      openFolders.value = [...Object.values(openFolders.value), folder.id];
      folder.documents = [...documents, newDoc];

      return folder;
    });

    // Fecha o modal após sucesso da operação
    setMessage(
      t('components.project.document.messages.success.createDoc'),
      'success',
      true,
    );

    selectedDoc.value = newDoc;
    addDocDialog.value = false;
    dialogFolderId.value = 0;

    if (!template) {
      return;
    }

    // Updates tiptap with content
    await setTimeout(() => {}, 100);

    let tryCount = 0;

    const interval = setInterval(() => {
      if (tiptap.value) {
        tiptap.value.setContent(template.content);
        clearInterval(interval);
      } else {
        tryCount++;
      }

      if (tryCount >= 10) {
        clearInterval(interval);
      }
    }, 300);
  } catch (e) {
    setMessage(
      t('components.project.document.messages.error.createDoc'),
      'error',
      true,
    );
  }
};

// Fazer alteração em documento existente
const saveTitle = async () => {
  if (!selectedDoc.value) {
    return;
  }

  try {
    await strapi.update('documents', selectedDoc.value.id, {
      title: title.value || selectedDoc.value.title,
    });

    folders.value =
      folders.value.map((folder) => {
        folder.documents = folder.documents?.map((doc) => {
          if (doc.id !== selectedDoc.value?.id) {
            return doc;
          }

          doc.title = title.value || selectedDoc.value?.title || '';

          return doc;
        });

        return folder;
      }) || [];

    const updatedDoc: Document = selectedDoc.value;

    updatedDoc.title = title.value;
    selectedDoc.value = updatedDoc;

    setMessage(
      t('components.project.document.messages.success.updateDoc'),
      'success',
      true,
    );
  } catch (e) {
    setMessage(
      t('components.project.document.messages.error.updateDoc'),
      'error',
      true,
    );
  }
};

const saveDocument = async () => {
  if (!selectedDoc.value) {
    return;
  }

  try {
    savingDoc.value = 'loading';
    await strapi.update('documents', selectedDoc.value.id, {
      content: toRaw(editorContent.value),
    });

    folders.value =
      folders.value.map((folder) => {
        folder.documents = folder.documents?.map((doc) => {
          if (doc.id !== selectedDoc.value?.id) {
            return doc;
          }

          doc.content = toRaw(editorContent.value);

          return doc;
        });

        return folder;
      }) || [];

    const updatedDoc: Document = selectedDoc.value;

    updatedDoc.content = editorContent.value;

    selectedDoc.value = updatedDoc;

    savingDoc.value = 'saved';
  } catch (e) {
    savingDoc.value = 'error';
  }
};

// Atualizar nome da pasta no banco quando tiver blur do contenteditable
const updateFolderTitle = async (
  title: string,
  oldTitle: string,
  id: number | undefined,
) => {
  if (!id) {
    setMessage(
      t('components.project.document.messages.error.folderName'),
      'warning',
      true,
    );
    return;
  }

  if (!title.length) {
    alterFolderTitle(id, oldTitle);
    return;
  }

  try {
    await strapi.update('document-folders', id, {
      title,
    });

    setMessage(
      t('components.project.document.messages.success.folderName'),
      'success',
      true,
    );
    alterFolderTitle(id, title);
  } catch (e) {
    setMessage(
      t('components.project.document.messages.error.folderName'),
      'error',
      true,
    );
    alterFolderTitle(id, oldTitle);
  }
};

// Atualiza 'folders' com o título da pasta alterado (Função auxiliar de updateFolderTitle)
const alterFolderTitle = (id: number, title: string) => {
  folders.value = folders.value.map((folder) => {
    if (folder.id === id) {
      folder.title = title;
    }

    return folder;
  });
};

const deleteFolder = async (id: number) => {
  try {
    await strapi.delete('document-folders', id);
    setMessage(
      t('components.project.document.messages.success.delFolder'),
      'success',
      true,
    );

    // Null selected doc if it was inside the selected folder
    const folder = folders.value.find((folder) => folder.id === id);
    if (
      selectedDoc.value &&
      folder &&
      folder.documents?.map(({ id }) => id).includes(selectedDoc.value.id)
    ) {
      selectedDoc.value = null;
    }

    folders.value = folders.value.filter((folder) => folder.id !== id);
  } catch (e) {
    setMessage(
      t('components.project.document.messages.error.delFolder'),
      'error',
      true,
    );
  }
};

const deleteDoc = async () => {
  if (selectedDoc.value === null) {
    setMessage('Selecione um documento para ser deletado', 'warning', true);
    return;
  }

  try {
    await strapi.delete('documents', selectedDoc.value.id || 0);

    folders.value = folders.value.map((folder) => {
      folder.documents =
        folder.documents?.filter(({ id }) => id !== selectedDoc.value?.id) ||
        [];

      return folder;
    });

    editorContent.value = '';
    selectedDoc.value = null;
    delDocDialog.value = false;

    setMessage(
      t('components.project.document.messages.success.delFolder'),
      'success',
      true,
    );
  } catch (e) {
    setMessage(
      t('components.project.document.messages.error.delFolder'),
      'error',
      true,
    );
  }
};

const addFolder = async () => {
  const allIds: number[] = folders.value.map(({ id }) => id);

  if (allIds.includes(-1)) {
    setMessage(
      t('components.project.document.messages.warning.creatingFolder'),
      'warning',
      true,
    );
    return;
  }

  folders.value = [
    ...folders.value,
    {
      id: -1,
      title: 'Nova pasta',
    },
  ];

  try {
    const newFolder = await strapi.create('document-folders', {
      title: 'Nova pasta',
      learningplan: learningPlanStore.learningPlan?.id || 0,
    });

    folders.value = folders.value.map((folder) => {
      if (folder.id === -1) {
        folder = {
          id: newFolder.data.id,
          ...newFolder.data.attributes,
        };
      }

      return folder;
    });

    setMessage(
      t('components.project.document.messages.success.createFolder'),
      'success',
      true,
    );
  } catch (e) {
    folders.value = folders.value.filter(({ id }) => id !== -1);
  }
};

const getFolders = () => {
  if (learningPlanStore.loading || !learningPlanStore.learningPlan) {
    return;
  }

  folders.value = learningPlanStore.learningPlan?.document_folders || [];

  // headerStore.title = 'Projetos';
  // headerStore.items = [
    // {
    //   title: 'Home',
    //   disabled: true,
    // },
    // {
    //   title: 'Projetos',
    //   to: '/projects/me',
    // },
    // {
    //   title: learningPlanStore.learningPlan.title,
    //   to: `/courses/${learningPlanStore.learningPlan.id}`,
    // },
  // ];
};

// onBeforeMount(() => {
  // headerStore.showHeader = true;
// });

  // {
  //   title: 'Home',
  //   disabled: true,
  // },
  // {
  //   title: 'Projetos',
  //   to: '/projects/me',
  // },
  // {
  //   title: learningPlanStore.learningPlan.title,
  //   to: `/courses/${learningPlanStore.learningPlan.id}`,
  // },
  // ];
//};

onBeforeMount(() => {
  // headerStore.showHeader = true;
});

onMounted(() => {
  getTemplates();
  getFolders();
});

// Get data from store
watch(
  () => learningPlanStore.loading,
  () => getFolders(),
);

watch(selectedDoc, async (doc) => {
  if (saveInterval) {
    clearInterval(saveInterval);
  }

  if (!doc) {
    savingDoc.value = null;
    title.value = t('components.project.document.selectTitle');
    return;
  }

  title.value = doc.title;
  editorContent.value = doc.content || '';

  await saveDocument();

  saveInterval = setInterval(async () => {
    if (editorContent.value !== doc.content) {
      await saveDocument();
    }
  }, 4000);
});

// Erase input data from dialog when closed
watch(addDocDialog, (open) => {
  if (!open) {
    dialogFolderId.value = 0;
    selectedTemplate.value = 0;
    name.value = '';
  }
});

// Starts new folder with focus on title
watch(folders, (val, oldVal) => {
  if (oldVal.length === 3 && oldVal[0].id === -1) {
    return;
  }

  if (val.length !== oldVal.length || !val.length) {
    newFolderId.value = 0;
    return;
  }

  if (oldVal[oldVal.length - 1].id === -1 && val[val.length - 1].id !== -1) {
    newFolderId.value = val[val.length - 1].id;
  }
});
</script>

<style scoped>
.wrapper {
  border-radius: 8px;
  box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.08);
  background: white;
}

.loading {
  transform-origin: center center;
  animation: loading 1s ease-out infinite;
}

@keyframes loading {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.editor-container {
  width: 100%;
}

.editor-container .content {
  max-height: 100%;
}

@media (min-width: 768px) {
  .editor-container {
    /* 100% - folders - gap */
    width: calc(100% - 270px - 16px);
  }
}
</style>
