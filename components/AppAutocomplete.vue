<template>
  <v-autocomplete
    :placeholder="placeholder"
    :items="filteredItems"
    item-title="text"
    variant="outlined"
    hide-details
    hide-no-data
    @update:model-value="populateSelectedTags(selectedTag)"
    @input="handleInput"
    @keydown.enter.stop="populateSelectedTags(selectedTag)"
    v-model="selectedTag"
    :menu-props="{ maxHeight: 200 }"
    return-object
  >
  </v-autocomplete>
</template>

<script setup lang="ts">
const props = defineProps({
  placeholder: {
    type: String,
    required: true,
  },
  filteredItems: {
    type: Array as PropType<any[]>,
    default: [],
  },
  updateItems: {
    type: Function,
    default: () => {},
  },
});

const selectedTag = ref<Tag | null>(null);

const handleInput = (e) => {
  if (e.target.value.length > 1)
    selectedTag.value = { text: e.target.value } as Tag;

};

const populateSelectedTags = (newValue) => {
  if (!newValue) return;

  if (!selectedTag.value && newValue.id) {
    props.updateItems(newValue);
  } else if (
    selectedTag.value &&
    selectedTag.value.text &&
    selectedTag.value.text.length > 2
  ) {
    props.updateItems(selectedTag.value, true);
  }
  selectedTag.value = null;
};
</script>

<style scoped lang="scss"></style>
