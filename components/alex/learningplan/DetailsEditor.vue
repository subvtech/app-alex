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
        class="w-full p-6 sm:p-16"
        :data="data"
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
  } | null;
  courseId: number;
  title: string;
  canEdit: boolean;
};
const props = withDefaults(defineProps<DetailsEditorProps>(), { data: null });
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
  () => !data.value?.blocks?.length && !isEditing.value,
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
  if (editorDetails.value && data.value?.blocks?.length) {
    await editorDetails.value.toggleReadOnly();
  }

  if (!readOnly.value) {
    initialData.value = data.value;
  }
};
const resetData = async () => {
  if (!data.value?.blocks?.length) {
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
  if (data.value?.blocks?.length) {
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
