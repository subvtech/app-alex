<template>
  <alex-inputs-autocomplete
    v-model="selectedTag"
    v-model:search="search"
    item-title="text"
    variant="outlined"
    density="comfortable"
    return-object
    :items="filteredItems"
    :name="name"
    v-bind="$attrs"
    :no-data-text="'Adiciona novas competências'"
    @keydown.enter="selectOnEnter"
  />
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
type Tag = Partial<TagSimple> & {
  text: string;
  local?: true;
};
interface AutoCompleteUsersProps {
  name: string;
  modelValue: Tag[];
  isGeneral: boolean;
}

const props = withDefaults(defineProps<AutoCompleteUsersProps>(), {
  isGeneral: false,
});
const { find } = useStrapiUtils();
const search = ref('');
const items = ref<Tag[]>([]);
const { value: selectedTag, resetField } = useField<Tag | null>(
  () => props.name,
  undefined,
  {
    initialValue: null,
  },
);
const selectedTags = defineModel<Tag[]>({ required: true });
const filteredItems = computed(() => {
  const selectedTagsText = selectedTags.value.map((user) => user.text);
  return items.value.filter((item) => !selectedTagsText.includes(item.text));
});

useOnStopTyping(search, async () => {
  const tags = await find<TagSimple>('tags', {
    populate: 'verified_by',
    filters: {
      text: { $containsi: search.value },
      isPublic: true,
      isGeneral: props.isGeneral,
    },
  });
  if (tags.data.length) {
    tags.data.filter(({ text }) =>
      selectedTags.value.find(
        (selectedTag) => selectedTag.text.toLowerCase() !== text.toLowerCase(),
      ),
    );
    const local = items.value.find((item) => item.local);
    items.value = [
      ...tags.data.map(({ id, isGeneral, text, isPublic }) => ({
        id,
        isGeneral,
        text,
        isPublic,
      })),
    ];
    if (local && !items.value.some((tag) => tag.text === local.text)) {
      items.value = [local, ...items.value];
    }
  }
});

const updateModelValue = () => {
  if (
    selectedTag.value &&
    !selectedTags.value.find(
      (tag) => tag.text.toLowerCase() === selectedTag.value?.text.toLowerCase(),
    )
  ) {
    selectedTags.value = [...selectedTags.value, selectedTag.value];
  }
  search.value = '';
  resetField();
};

const selectOnEnter = () => {
  if (search.value.trim()) {
    selectedTag.value = { text: search.value, local: true };
    updateModelValue();
  }
};

watch(
  search,
  () => {
    const local = items.value.filter((item) => item?.local);
    if (search.value.trim().length) {
      if (!local.length) {
        items.value = [
          {
            text: search.value,
            isGeneral: props.isGeneral,
            local: true,
          },
          ...items.value,
        ];
      }
      items.value = items.value.map((item) => {
        if (item.local) return { ...item, text: search.value };
        return item;
      });
    }
  },
  { deep: true },
);

watch(selectedTag, updateModelValue);
</script>
