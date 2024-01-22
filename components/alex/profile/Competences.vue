<template>
  <alex-custom-card
    :title="title"
    :isEditing="isEditing && canEdit"
    @toggle:isEditing="isEditing = !isEditing"
    :showIcon="canEdit"
    :cancel="onCancel"
    :save="onSave"
    align-content="align-start"
    show-tooltip
    :tooltip="
      isGeneral
        ? $t('components.competences.general.tooltip')
        : $t('components.competences.technical.tooltip')
    "
    full-width
  >
    <template v-slot:content>
      <div class="gap-3 d-flex flex-column w-100">
        <div v-if="isEditing" class="d-flex flex-column gap-2">
          <alex-inputs-autocomplete
            name="competences"
            :search="search"
            :placeholder="placeholder"
            :filteredItems="filteredTags"
            :update-items="updateTags"
          />
        </div>

        <div class="d-flex flex-column align-start gap-2">
          <div :key="rerender" class="d-flex flex-wrap justify-center gap-2">
            <alex-custom-chip
              v-if="selectedTags.length !== 0"
              v-for="(tag, index) in selectedTags"
              :key="index"
              :text="tag.text"
              variant="outlined"
              color="#000"
              :closable="isEditing"
              @click:close="isEditing ? removeItem(tag) : () => {}"
              :uncloseable="isEditing"
            />
            <alex-custom-chip
              v-else
              variant="outlined"
              color="#000"
              :text="emptyMessage"
            />
          </div>
        </div>
      </div>
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
const { create, find, update, delete: _delete } = useStrapi();

const { t } = useI18n();
const client = useStrapiClient();
const emit = defineEmits(['update', 'fetch']);
const { setMessage } = useMessageStore();
export type CompetenceTag = {
  text: string;
  id?: number;
  verified_by: any;
  isGeneral: boolean;
};

const props = defineProps({
  userTags: {
    type: Array as PropType<CompetenceTag[]>,
    default: () => [],
  },
  title: {
    type: String,
    required: true,
  },
  emptyMessage: { type: String, required: true },
  placeholder: {
    type: String,
    required: true,
  },
  userId: {
    type: Number,
    required: true,
  },
  learningPlanId: {
    type: Number,
  },
  isGeneral: {
    type: Boolean,
    default: false,
  },
  canEdit: { type: Boolean, default: false },
});

const { canEdit } = toRefs(props);
const isEditing = ref(false);

const search = ref('');
const selectedTag = ref<CompetenceTag | null>(null);
const filteredTags = ref<CompetenceTag[]>([]);
const forbiddenTags = ref<CompetenceTag[]>([]);
const allTags = ref<any>([]);

const userTagsIds = ref<number[]>([]);
const selectedTags = ref<CompetenceTag[]>([]);
const rerender = ref(0);

function filterTags(
  data: any[],
  isGeneral: boolean,
  ids: number[] = [],
): CompetenceTag[] {
  return data
    .filter(
      (item) => (item.attributes as CompetenceTag).isGeneral === isGeneral,
    )
    .filter((item) => !ids.includes(item.id))
    .map((item, index) => {
      return { ...item.attributes, id: item.id };
    }) as CompetenceTag[];
}

onBeforeMount(async () => {
  allTags.value = await find('tags', {
    populate: 'verified_by',
    filters: {
      isPublic: true,
    },
  });
  userTagsIds.value = props.userTags.map((item) => item.id!);

  selectedTags.value = props.userTags.map((item) => {
    return { ...item };
  });

  forbiddenTags.value = filterTags(allTags.value.data, !props.isGeneral);
  filteredTags.value = filterTags(
    allTags.value.data,
    props.isGeneral,
    userTagsIds.value,
  );
});
const createArray = ref<CompetenceTag[]>([]);
const updateArray = ref<CompetenceTag[]>([]);
const deleteArray = ref<CompetenceTag[]>([]);

const removeItem = (tag) => {
  selectedTags.value = selectedTags.value.filter(
    (item) => item.text !== tag.text,
  );
  if (tag.id) deleteArray.value.push(tag);
  createArray.value = createArray.value.filter(
    (item) => item.text !== tag.text,
  );

  updateArray.value = updateArray.value.filter(
    (item) => item.text !== tag.text,
  );

  filteredTags.value.push(tag);
  selectedTag.value = null;
};

const onCancel = async () => {
  selectedTags.value = props.userTags.map((item) => {
    return { ...item };
  });
  filteredTags.value = filterTags(
    allTags.value.data,
    props.isGeneral,
    userTagsIds.value,
  );
  deleteArray.value = [];
  updateArray.value = [];
  createArray.value = [];
  rerender.value += 1;
};

const onSave = async () => {
  const promises: Promise<any>[] = [];

  const ids = forbiddenTags.value
    .map((item) => item.id)
    .concat(userTagsIds.value);
  if (createArray.value.length !== 0)
    createArray.value
      .filter((item) => !ids.includes(item.id))
      .forEach((item) => {
        promises.push(
          create('tags', {
            ...item,
            verified_by: props.userId,
            isGeneral: props.isGeneral,
            isPublic: false,
            learningplans: props.learningPlanId
              ? {
                  connect: [props.learningPlanId],
                }
              : undefined,
          }),
        );
      });
  if (updateArray.value.length !== 0)
    updateArray.value
      .filter((item) => !ids.includes(item.id))
      .forEach((item) => {
        promises.push(
          update(`tags/${item.id}`, {
            verified_by: {
              connect: [props.userId],
            },
          }),
        );
      });
  if (deleteArray.value.length !== 0) {
    deleteArray.value.forEach((element) => {
      selectedTags.value = selectedTags.value.filter(
        (item) => item.text !== element.text,
      );
    });
    promises.push(
      client(`/users/${props.userId}`, {
        method: 'PUT',
        body: {
          tags: {
            disconnect: deleteArray.value.map((item) => item.id),
          },
        },
      }),
    );
    if (props.learningPlanId) {
      promises.push(
        update(`learningplans/${props.learningPlanId}`, {
          tags: {
            disconnect: deleteArray.value.map((item) => item.id),
          },
        }),
      );
    }
  }

  deleteArray.value = [];
  updateArray.value = [];
  createArray.value = [];
  userTagsIds.value = selectedTags.value.map((item) => item.id!);

  if (promises.length > 0) {
    await Promise.all(promises);
    emit(
      'update',
      t(
        `components.competences.${
          props.isGeneral ? 'general' : 'technical'
        }.updated`,
      ),
    );
  }
  rerender.value -= 1;
};

const updateTags = (tag, isCreating = false) => {
  if (
    isCreating &&
    forbiddenTags.value.find((item) => item.text === tag.text)
  ) {
    setMessage(t('components.competences.duplicatedText'), 'warning', true);
    return;
  }
  filteredTags.value = filteredTags.value.filter(
    (item) => item.text !== tag.text,
  );
  deleteArray.value = deleteArray.value.filter(
    (item) => item.text !== tag.text,
  );
  const indexFound = selectedTags.value
    .map((item) => item.text)
    .indexOf(tag.text);

  if (indexFound !== -1) {
    setMessage(t('components.competences.alreadyAdded'), 'warning', true);

    return;
  }
  selectedTags.value.push(tag);
  if (isCreating) createArray.value.push(tag);
  else updateArray.value.push(tag);
  selectedTag.value = null;
};

watch(
  () => selectedTags.value,
  () => {
    selectedTag.value = null;
  },
  { deep: true },
);

watch(search, () => {
  emit('fetch');
});
</script>

<style scoped lang="scss">
.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}
</style>
