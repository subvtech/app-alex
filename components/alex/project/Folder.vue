<template>
  <!-- Folder -->
  <v-expansion-panel v-if="!loading" class="project_folder mb-2" :value="id">
    <v-expansion-panel-title
      class="d-flex align-center ga-2 pa-4 rounded-lg tw-cursor-pointer hover:bg-gray-100"
      :class="hasDocSelected ? 'bg-gray-blue' : 'bg-white'"
      hide-actions
    >
      <v-icon
        :icon="open ? 'mdi-folder-open' : 'mdi-folder'"
        :color="hasDocSelected ? 'secondary-0' : 'gray-600'"
      />

      <input
        ref="titleInput"
        v-model="titleRef"
        :class="`
          tw-w-full text-body-4 text-gray-600 tw-truncate tw-outline-none
          tw-leading-[1em] tw-select-none tw-pointer-events-none`"
        @blur="handleTitleBlur"
        @keydown.enter.prevent="titleInput?.blur()"
        @keydown.space.prevent="titleRef += ' '"
      />
      <alex-custom-button
        variant="text"
        size="small"
        icon="mdi-plus"
        color="gray-400"
        @click="emit('add-doc')"
      />
      <alex-custom-dropdown :items="options" class="!tw-z-[10000]"
        ><template #activator="activate">
          <alex-custom-button
            v-bind="activate.props"
            variant="text"
            size="small"
            icon="mdi-dots-vertical"
            color="gray-400"
          /> </template
      ></alex-custom-dropdown>
    </v-expansion-panel-title>
    <!-- Documents -->
    <v-expansion-panel-text>
      <alex-project-document
        v-for="document in documents"
        :key="document?.id"
        :title="document.title"
        :selected="document.id === selectedId"
        :loading="document?.loading"
        @click="emit('set-doc', document)"
      />
    </v-expansion-panel-text>
  </v-expansion-panel>
  <alex-custom-skeleton v-else class="tw-h-[52px] tw-w-full" rounded="lg" />

  <alex-custom-confirm-dialog
    v-model="deleteDialog"
    class="delete_project_folder"
    variant="error"
    :image="{ src: '/svg/exclusionImage.svg', width: 120, height: 100 }"
    :title="$t('components.project.document.dialog.del.folder.title')"
    :subtitle="$t('components.project.document.dialog.del.folder.subtitle')"
    :input-label-confirmation="
      $t('components.project.document.dialog.del.type')
    "
    :input-word-confirmation="$t('components.project.document.dialog.del.word')"
    :input-placeholder-confirmation="
      $t('components.project.document.dialog.del.placeholder')
    "
    :no-input-confirmation="false"
    :submit-button-text="$t('components.project.document.edit.delete')"
    :cancel-button-text="$t('components.project.document.edit.cancel')"
    @cancel="deleteDialog = false"
    @submit="emit('delete')"
  />
</template>

<script setup lang="ts">
import { AlexDropdownItem } from '../../inputs/Dropdown.vue';

interface FolderProps {
  id: number;
  title: string;
  documents: Document[];
  selectedId: number;
  open: boolean;
  loading: boolean;
  focus?: boolean;
}

const props = defineProps<FolderProps>();

const titleInput = ref<HTMLInputElement | null>(null);
const titleRef = ref<string>(props.title);
const deleteDialog = ref<boolean>(false);
const options = ref<AlexDropdownItem[]>([
  {
    text: 'Editar',
    icon: 'mdi-pencil-outline',
    onClick: () => editFolder(),
  },
  {
    text: 'Excluir',
    icon: 'mdi-trash-can-outline',
    onClick: () => (deleteDialog.value = true),
    warning: true,
  },
]);

const hasDocSelected = computed(() => {
  const docIds = props.documents
    .map(({ id }) => id)
    .filter((doc) => doc !== undefined);

  return docIds.includes(props.selectedId);
});

const emit = defineEmits(['set-doc', 'add-doc', 'change-name', 'delete']);

const handleTitleBlur = () => {
  if (!titleRef.value.length) {
    titleRef.value = props.title;
  } else if (titleRef.value !== props.title) {
    emit('change-name', titleRef.value);
  }
};

const editFolder = () => {
  if (!titleInput.value) {
    return;
  }

  titleInput.value.focus();
  document.execCommand('selectAll', false, undefined);
};

onMounted(() => {
  if (props.focus) {
    editFolder();
  }
});

defineExpose({ editFolder });
</script>

<style>
.project_folder .v-expansion-panel-text__wrapper {
  padding: 0 !important;
}

.project_folder.v-expansion-panel:not(:first-child)::after {
  border-top-style: none !important;
}

.delete_project_folder .v-container.v-locale--is-ltr {
  justify-content: center !important;
}
</style>
