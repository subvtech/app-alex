<template>
  <profile-card
    :title="title"
    :isEditing="isEditing && canEdit"
    @toogle:isEditing="isEditing = !isEditing"
    :cancel="onCancel"
    :save="onSave"
    :full-width="true"
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
          <div class="d-flex flex-wrap justify-center">
            <div
              v-for="tag in selectedTags"
              class="item d-flex justify-center align-center"
            >
              <span>{{ tag.text }}</span>
              <v-icon
                v-if="isEditing"
                size="16"
                color="#6E7A87"
                @click="removeItem(tag)"
                style="cursor: pointer"
                >mdi-close</v-icon
              >
            </div>
          </div>
        </div>
      </div>
    </template>
  </profile-card>
</template>

<script setup lang="ts">
const { create, find, update, delete: _delete } = useStrapi();

const client = useStrapiClient();
type Tag = { text: string; id: number; verified_by: any; isGeneral: boolean };

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
  placeholder: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  isGeneral: {
    type: Boolean,
    default: false,
  },
  canEdit: { type: Boolean, required: true },
});

const { userTags, canEdit, id, isGeneral } = toRefs(props);
const isEditing = ref(false);

const selectedTags = ref<{ text: string }[]>([]);
const selectedTag = ref<Tag | null>(null);
const allTags = ref<Tag[]>([]);
const filteredTags = ref<Tag[]>([]);

const userTagsIds = ref<number[]>([]);

onMounted(async () => {
  const temp = await find(`tags`, { populate: 'verified_by' });

  userTagsIds.value = userTags.value.map((item) => item.id);
  allTags.value = temp.data.map((item) => {
    return { ...item.attributes!, id: item.id };
  }) as Tag[];

  if (isGeneral.value) {
    selectedTags.value = userTags.value.filter((item) => item.isGeneral);
    filteredTags.value = allTags.value.filter(
      (item) => !userTagsIds.value.includes(item.id) && item.isGeneral,
    );
  } else {
    selectedTags.value = userTags.value.filter((item) => !item.isGeneral);
    filteredTags.value = allTags.value.filter(
      (item) => !userTagsIds.value.includes(item.id) && !item.isGeneral,
    );
  }
});
const createArray = ref<Tag[]>([]);
const updateArray = ref<Tag[]>([]);
const deleteArray = ref<Tag[]>([]);

const populateSelectedTags = (newValue) => {
  const updateTags = (tag, isCreating = false) => {
    if (selectedTags.value.find((item) => item.text === tag.text)) return;
    selectedTags.value.push(tag);
    filteredTags.value = filteredTags.value.filter(
      (item) => item.text !== tag.text,
    );
    if (isCreating) createArray.value.push(tag);
    else updateArray.value.push(tag);
  };

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
  if (userTags.value.find((item) => item.id === tag.id)) {
    deleteArray.value.push(tag);
  }
  selectedTags.value = selectedTags.value.filter(
    (item) => item.text !== tag.text,
  );

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
  selectedTags.value = userTags.value;
  deleteArray.value = [];
  updateArray.value = [];
  createArray.value = [];
};

const onSave = async () => {
  const promises: Promise<any>[] = [];
  const ids = allTags.value.map((item) => item.id);
  createArray.value
    .filter((item) => !ids.includes(item.id))
    .forEach((item) => {
      promises.push(
        create('tags', {
          ...item,
          verified_by: id.value,
          isGeneral: isGeneral.value,
        }),
      );
    });
  updateArray.value
    .filter((item) => !userTagsIds.value.includes(item.id))
    .forEach((item) => {
      promises.push(
        update(`tags/${item.id}`, {
          verified_by: item.verified_by.data
            ? item.verified_by.data.push(id.value)
            : [id.value],
        }),
      );
    });
  deleteArray.value.forEach((element) => {
    promises.push(
      client(`/users/${props.id}`, {
        method: 'PUT',
        body: {
          tags: userTags.value.filter((item) => item.id !== element.id),
        },
      }),
    );
  });
  await Promise.all(promises);
  deleteArray.value = [];
  updateArray.value = [];
  createArray.value = [];
};

watch(
  () => selectedTags,
  () => (selectedTag.value = null),
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
      .item {
        padding-inline: 8px;
        gap: 4px;
        height: 28px;
        border-radius: 8px;
        border: 1px solid var(--cinza-cinza-500, #8291a1);

        span {
          color: #6e7a87;
          /* Body/P3 */
          font-size: 14px;
          font-weight: 400;
          line-height: 135%; /* 18.9px */
          letter-spacing: 0.28px;
        }
      }
    }
  }
}
</style>
