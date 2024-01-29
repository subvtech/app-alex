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
        v-if="dataCopy.length === 0"
        class="align-self-center"
        :empty-text-message="$t('components.courses.goals.empty')"
        empty-text-image="/svg/EmptyGoals.svg"
      />
      <div v-if="isEditing" class="d-flex flex-column w-100 gap-4 align-center">
        <alex-custom-accordion
          :key="rerender"
          v-model="selectedPanel"
          v-model:data="dataCopy"
          show-positions
          :overwrite-item="!isEditing"
        >
          <template v-if="isEditing" #content="contentProps">
            <alex-learningplan-form-goal
              :id="contentProps.id"
              :keyword="contentProps.verb"
              :index="contentProps.index"
              :description="contentProps.description"
              :filtered-items="filteredVerbs"
              @update:description="onUpdateDescription"
              @update:keyword="onUpdateKeyword"
              @error:description="onErrorDescription"
              @error:keyword="onErrorKeyword"
              @success:description="onSuccessDescription"
              @success:keyword="onSuccessKeyword"
              @success="onSuccess"
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
          v-for="(item, index) in data"
          :key="index"
          :index="index"
          :key-word="item.contentData.verb ? item.contentData.verb.text : ''"
          :title="item.contentData.description"
        />
      </div>
    </template>
  </alex-custom-card>
</template>
<script setup lang="ts">
const { create, find, update, delete: _delete } = useStrapi();
const { t } = useI18n();

type AccordionProps = {
  id?: number;
  title: string;
  keyWord: string;
  keyWordId: number;
  errorTitle: boolean;
  errorKeyWord: boolean;
  contentData: {
    description: string;
    verb: { text: string } | null;
    index?: number;
    id: number;
  };
};

const props = defineProps({
  canEdit: {
    type: Boolean,
    default: false,
  },
  tooltip: {
    type: String,
    required: true,
  },
  courseId: {
    type: Number,
    required: true,
  },
  userId: {
    type: Number,
    required: true,
  },

  data: {
    type: Array as PropType<AccordionProps[]>,
    default: () => [],
  },
});
const emit = defineEmits(['update']);
const { currentWidth } = useNavigationDrawer();
type Keyword = { text: string; id?: number };

const disableSave = ref(true);
const updateArray = ref<
  { id: number; index: number; keyWord: Keyword; description: string }[]
>([]);
const createArray = ref<
  { id: number; index: number; keyWord: Keyword; description: string }[]
>([]);
const deleteArray = ref<{ id: number; text: string }[]>([]);

const { canEdit, data } = toRefs(props);
const isEditing = ref(false);

const selectedPanel = ref(0);
const rerender = ref(0);
const filteredVerbs = ref<{ text: string; id: number }[]>([]);
const dataCopy = toRef<AccordionProps[]>([...props.data]);

const withinBreakpoint = computed(() => currentWidth.value < 450);

const isEditingAndCanEdit = computed(() => props.canEdit && isEditing.value);

const toggleDisableSave = () => {
  const errorFound = dataCopy.value.find(
    (item) => item.errorTitle || item.errorKeyWord,
  );

  if (errorFound) disableSave.value = true;
  else disableSave.value = false;
};

const onErrorDescription = (index) => {
  dataCopy.value[index].errorTitle = true;
  disableSave.value = true;
  toggleDisableSave();
};

const onErrorKeyword = (index) => {
  dataCopy.value[index].errorKeyWord = true;
  toggleDisableSave();
};

const onSuccessDescription = (index) => {
  dataCopy.value[index].errorTitle = false;
  disableSave.value = true;
  toggleDisableSave();
};

const onSuccessKeyword = (index) => {
  dataCopy.value[index].errorKeyWord = false;
  toggleDisableSave();
};

const onUpdateDescription = (data) => {
  dataCopy.value[data.index].title = data.value;
};
const onUpdateKeyword = (data) => {
  dataCopy.value[data.index].keyWord = data.value.text;
};
onBeforeMount(async () => {
  filteredVerbs.value = (
    (await find('learning-goal-verbs', { filters: { user: props.userId } }))
      .data as unknown as any[]
  ).map((item) => {
    return { id: item.id, ...item.attributes };
  });
});

const addGoal = () => {
  dataCopy.value.push({
    keyWord: t('components.courses.goals.verb.placeholder'),
    title: t('components.courses.goals.description.placeholder'),
    keyWordId: -1,
    id: -1,
    errorTitle: true,
    errorKeyWord: true,
    contentData: {
      verb: null,
      description: '',
      index: dataCopy.value.length,
      id: -1,
    },
  });
  selectedPanel.value = dataCopy.value.length - 1;
};
const onSuccess = (validGoal) => {
  if (validGoal.id >= 0) {
    const index = updateArray.value.findIndex(
      (item) => item.id === validGoal.id,
    );
    if (index !== -1) updateArray.value[index] = validGoal;
    else {
      updateArray.value.push(validGoal);
    }
  } else {
    const index = createArray.value.findIndex(
      (item) => item.index === validGoal.index,
    );
    if (index !== -1) createArray.value[index] = validGoal;
    else {
      createArray.value.push(validGoal);
    }
  }
};

const onCancel = () => {
  dataCopy.value = [...props.data];
  updateArray.value = [];
  createArray.value = [];
  deleteArray.value = [];
};

const getVerbConnectArray = async (keyWord) => {
  if (typeof keyWord.id === 'number') return [keyWord.id];
  const doesVerbExist = await find('learning-goal-verbs', {
    filters: { text: keyWord.text, user: props.userId },
  });

  if (doesVerbExist.data.length > 0) return [doesVerbExist.data[0].id];
  const createdVerb = await create('learning-goal-verbs', {
    ...keyWord,
    user: props.userId,
  });
  return [createdVerb.data.id];
};

const onSave = async () => {
  const createPromises = createArray.value.map(async (item) => {
    const connectArray = await getVerbConnectArray(item.keyWord);

    const result = await create('learning-goals', {
      description: item.description,
      learningplan: props.courseId,
      verb: {
        connect: connectArray,
      },
    });
    const currentIndex = dataCopy.value.findIndex(
      (obj) => obj.contentData.index === item.index,
    );
    dataCopy.value[currentIndex].id = result.data.id;
  });

  const updatePromises = updateArray.value.map(async (item) => {
    const connectArray = await getVerbConnectArray(item.keyWord);
    return update(`learning-goals/${item.id}`, {
      description: item.description,
      verb: {
        connect: connectArray,
      },
    });
  });

  const deletePromises = props.data
    .filter((x) => dataCopy.value.findIndex((y) => y.id === x.id) === -1)
    .map((item) => {
      return _delete('learning-goals', item.id);
    });

  await Promise.all([...createPromises, ...updatePromises, ...deletePromises]);

  let previousId: number | null = null;
  await update('learningplans', props.courseId, {
    learning_goals: {
      set: dataCopy.value.map((item, index) => {
        if (index === 0) {
          previousId = item.id!;
          return { id: item.id, position: { start: true } };
        }

        const afterId = previousId;
        previousId = item.id!;
        return { id: item.id, position: { after: afterId } };
      }),
    },
  });
  emit('update', t('components.courses.goals.update'));
  rerender.value -= 1;
  updateArray.value = [];
  createArray.value = [];
  deleteArray.value = [];
};

watch(canEdit, () => {
  isEditing.value = props.canEdit;
});
watch(data, () => {
  dataCopy.value = [...props.data];
});
watch(
  dataCopy,
  () => {
    toggleDisableSave();
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
