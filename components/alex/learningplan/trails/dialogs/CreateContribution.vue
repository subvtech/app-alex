<template>
  <alex-custom-dialog
    v-model="dialog"
    :title="dialogItens.title"
    :persistent="!dialogItens.isReadonly"
    :body-classes="dialogItens.bodyClasses"
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
              v-if="studentId === -1"
              :items="dropdownItems"
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
    <template #footer>
      <alex-custom-dialog-footer v-if="!dialogItens.isReadonly">
        <template #mainSlotButton>
          <alex-custom-button
            :text="dialogItens.mainButtonText"
            size="large"
            :prepend-icon="mode === 'create' ? 'mdi-plus' : 'mdi-pencil'"
            :loading="isSaving"
            @click="saveContribution"
          />
        </template>
      </alex-custom-dialog-footer>
    </template>
  </alex-custom-dialog>
</template>
<script setup lang="ts">
import { contributionType } from '~/pages/courses/[id]/trails/[trailId]/contributions.vue';
const props = defineProps<{ studentId?: number; trailId?: number }>();
const emits = defineEmits(['saveContribution', 'highlight', 'block']);
const { t } = useI18n();

const dialog = ref(false);
const contribution = ref<contributionType>();
const user = useStrapiUser<User>();
const title = ref('');
const editor = ref();
const mode = ref('create');
const isLoading = ref(false);
const isSaving = ref(false);
const { create, update } = useStrapi();
const trailStore = useTrailStore();

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
  isSaving.value = true;
  const editorValue = await editor.value?.getData();
  if (mode.value === 'create') {
    const res = await create('trail-contributions', {
      title: title.value,
      contribution: editorValue.data,
      trail: props.trailId,
      student_member: props.studentId,
    });
    if (trailStore.trail?.contributions !== undefined)
      trailStore.trail.contributions.push({
        ...res.data.attributes,
        student_member: {
          user: {
            id: user.value.id,
          },
        },
      });
    emits('saveContribution', res, title.value, mode.value);
  } else {
    emits('saveContribution', data, title.value, mode.value);
  }
  isSaving.value = false;
  dialog.value = false;
};

const openDialog = async (
  editMode: string,
  contributionData: contributionType,
) => {
  mode.value = editMode;
  dialog.value = true;
  contribution.value = contributionData;
  title.value = contributionData?.title;
  isLoading.value = true;
  if ((await checkEditorReady()) && contribution.value?.contribution) {
    await editor.value?.loadEditor(
      JSON.parse(JSON.stringify(contribution.value.contribution)),
    );
    if (editMode === 'readonly') editor.value?.toggleReadOnly();
  }
  isLoading.value = false;
};

defineExpose({
  openDialog,
});

const dropdownItems = computed(() => {
  return [
    {
      text: contribution.value?.highlighted
        ? t('components.trails.contributions.card.removeHighlight')
        : t('components.trails.contributions.card.highlight'),
      icon: contribution.value?.highlighted
        ? 'mdi-star-remove-outline'
        : 'mdi-star-check-outline',
      onClick: () => {
        console.log('highlight', contribution.value);
        // emits('highlight', student, contributionIndex);
      },
    },
    {
      text: contribution.value?.blocked
        ? t('components.trails.contributions.card.unblock')
        : t('components.trails.contributions.card.block'),
      icon: contribution.value?.blocked
        ? 'mdi-shield-lock-open-outline'
        : 'mdi-shield-alert-outline',
      warning: true,
      onClick: () => {
        // emits('block', student, contributionIndex);
      },
    },
  ];
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
