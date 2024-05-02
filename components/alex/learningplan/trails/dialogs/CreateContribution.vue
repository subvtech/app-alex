<template>
  <alex-custom-dialog
    v-model="dialog"
    :title="dialogItens.title"
    :persistent="!dialogItens.isReadonly"
    :body-classes="dialogItens.bodyClasses"
    :max-width="1080"
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
      <alex-custom-dialog-footer
        v-if="!dialogItens.isReadonly"
        @on-secondary-action="dialog = false"
      >
        <template #mainSlotButton>
          <alex-custom-button
            :text="dialogItens.mainButtonText"
            size="large"
            :prepend-icon="mode === 'create' ? 'mdi-plus' : 'mdi-pencil'"
            :loading="isSaving"
            :disabled="!title || isSaving"
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
const emits = defineEmits(['highlight', 'block']);
const { t } = useI18n();
const messageStore = useMessageStore();

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

const createContribution = async (
  editorValue: contributionType['contribution'],
) => {
  const res = await create('trail-contributions', {
    title: title.value,
    contribution: editorValue,
    trail: props.trailId,
    student_member: props.studentId,
  });
  if (trailStore.trail?.contributions !== undefined)
    trailStore.trail.contributions.unshift({
      ...res.data.attributes,
      id: res.data.id,
      student_member: {
        user: {
          id: user.value.id,
        },
      },
    });
};

const updateContribution = async (
  editorValue: contributionType['contribution'],
) => {
  if (contribution.value?.id === undefined) {
    throw new Error('Contribution id not found');
  }
  const res = await update('trail-contributions', contribution.value.id, {
    title: title.value,
    contribution: editorValue,
  });
  if (trailStore.trail === undefined)
    throw new Error('Trail contributions not found');
  const index = trailStore.trail?.contributions.findIndex(
    (c) => c.id === res.data.id,
  );
  trailStore.trail.contributions[index].title = res.data.attributes.title;
  trailStore.trail.contributions[index].contribution =
    res.data.attributes.contribution;
};

const saveContribution = async () => {
  isSaving.value = true;
  try {
    const editorValue = await editor.value?.getData();
    if (editorValue.data.blocks.length === 0) {
      messageStore.setMessage(
        t('components.trails.contributions.emptyContribution'),
        'red',
        true,
      );
      return;
    }
    if (mode.value === 'create') {
      await createContribution(editorValue.data);
    } else {
      await updateContribution(editorValue.data);
    }
    dialog.value = false;
  } catch (e) {
    messageStore.setMessage(
      t('components.trails.contributions.saveError'),
      'red',
      true,
    );
  } finally {
    isSaving.value = false;
  }
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
        if (contribution.value) {
          emits('highlight', contribution.value.id);
        }
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
        if (contribution.value) {
          emits('block', contribution.value.id);
        }
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
