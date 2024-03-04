<template>
  <alex-custom-card
    :title="$t('components.courses.goals.title')"
    is-nested
    hide-dividers
    show-tooltip
    :disable-save="disableSave"
    :is-editing="isEditingAndCanEdit"
    :save="onSave"
    :tooltip-extra-class="isEditing ? 'mt-3' : ''"
    :cancel="onCancel"
    :tooltip="tooltip"
    :small-buttons="withinBreakpoint"
    :show-icon="canEdit"
    @toggle:is-editing="isEditing = !isEditing"
  >
    <template #content>
      <alex-custom-empty-placeholder
        v-if="localData.length === 0"
        class="align-self-center"
        :empty-text-message="$t('components.courses.goals.empty')"
        empty-text-image="/svg/EmptyGoals.svg"
      />
      <div v-if="isEditing" class="d-flex flex-column w-100 gap-4 align-center">
        <alex-custom-accordion
          v-model="selectedPanel"
          v-model:data="localData"
          show-positions
          :overwrite-item="!isEditing"
        >
          <template
            v-if="isEditing"
            #content="{ id, keyWord, index, description }"
          >
            <alex-learningplan-form-goal
              :id="id"
              :keyword="keyWord || ''"
              :index="index"
              :description="description"
              :filtered-items="filteredVerbs"
              @update:keyword="onUpdateKeyword"
              @update:description="onUpdateDescription"
              @error:description="onErrorDescription"
              @error:keyword="onErrorKeyword"
              @success:description="onSuccessDescription"
              @success:keyword="onSuccessKeyword"
            /> </template
        ></alex-custom-accordion>
        <alex-custom-button
          class="add-button"
          prepend-icon="mdi-plus"
          variant="text"
          @click="addGoal"
        >
          {{ $t('components.courses.goals.add') }}</alex-custom-button
        >
      </div>
      <div v-else class="d-flex flex-column gap-2 w-100">
        <alex-learningplan-goal
          v-for="(item, index) in localData"
          :key="index"
          :index="index"
          :key-word="item.keyWord"
          :title="item.title"
        />
      </div>
    </template>
  </alex-custom-card>
</template>
<script setup lang="ts">
const client = useStrapiClient();
type UpdateDataGoal = { value: string; index: number };
type Goal = {
  id?: number;
  title: string; // Description
  keyWord: string; // Verb
  local?: boolean;
  errorKeyWord: boolean;
  errorDescription: boolean;
  contentData: {
    id?: number;
    keyWordId?: number; // Verb
    index: number;
    keyWord: string; // Verb
    description: string; // Title
  };
};
type GoalsProps = {
  canEdit?: boolean;
  tooltip: string;
  courseId: number;
  userId: number;
  data: Goal[];
};
const props = withDefaults(defineProps<GoalsProps>(), {
  canEdit: false,
});
const emit = defineEmits(['update']);
const { t } = useI18n();
const { currentWidth } = useNavigationDrawer();
const { setMessage } = useMessageStore();
const localData = ref([...props.data]);
const disableSave = ref(true);
const isEditing = ref(false);
const selectedPanel = ref(0);
const filteredVerbs = ref<{ text: string; id: number }[]>([]);
const withinBreakpoint = computed(() => currentWidth.value < 450);
const isEditingAndCanEdit = computed(() => props.canEdit && isEditing.value);

const toggleSave = () => {
  const errorFound = localData.value.find(
    (item) => item.errorDescription || item.errorKeyWord,
  );
  if (errorFound) disableSave.value = true;
  else disableSave.value = false;
};
const onErrorDescription = (index: number) => {
  localData.value[index].errorDescription = true;
  disableSave.value = true;
  toggleSave();
};
const onErrorKeyword = (index: number) => {
  localData.value[index].errorKeyWord = true;
  toggleSave();
};
const onSuccessDescription = (index: number) => {
  localData.value[index].errorDescription = false;
  disableSave.value = true;
  toggleSave();
};
const onSuccessKeyword = (index: number) => {
  localData.value[index].errorKeyWord = false;
  toggleSave();
};
const onUpdateDescription = (data: UpdateDataGoal) => {
  localData.value[data.index].title = data.value;
  localData.value[data.index].contentData.description = data.value;
};
const onUpdateKeyword = (data: UpdateDataGoal) => {
  localData.value[data.index].keyWord = data.value;
  localData.value[data.index].contentData.keyWord = data.value;
};

const addGoal = () => {
  const newGoal = {
    keyWord: t('components.courses.goals.verb.placeholder'),
    title: t('components.courses.goals.description.placeholder'),
    errorDescription: true,
    errorKeyWord: true,
    local: true,
    contentData: {
      description: '',
      keyWord: '',
      index: localData.value.length,
    },
  };
  localData.value.push(newGoal);
  selectedPanel.value = localData.value.length - 1;
};
const onCancel = () => {
  console.log('propsdata', props.data);
  console.log('local', localData.value);
  // localData.value = [...props.data];
};
const onSave = async () => {
  await client(`/learningplans/${props.courseId}/goals`, {
    method: 'PUT',
    body: {
      goals: localData.value.map((item) => ({
        verb: item.keyWord,
        description: item.title,
        keywordId: item.contentData.keyWordId,
        ...(!item.local && { id: item.contentData.id }),
      })),
    },
    onResponse: ({ response }) => {
      if (!response.ok) {
        setMessage('Algo deu errado ao salvar as alterações', 'red', true);
        localData.value = [...props.data];
      }
      emit('update', t('components.courses.goals.update'));
    },
  });
};

// watch(canEdit, () => {
//   isEditing.value = props.canEdit;
// });
watch(
  localData,
  () => {
    toggleSave();
  },
  { deep: true },
);
</script>
<style scoped lang="scss">
.gap-2 {
  gap: 8px;
}

.gap-4 {
  gap: 16px;
}

.add-button {
  text-transform: none;
  border: 1px dashed var(--cinza-cinza-600, #6e7a87);
}
</style>
