<template>
  <div class="tw-rounded-lg border-1 border-gray-100 bg-white tw-select-none">
    <div
      class="tw-flex-fill tw-h-1 tw-rounded-t-xl"
      :class="selectedColor"
    ></div>
    <TransitionGroup
      name="fade"
      tag="div"
      class="tw-flex tw-align-center tw-mt-1 tw-py-3 tw-px-4"
    >
      <input
        key="input"
        v-model="titleValue"
        type="text"
        class="flex-1-1 text-h5 tw-text-gray-800 tw-border-none tw-outline-none tw-min-h-[30px]"
        @focus="toggleEdit"
        @blur="handleTitleChange"
      />
      <span
        v-if="!isEditing"
        key="title"
        class="tw-flex tw-items-center tw-justify-center tw-pt-[1px] tw-bg-gray-100 tw-rounded-lg tw-h-7 tw-w-6"
        >{{ quantity }}</span
      >
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
export type Colors = 'orange' | 'green' | 'blue' | 'gray' | 'gray-600';
interface ColumnHeader {
  title: string;
  quantity?: number;
  color?: Colors;
  edit?: boolean;
}
type Emit = {
  'title-change': [title: string];
  'empty-title': [];
};
const props = withDefaults(defineProps<ColumnHeader>(), {
  edit: false,
  color: 'gray-600',
  quantity: 0,
});
const isEditing = ref(props.edit);
const colors = {
  orange: ' bg-warning-0',
  gray: ' bg-gray-300',
  'gray-600': ' bg-gray-600',
  blue: ' bg-info-0',
  green: ' bg-success-0',
};
const titleValue = ref(props.title);
const emit = defineEmits<Emit>();
const selectedColor = computed(() => colors[props.color] || colors.gray);
const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};
const handleTitleChange = () => {
  if (props.title === '' && titleValue.value === '') {
    emit('empty-title');
    isEditing.value = false;
    return;
  }
  if (titleValue.value !== props.title && titleValue.value !== '') {
    emit('title-change', titleValue.value);
    isEditing.value = false;
    return;
  }
  titleValue.value = props.title;
};
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
