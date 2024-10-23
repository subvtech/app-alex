<template>
  <alex-custom-card
    :title="$t('components.courses.goals.title')"
    is-nested
    hide-dividers
    show-tooltip
    :disable-save="disableSave"
    :is-editing="isEditingAndCanEdit"
    :tooltip-extra-class="isEditing ? 'mt-3' : ''"
    :tooltip="tooltip"
    :small-buttons="withinBreakpoint"
    :no-icon="canEdit"
    @click:save="onSave"
    @click:cancel="onCancel"
    @toggle:is-editing="toggleEditing"
  >
    <template #content>
      <alex-custom-empty-placeholder
        v-if="localData.length === 0 && !isEditing"
        class="align-self-center"
        :empty-text-message="$t('components.courses.goals.empty')"
        empty-text-image="/svg/EmptyGoals.svg"
      />
      <div v-if="isEditing" class="d-flex flex-column w-100 gap-4 align-center">
        <alex-custom-accordion
          v-if="localData.length > 0"
          v-model="selectedPanel"
          v-model:data="localData"
          show-positions
          :overwrite-item="!isEditing"
        >
          <template v-if="isEditing" #content="{ index }">
            <alex-learningplan-form-goal
              :index="index"
              :data="localData"
              :filtered-items="generalVerbs || []"
              @error:description="onErrorDescription"
              @error:keyword="onErrorKeyword"
              @success:description="onSuccessDescription"
              @success:keyword="onSuccessKeyword"
            /> </template
        ></alex-custom-accordion>
        <alex-custom-button
          class="add-button w-100 mt-5"
          prepend-icon="mdi-plus"
          variant="text"
          size="large"
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
export type Goal = {
  id?: number;
  title: string; // Description
  keyWord: string; // Verb
  local?: boolean;
  errorKeyWord: boolean;
  errorDescription: boolean;
  contentData: {
    id?: number;
    index: number;
    description: string; // Title
    verb: { text: string; id?: number; general: boolean };
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
const localData = ref(props.data);
const disableSave = ref(true);
const isEditing = ref(false);
const selectedPanel = ref(0);
const withinBreakpoint = computed(() => currentWidth.value < 450);
const isEditingAndCanEdit = computed(() => props.canEdit && isEditing.value);
const lastGoals = ref<Goal[]>([]);
const { find } = useStrapiUtils();
const { data: generalVerbs } = useAsyncData(
  'general-verbs',
  async () =>
    await find<LearningPlanGoalVerb>('learning-goal-verbs', {
      filters: {
        general: true,
      },
    }),
  { transform: (value) => value.data },
);
const setLastGoals = () => {
  lastGoals.value = toRaw(localData.value.map((g) => Object.assign({}, g)));
};
const toggleEditing = () => {
  isEditing.value = !isEditing.value;
  if (isEditing.value) {
    setLastGoals();
  }
};

const isEmpty = (value: string) => value.trim().length === 0;

const toggleSave = () => {
  const errorFound = localData.value.find(
    (item) =>
      item.errorDescription ||
      item.errorKeyWord ||
      isEmpty(item?.contentData?.description ?? item?.description ?? '') ||
      isEmpty(item?.contentData?.verb?.text ?? item?.verb?.text ?? ''),
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
const addGoal = () => {
  const newGoal = {
    keyWord: t('components.courses.goals.verb.placeholder'),
    title: t('components.courses.goals.description.placeholder'),
    errorDescription: true,
    errorKeyWord: true,
    local: true,
    contentData: {
      description: '',
      keyWord: null,
      index: localData.value.length,
      verb: {
        text: null,
        general: false,
      },
    },
  };
  localData.value = [...localData.value, newGoal];
  selectedPanel.value = localData.value.length - 1;
};
const onCancel = () => {
  localData.value = lastGoals.value;
  isEditing.value = false;
};
const onSave = async () => {
  await client(`/learningplans/${props.courseId}/goals`, {
    method: 'PUT',
    body: {
      goals: localData.value.map((item, index) => ({
        index,
        verb: {
          text: item.keyWord,
          id: item?.contentData?.verb?.id ?? item?.verb?.id,
          general: item?.contentData?.verb?.general ?? item?.verb?.general,
        },
        description: item.title,
        author: props.userId,
        ...(!item.local && { id: item?.contentData?.id ?? item?.id }),
      })),
      userID: props.userId,
    },
    onResponse: ({ response }) => {
      if (!response.ok) {
        localData.value = [...props.data];
        setMessage('Algo deu errado ao salvar as alterações', 'red', true);
        return;
      }
      emit('update', t('components.courses.goals.update'));
    },
  });

  isEditing.value = false;
};
watch(
  () => props.data,
  (val) => {
    localData.value = val;
  },
);
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
