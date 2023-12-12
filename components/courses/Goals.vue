<template>
  <alex-custom-card
    :title="title"
    is-nested
    hide-dividers
    show-tooltip
    :is-editing="isEditing"
    @toggle:is-editing="isEditing = !isEditing"
    :save="() => {}"
    :tooltip="tooltip"
  >
    <template #content>
      <alex-custom-accordion
        v-if="isEditing"
        :data="data"
        show-positions
        :overwrite-item="!isEditing"
      >
        <template v-if="isEditing" #content="{ keyWord, title }">
          <alex-inputs-text-field
            placeholder="New keyWord"
            class="w-100"
            label="KeyWord"
            clearable
          />
          <alex-inputs-text-field
            placeholder="New title"
            class="w-100"
            label="title"
            clearable
          /> </template
      ></alex-custom-accordion>
      <div v-else class="d-flex flex-column gap-2">
        <courses-goal
          v-for="(item, index) in data"
          :index="index"
          :key-word="item.keyWord"
          :title="item.title"
        />
      </div>
    </template>
  </alex-custom-card>
</template>
<script setup lang="ts">
const props = defineProps({
  canEdit: {
    type: Boolean,
    default: false,
  },
  tooltip: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  data: {
    type: Array as PropType<{ keyWord: string; title: string }[]>,
    default: [],
  },
});
const { canEdit } = toRefs(props);
const isEditing = toRef(props.canEdit);

const componentKey = ref(0);

watch(canEdit, () => {
  isEditing.value = props.canEdit;
});
</script>
<style>
.gap-2 {
  gap: 8px;
}
</style>
