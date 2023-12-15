<template>
  <alex-custom-card
    :title="$t('components.courses.goals.title')"
    is-nested
    hide-dividers
    show-tooltip
    :is-editing="isEditing"
    @toggle:is-editing="isEditing = !isEditing"
    :save="onSave"
    :cancel="onCancel"
    :tooltip="tooltip"
  >
    <template #content>
      <alex-custom-empty-placeholder
        v-if="dataCopy.length === 0"
        :empty-text-message="$t('components.courses.goals.empty')"
        empty-text-image="/svg/EmptyGoals.svg"
      />
      <div v-if="isEditing" class="d-flex flex-column w-100 gap-4">
        <alex-custom-accordion
          :data="dataCopy"
          :key="rerender"
          show-positions
          :overwrite-item="!isEditing"
          class="max-width"
        >
          <template v-if="isEditing" #content="temp">
            <courses-form-goal
              :keyword="temp.verb"
              :index="temp.index"
              :id="temp.id"
              :description="temp.description"
              :filtered-items="filteredVerbs"
              @success="onSuccess"
            /> </template
        ></alex-custom-accordion>
        <alex-custom-button
          @click="addGoal"
          class="add-button"
          prepend-icon="mdi-plus"
          variant="text"
        >
          {{ $t('components.courses.goals.add') }}</alex-custom-button
        >
      </div>
      <div v-else class="d-flex flex-column gap-2 w-100">
        <courses-goal
          v-for="(item, index) in data"
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

  data: {
    type: Array as PropType<
      {
        id?: number;
        title: string;
        keyWord: string;
        keyWordId: number;
        contentData: {
          description: string;
          verb: { text: string } | null;
          index?: number;
          id: number;
        };
      }[]
    >,
    default: [],
  },
});
const emit = defineEmits(['update']);

type Keyword = { text: string; id?: number };

const updateArray = ref<
  { id: number; index: number; keyWord: Keyword; description: string }[]
>([]);
const createArray = ref<
  { id: number; index: number; keyWord: Keyword; description: string }[]
>([]);
const deleteArray = ref<{ id: number; text: string }[]>([]);

const { canEdit, data } = toRefs(props);
const isEditing = toRef(props.canEdit);

const rerender = ref(0);
const filteredVerbs = ref<{ text: string; id: number }[]>([]);
const dataCopy = toRef([...props.data]);

onBeforeMount(async () => {
  filteredVerbs.value = (
    (await find('verbs', { filters: { isPublic: true } }))
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
    contentData: {
      verb: null,
      description: '',
      index: dataCopy.value.length,
      id: -1,
    },
  });
};
const onSuccess = (goal) => {
  if (goal.id >= 0) {
    const index = updateArray.value.findIndex((item) => item.id == goal.id);
    if (index !== -1) updateArray.value[index] = goal;
    else {
      updateArray.value.push(goal);
    }
  } else {
    const index = createArray.value.findIndex(
      (item) => item.index == goal.index,
    );
    if (index !== -1) createArray.value[index] = goal;
    else {
      createArray.value.push(goal);
    }
  }
};

const onCancel = () => {
  dataCopy.value = [...props.data];
  updateArray.value = [];
  createArray.value = [];
  deleteArray.value = [];
};

const onSave = async () => {
  const promises: Promise<any>[] = [];
  const getConnectArray = async (connectId, keyWord) => {
    if (typeof connectId === 'number') return [connectId];
    const doesVerbExist = await find('verbs', {
      filters: { text: keyWord.text },
    });

    if (doesVerbExist.data.length > 0) return [doesVerbExist.data[0].id];
    const createdVerb = await create('verbs', {
      ...keyWord,
      isPublic: false,
    });
    return [createdVerb.data.id];
  };

  const createPromises = createArray.value.map(async (item, index) => {
    const connectArray = await getConnectArray(item.keyWord.id, item.keyWord);

    return create('goals', {
      description: item.description,
      learningplan: props.courseId,
      verb: {
        connect: connectArray,
      },
    }).then((result) => {
      const currentIndex = dataCopy.value.findIndex(
        (obj) => obj.contentData.index === item.index,
      );
      dataCopy.value[currentIndex].id = result.data.id;
    });
  });

  const updatePromises = updateArray.value.map(async (item) => {
    const connectArray = await getConnectArray(item.keyWord.id, item.keyWord);

    return update(`goals/${item.id}`, {
      description: item.description,
      verb: {
        connect: connectArray,
      },
    });
  });

  const deletePromises = props.data
    .filter((x) => dataCopy.value.findIndex((y) => y.id === x.id) === -1)
    .map(async (item) => {
      return _delete('goals', item.id);
    });

  promises.push(...createPromises, ...updatePromises, ...deletePromises);

  await Promise.all(promises);

  await update('learningplans', props.courseId, {
    goals: dataCopy.value.map((item) => item.id),
  });
  emit('update', { message: t('components.courses.goals.update') });
  rerender.value -= 1;
  updateArray.value = [];
  createArray.value = [];
  deleteArray.value = [];
};

watch(canEdit, () => {
  isEditing.value = props.canEdit;
});
watch(data, () => {
  dataCopy.value = props.data;
});
</script>
<style scoped lang="scss">
.max-width {
  max-width: 404px;
}
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
