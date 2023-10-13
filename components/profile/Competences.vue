<template>
  <profile-card
    class="mb-6"
    :title="title"
    :isEditing="isEditing && canEdit"
    @toogle:isEditing="isEditing = !isEditing"
    :cancel="onCancel"
    :save="() => {}"
    :full-width="true"
  >
    <template v-slot:content>
      <div class="footer d-flex flex-column">
        <div v-if="isEditing" class="d-flex flex-column" style="gap: 8px">
          <span>{{ $t('components.profile.competences.technicalLabel') }}</span>
          <v-autocomplete
            placeholder="Digite uma competência"
            :items="[...tags]"
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
const props = defineProps({
  tags: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  title: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  canEdit: { type: Boolean, required: true },
});

const { tags, canEdit, id } = toRefs(props);
const isEditing = ref(false);

const selectedTags = ref<{ text: string }[]>([...tags.value]);
const selectedTag = ref<{ text: string; id?: number } | null>(null);
const allTags = ref<{ text: string; id?: number }[]>([]);
onMounted(async () => {
  const temp = await find(`tags?filters[verified_by][$nin]=${id.value}`, {});
  console.log({ id: id.value });
  console.log(temp);
});

const promises = ref<Promise<any>[]>([]);

const populateSelectedTags = (newValue) => {
  if (!selectedTag.value && newValue.text) {
    if (!selectedTags.value.find((item) => item.text === newValue.text))
      selectedTags.value.push(newValue);
  } else if (
    selectedTag.value &&
    selectedTag.value.text &&
    selectedTag.value.text.length > 2
  ) {
    if (
      !selectedTags.value.find((item) => item.text === selectedTag.value!.text)
    ) {
      selectedTags.value.push(selectedTag.value);
    }
  }
  selectedTag.value = null;
};

const removeItem = (text) => {
  console.log('removeItem');
  if (selectedTag.value && selectedTag.value.id) {
    promises.value.push(
      client(`/users/${props.id}`, {
        method: 'PUT',
        body: {
          user_descriptions: tags.value.filter(
            (item) => item.id !== selectedTag.value!.id,
          ),
        },
      }),
    );
  }
  selectedTags.value = selectedTags.value.filter((item) => item !== text);
  selectedTag.value = null;
};

const handleInput = (e) => {
  if (e.target.value.length > 1) selectedTag.value = { text: e.target.value };
};

const onCancel = () => {
  promises.value = [];
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
