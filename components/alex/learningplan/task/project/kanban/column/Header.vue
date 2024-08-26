<template>
  <div
    class="tw-rounded-lg border-1 border-gray-100 bg-white tw-select-none"
    @mouseover="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <div
      class="tw-flex-fill tw-h-1 tw-rounded-t-xl"
      :class="selectedColor"
    ></div>
    <div class="tw-flex tw-align-center tw-mt-1 tw-py-3 tw-px-4">
      <input
        ref="input"
        v-model="titleValue"
        type="text"
        class="tw-w-full text-h5 tw-text-gray-800 tw-border-none tw-outline-none tw-min-h-[30px]"
        @focus="toggleEdit"
        @keydown.enter="handleKeyEnter"
        @blur="handleTitleChange"
      />

      <div v-if="!isEditing" key="options" class="tw-flex tw-gap-1">
        <span
          v-if="!isHovering && !showOptions"
          class="tw-flex tw-items-center tw-justify-center tw-pt-[1px] tw-bg-gray-100 tw-rounded-lg tw-min-h-6 tw-min-w-6"
          >{{ quantity }}</span
        >
        <alex-custom-button
          :class="{ '!tw-hidden': !isHovering && !showOptions }"
          icon="mdi-plus"
          variant="text"
          size="small"
          @click="$emit('add')"
        />
        <alex-custom-dropdown
          v-model="showOptions"
          :close-on-content-click="false"
          :class="{ '!tw-hidden': !isHovering && !showOptions }"
          :items="items"
        >
          <template #activator="{ props: propsActivator }">
            <alex-custom-button
              :class="{ '!tw-hidden': !isHovering && !showOptions }"
              icon="mdi-dots-vertical"
              variant="text"
              size="small"
              v-bind="propsActivator"
            />
          </template>
        </alex-custom-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlexDropdownItem } from '~/components/alex/custom/Dropdown.vue';

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
  delete: [];
  add: [];
};
const props = withDefaults(defineProps<ColumnHeader>(), {
  edit: false,
  color: 'gray-600',
  quantity: 0,
});
const emit = defineEmits<Emit>();
// static
const colors = {
  orange: ' bg-warning-0',
  gray: ' bg-gray-300',
  'gray-600': ' bg-gray-600',
  blue: ' bg-info-0',
  green: ' bg-success-0',
};
const items: AlexDropdownItem[] = [
  { text: 'Edit', icon: 'mdi-pencil', onClick: () => handleInput() },
  {
    text: 'Delete',
    icon: 'mdi-delete',
    warning: true,
    onClick: () => emit('delete'),
  },
];
// refs
const isHovering = ref(false);
const showOptions = ref(false);
const isEditing = ref(props.edit);
const titleValue = ref(props.title);
const input = ref<HTMLInputElement | null>(null);
// computed
const selectedColor = computed(() => colors[props.color] || colors.gray);

// methods
const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};
const handleKeyEnter = () => {
  if (input.value) {
    input.value.blur();
    toggleEdit();
  }
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
  isEditing.value = false;
};
const handleInput = () => {
  if (input.value) {
    input.value.focus();
    showOptions.value = false;
  }
};
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
