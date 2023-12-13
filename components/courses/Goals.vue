<template>
  <alex-custom-card
    :title="$t('components.courses.goals.title')"
    is-nested
    hide-dividers
    show-tooltip
    :is-editing="isEditing"
    @toggle:is-editing="isEditing = !isEditing"
    :save="() => {}"
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
          show-positions
          :overwrite-item="!isEditing"
          class="max-width"
        >
          <template v-if="isEditing" #content="{ keyWord, title }">
            <courses-accordion-goal
              :keyword="keyWord"
              :description="title"
              @success="() => {}"
            /> </template
        ></alex-custom-accordion>
        <courses-add-button :action="addGoal" />
      </div>
      <div v-else class="d-flex flex-column gap-2 w-100">
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

  data: {
    type: Array as PropType<{ keyWord: string; title: string }[]>,
    default: [],
  },
});

const { canEdit, data } = toRefs(props);
const isEditing = toRef(props.canEdit);

const componentKey = ref(0);
const dataCopy = toRef(props.data);

const addGoal = () => {
  dataCopy.value.push({ keyWord: 'temp', title: 'temp2' });
  console.log({ data: data.value });
};

const onCancel = () => {
  dataCopy.value = props.data;
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
</style>
