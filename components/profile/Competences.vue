<template>
  <profile-card
    :title="title"
    :isEditing="isEditing && canEdit"
    @toggle:isEditing="isEditing = !isEditing"
    :showIcon="canEdit"
    :cancel="onCancel"
    :save="onSave"
    full-width
  >
    <template v-slot:content>
      <div class="footer d-flex flex-column">
        <div v-if="isEditing" class="d-flex flex-column" style="gap: 8px">
          <span>{{ label }}</span>
          <v-autocomplete
            :placeholder="placeholder"
            :items="filteredTags"
            item-title="text"
            variant="outlined"
            hide-details
            hide-no-data
            @update:model-value="populateSelectedTags"
            @input="handleInput"
            @keydown.enter.stop="populateSelectedTags"
            v-model="selectedTag"
            return-object
          >
          </v-autocomplete>
        </div>

        <div class="competences d-flex flex-column align-start">
          <div :key="rerender" class="d-flex flex-wrap justify-center">
            <alex-custom-chip
              v-if="
                selectedTags.length !== 0 &&
                selectedTags.some((item) => !item.isDeleted)
              "
              v-for="(tag, index) in selectedTags"
              :key="index"
              :text="tag.text"
              variant="outlined"
              color="#000"
              :closable="isEditing"
              @click:close="isEditing ? removeItem(tag) : () => {}"
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
  </profile-card>
</template>

<script setup lang="ts">
const { create, find, update, delete: _delete } = useStrapi();

const client = useStrapiClient();
const emit = defineEmits(['update:user']);
type Tag = {
  text: string;
  id: number;
  verified_by: any;
  isGeneral: boolean;
  isDeleted?: boolean;
};

const props = defineProps({
  userTags: {
    type: Array as PropType<Tag[]>,
    default: () => [],
  },
  title: {
    type: String,
    required: true,
  },
  label: {
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
  isGeneral: {
    type: Boolean,
    default: false,
  },
  canEdit: { type: Boolean, required: true },
});

const { canEdit, userId, isGeneral } = toRefs(props);
const isEditing = ref(false);
const selectedTag = ref<Tag | null>(null);
const allTags = ref<Tag[]>([]);
const filteredTags = ref<Tag[]>([]);
const userTagsIds = ref<number[]>([]);
const selectedTags = ref<Tag[]>([]);
const rerender = ref(0);

onBeforeMount(async () => {
  const data = await find('tags', { populate: 'verified_by' });

  userTagsIds.value = props.userTags.map((item) => item.id);
  //selectedTags.value = [...props.userTags];
  selectedTags.value = props.userTags.map((item) => {
    return { ...item, isDeleted: false };
  });

  allTags.value = data.data.map((item) => {
    return { ...item.attributes!, id: item.id };
  }) as Tag[];

  filterTags();
});
const createArray = ref<Tag[]>([]);
const updateArray = ref<Tag[]>([]);
const deleteArray = ref<Tag[]>([]);

const populateSelectedTags = (newValue) => {
  newValue.isDeleted = false;
  if (!selectedTag.value && newValue.id) {
    updateTags(newValue);
  } else if (
    selectedTag.value &&
    selectedTag.value.text &&
    selectedTag.value.text.length > 2
  ) {
    updateTags(selectedTag.value, true);
  }
  selectedTag.value = null;
};

const removeItem = (tag) => {
  if (props.userTags.find((item) => item.text === tag.text)) {
    if (tag.id) deleteArray.value.push(tag);
    selectedTags.value[
      selectedTags.value.findIndex((item) => item.text === tag.text)
    ].isDeleted = true;
  }

  createArray.value = createArray.value.filter(
    (item) => item.text !== tag.text,
  );

  updateArray.value = updateArray.value.filter(
    (item) => item.text !== tag.text,
  );

  filteredTags.value.push(tag);
  selectedTag.value = null;
};

const handleInput = (e) => {
  if (e.target.value.length > 1)
    selectedTag.value = { text: e.target.value } as Tag;
};

const onCancel = async () => {
  selectedTags.value = props.userTags.map((item) => {
    return { ...item, isDeleted: false };
  });

  filterTags();
  deleteArray.value = [];
  updateArray.value = [];
  createArray.value = [];
  rerender.value += 1;
};

const onSave = async () => {
  const promises: Promise<any>[] = [];
  const ids = allTags.value.map((item) => item.id);
  if (createArray.value.length !== 0)
    createArray.value
      .filter((item) => !ids.includes(item.id))
      .forEach((item) => {
        promises.push(
          create('tags', {
            ...item,
            verified_by: userId.value,
            isGeneral: isGeneral.value,
          }),
        );
      });
  if (updateArray.value.length !== 0)
    updateArray.value
      .filter((item) => !userTagsIds.value.includes(item.id))
      .forEach((item) => {
        promises.push(
          update(`tags/${item.id}`, {
            verified_by: item.verified_by.data
              ? [item.verified_by.data, userId.value]
              : [userId.value],
          }),
        );
      });
  if (deleteArray.value.length !== 0)
    deleteArray.value.forEach((element) => {
      selectedTags.value = selectedTags.value.filter(
        (item) => item.text !== element.text,
      );
      userTagsIds.value = userTagsIds.value.filter((id) => id !== element.id);
      promises.push(
        client(`/users/${props.userId}`, {
          method: 'PUT',
          body: {
            data: {
              tags: userTagsIds,
            },
          },
        }),
      );
    });
  await Promise.all(promises);
  deleteArray.value = [];
  updateArray.value = [];
  createArray.value = [];
  emit('update:user');
};

const updateTags = (tag, isCreating = false) => {
  if (tag.isDeleted) return;
  selectedTags.value.push(tag);
  filteredTags.value = filteredTags.value.filter(
    (item) => item.text !== tag.text,
  );
  if (isCreating) createArray.value.push(tag);
  else updateArray.value.push(tag);
};

const filterTags = () => {
  if (isGeneral.value) {
    filteredTags.value = allTags.value.filter(
      (item) => !userTagsIds.value.includes(item.id) && item.isGeneral,
    );
  } else {
    filteredTags.value = allTags.value.filter(
      (item) => !userTagsIds.value.includes(item.id) && !item.isGeneral,
    );
  }
};

watch(
  () => selectedTags.value,
  () => {
    selectedTag.value = null;
  },
  { deep: true },
);
</script>

<style scoped lang="scss">
.footer {
  gap: 12px;

  .competences {
    gap: 8px;

    div {
      gap: 8px;
    }
  }
}
</style>
