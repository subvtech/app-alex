<template>
  <alex-custom-card
    class="mb-6"
    sizing-class="pa-0"
    full-width
    :title="title"
    :is-editing="isEditing && canEdit"
    :show-icon="canEdit"
    :cancel="resetData"
    :save="updateDetails"
    @toggle:is-editing="toggleIsEditing"
  >
    <template #content>
      <div
        v-if="isEmptyAndIsNotEditing"
        class="d-flex flex-column w-100 justify-center align-center gap-4"
      >
        <alex-custom-empty-placeholder
          empty-text-image="/svg/EmptyAbout.svg"
          :empty-text-message="$t('components.courses.editor.emptyPlaceholder')"
        />
      </div>
      <app-editor
        v-else
        ref="editorDetails"
        class="editorjs w-full p-6 sm:p-16"
        :data="data"
        :class="[isEditing ? 'editing-editor' : 'locked']"
        :spellcheck="isEditing ? 'true' : 'false'"
      />
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
const { update } = useStrapi();
const { t } = useI18n();
type DetailsBlock = {
  type: string;
  data: object;
};
type DetailsEditorProps = {
  data: {
    blocks: DetailsBlock[];
  };
  courseId: number;
  title: string;
  canEdit: boolean;
};
const props = withDefaults(defineProps<DetailsEditorProps>(), {});
const emit = defineEmits(['ready', 'update']);
const { setMessage } = useMessageStore();
const { data, canEdit } = toRefs(props);
const isLoading = ref(false);
const readOnly = ref(false);
const learningplanStore = useLearningPlanStore();
const editorDetails = ref();
const initialData = ref();
const isEditing = ref(false);
const isEmptyAndIsNotEditing = computed(
  () => data.value.blocks?.length === 0 && !isEditing.value,
);
const updateDetails = async () => {
  const editorData = await editorDetails.value?.getData();
  await update(`learningplans`, props.courseId, {
    details: editorData.data,
  });
  isEditing.value = false;
  initialData.value = editorData.data;
  emit('update', t('components.courses.editor.update'));
};
const toggleIsEditing = () => {
  isEditing.value = !isEditing.value;
  if (isEditing.value) {
    toggleReadOnly();
    initialData.value = data.value;
  }
};
const checkEditorReady = async () => {
  let attempts = 0;
  while (attempts < 10) {
    try {
      await editorDetails.value.isReady;
      return true;
    } catch (error) {
      await sleep(100);
      attempts++;
    }
  }
  return false;
};
const toggleReadOnly = async () => {
  readOnly.value = !readOnly.value;
  if (editorDetails.value && data.value.blocks?.length) {
    await editorDetails.value.toggleReadOnly();
  }

  if (!readOnly.value) {
    initialData.value = data.value;
  }
};
const resetData = async () => {
  if (!data.value.blocks?.length) {
    editorDetails.value.clearEditor();
  } else {
    const editorData = JSON.parse(JSON.stringify(initialData.value));
    await editorDetails.value?.loadEditor(editorData);
  }
  toggleReadOnly();
};
onMounted(async () => {
  isLoading.value = true;
  while (learningplanStore.loading) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  if (data.value.blocks?.length) {
    if (await checkEditorReady()) {
      readOnly.value = false;
      const editorData = JSON.parse(JSON.stringify(data.value));
      await editorDetails.value?.loadEditor(editorData);
      editorDetails.value?.toggleReadOnly();
    } else {
      setMessage(t('pages.trailId.overview.loadError'), 'red', true);
    }
  }
  isLoading.value = false;
});
</script>

<style global lang="scss">
#editorjs {
  width: 100% !important;
}
.locked {
  pointer-events: none;
  -webkit-user-select: text; /* Chrome, Safari, and Opera */
  -moz-user-select: text; /* Firefox */
  -ms-user-select: text; /* Internet Explorer/Edge */
  user-select: text;

  .ce-toolbar__actions.ce-toolbar__actions--opened {
    display: none;
  }
}
#editorjs .codex-editor__redactor {
  padding-bottom: 0 !important;
}
@media (min-width: 651px) {
  #editorjs:not(.locked) {
    .codex-editor--narrow .ce-block {
      margin-right: 0;
      padding-right: 0;
    }
    .ce-block__content {
      margin: 0;
      margin-left: 40px;
    }

    .ce-toolbar__actions {
      right: auto;
      left: -20px;
    }
    .codex-editor--narrow .ce-toolbox .ce-popover,
    .codex-editor--narrow .ce-settings .ce-popover {
      right: auto;
      left: 0;
    }
  }
}
#editorjs:not(.locked) {
  .ce-toolbar__content {
    margin: 0;
  }
}
.ce-block__content {
  margin: 0;
  max-width: none;
}
.blocks {
  text-align: justify;
  text-justify: inter-word;
  align-self: stretch;
  color: #5d6872;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
}
</style>
