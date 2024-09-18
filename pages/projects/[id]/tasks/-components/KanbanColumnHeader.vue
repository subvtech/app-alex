<script setup lang="ts">
import { AlexDropdownItem as DropdownItem } from '@/components/alex/custom/Dropdown.vue';
import { AlexThemeColors } from '@/config/themes';
export type Colors = keyof typeof AlexThemeColors;

interface Props {
  color?: Colors;
  edit?: boolean;
  quantity?: number;
  title: string;
  disabledInterations?: boolean;
  loading?: boolean;
}

type Events = {
  'empty-title': [];
  'title-change': [title: string];
  add: [];
  delete: [];
};

const props = withDefaults(defineProps<Props>(), {
  color: 'gray-600',
  edit: false,
  quantity: 0,
  disabledInterations: false,
  loading: false,
});

const emit = defineEmits<Events>();

const items: DropdownItem[] = [
  {
    text: 'Edit',
    icon: 'mdi-pencil',
    onClick: () => handleInput(),
  },
  {
    text: 'Delete',
    icon: 'mdi-delete',
    warning: true,
    onClick: () => emit('delete'),
  },
];

const isHovering = ref(false);
const showOptions = ref(false);
const isEditing = ref(props.edit);
const titleValue = ref(props.title);
const input = ref<HTMLInputElement | null>(null);

const selectedColor = computed(() => props.color || AlexThemeColors['gray-300']);

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
    titleValue.value = titleValue.value.trim();
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

<template>
  <div
    class="tw-rounded-lg border-1 border-gray-100 bg-white tw-select-none"
    @mouseover="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <v-progress-linear class="tw-rounded-t-xl" model-value="100" :indeterminate="loading" :color="selectedColor" />
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
      <div v-if="!isEditing && !disabledInterations" key="options" class="tw-flex tw-gap-1">
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
