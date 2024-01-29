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
    @keydown.enter="updateModelValue"
  />
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
type Tag = Partial<TagSimple> & {
  text: string;
  local?: true;
};

const emit = defineEmits(['update:modelValue']);
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
const selectedTags = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});
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
      selectedTags.value.find((selectedTag) => selectedTag.text !== text),
    );
    const local = items.value.filter((item) => item.local);
    items.value = [
      ...local,
      ...tags.data
        .map(({ id, isGeneral, text, isPublic }) => ({
          id,
          isGeneral,
          text,
          isPublic,
        }))
        .filter((item) => item.text !== local[0].text),
    ];
  }
});

const updateModelValue = () => {
  if (
    selectedTag.value &&
    !selectedTags.value.find((tag) => tag.text === selectedTag.value?.text)
  ) {
    selectedTags.value.push(selectedTag.value);
  }
  search.value = '';
  resetField();
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
