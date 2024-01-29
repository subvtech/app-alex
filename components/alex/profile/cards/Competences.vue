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
            :items="filteredTags"
            :update-items="updateTags"
            return-object
            hide-no-data
            @update:model-value="addExistingTag"
            @input="handleInput"
            @keydown.enter.stop="createNewTag"
          />
        </div>

        <div class="d-flex flex-column align-start gap-2">
          <div :key="rerender" class="d-flex flex-wrap justify-center gap-2">
            <alex-custom-chip
              v-if="updatedSelectedTags.length !== 0"
              v-for="(tag, index) in updatedSelectedTags"
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
const { create, update, delete: _delete } = useStrapi();
const { find } = useStrapiUtils();

const { t } = useI18n();
const client = useStrapiClient();
const { setMessage } = useMessageStore();

const { timeSpan, timeoutId, stopTimeout } = useTimeout(500);
const { id } = useStrapiUser<User>().value;
export interface CompetencesComponentType {
  selectedTags: Tag[];
  title: string;
  emptyMessage: string;
  placeholder: string;
  relationId: number;
  learningplan?: boolean;
  isGeneral?: boolean;
  canEdit?: boolean;
}

export interface CompetencesEmits {
  (e: 'update'): void;
}

const emit = defineEmits<CompetencesEmits>();

const props = withDefaults(defineProps<CompetencesComponentType>(), {
  canEdit: false,
  learningplan: false,
  isGeneral: false,
});

const { canEdit } = toRefs(props);
const isEditing = ref(false);

const search = ref<string | null>(null);
const filteredTags = ref<Tag[]>([]);

const updatedSelectedTags = ref<Tag[]>([...props.selectedTags]);
const rerender = ref(0);

const handleInput = (input: any) => {
  if (input.data) search.value = input.target.value;

  stopTimeout();

  timeoutId.value = setTimeout(() => {
    fetchTags();
  }, timeSpan);
};

function filterTags(data: any[]): void {
  filteredTags.value = data
    .filter((item) => !userTagsIds.value.includes(item.id))
    .map((item, index) => {
      return { ...item, title: item.text, id: item.id };
    }) as Tag[];
}

const createArray = ref<Tag[]>([]);
const updateArray = ref<Tag[]>([]);
const deleteArray = ref<Tag[]>([]);

const fetchTags = async () => {
  const result = (
    await find('tags', {
      filters: {
        $or: [
          {
            verified_by: { id: { $in: [id] } },
          },
          {
            isPublic: true,
          },
        ],
        text: { $containsi: search.value },
        isGeneral: props.isGeneral,
      },
      populate: 'verified_by',
    })
  ).data;

  filterTags(result);
};

const removeItem = (tag) => {
  updatedSelectedTags.value = updatedSelectedTags.value.filter(
    (item) => item.text !== tag.text,
  );
  if (tag.id) deleteArray.value.push(tag);
  createArray.value = createArray.value.filter(
    (item) => item.text !== tag.text,
  );

  updateArray.value = updateArray.value.filter(
    (item) => item.text !== tag.text,
  );
  filteredTags.value.push({ ...tag, title: tag.text });
};

const onCancel = async () => {
  updatedSelectedTags.value = [...props.selectedTags];
  filterTags([...props.selectedTags]);
  deleteArray.value = [];
  updateArray.value = [];
  createArray.value = [];
  rerender.value += 1;
};

const userTagsIds = computed(() =>
  updatedSelectedTags.value.map((item) => item.id!),
);

const onSave = async () => {
  const promises: Promise<any>[] = [];

  if (createArray.value.length !== 0)
    createArray.value
      .filter((item) => !item.id)
      .forEach((item) => {
        const commonProps = {
          ...item,
          isGeneral: props.isGeneral,
          isPublic: false,
        };
        promises.push(
          create(
            'tags',
            props.learningplan
              ? {
                  ...commonProps,
                  learningplans: {
                    connect: [props.relationId],
                  },
                }
              : {
                  ...commonProps,
                  verified_by: {
                    connect: [props.relationId],
                  },
                },
          ),
        );
      });
  if (updateArray.value.length !== 0)
    updateArray.value
      .filter((item) => item.id)
      .forEach((item) => {
        const temp = props.learningplan
          ? {
              learningplans: { connect: [props.relationId] },
            }
          : {
              verified_by: {
                connect: [props.relationId],
              },
            };
        promises.push(update('tags', item.id, temp as any));
      });
  if (deleteArray.value.length !== 0) {
    deleteArray.value.forEach((element) => {
      updatedSelectedTags.value = updatedSelectedTags.value.filter(
        (item) => item.text !== element.text,
      );
    });

    promises.push(
      client(
        `${props.learningplan ? 'learningplans' : 'users'}/${props.relationId}`,
        {
          method: 'PUT',
          body: {
            tags: {
              disconnect: deleteArray.value.map((item) => item.id),
            },
          },
        },
      ),
    );
  }

  deleteArray.value = [];
  updateArray.value = [];
  createArray.value = [];

  if (promises.length > 0) {
    await Promise.all(promises);
    emit('update');
  }
  rerender.value -= 1;
};

const addExistingTag = (data) => {
  if (!data) return;

  updateTags(data);
};

const createNewTag = (data) => {
  if (!search.value || search.value === '') return;
  updateTags({ text: search.value }, true);
};

const updateTags = (tag, isCreating = false) => {
  if (
    isCreating &&
    updatedSelectedTags.value.find((item) => item.text === tag.text)
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
  const indexFound = updatedSelectedTags.value
    .map((item) => item.text)
    .indexOf(tag.text);

  if (indexFound !== -1) {
    setMessage(t('components.competences.alreadyAdded'), 'warning', true);

    return;
  }
  updatedSelectedTags.value.push(tag);
  if (isCreating) createArray.value.push(tag);
  else updateArray.value.push(tag);
};

watch(
  () => updatedSelectedTags.value,
  () => {
    search.value = null;
  },
  { deep: true },
);
</script>

<style scoped lang="scss">
.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}
</style>
