<template>
  <div v-if="editor && shouldShowDragHandle" class="tw-flex">
    <alex-custom-button
      :class="{ 'elevation-2 bg-white': isMobile }"
      variant="text"
      icon="mdi-plus"
      @click="addNode"
    >
      <v-icon icon="mdi-plus" size="small" />
    </alex-custom-button>
    <Popover :open="menu" @update:open="(value: boolean) => (menu = value)">
      <PopoverTrigger>
        <alex-custom-button
          variant="text"
          icon="mdi-plus"
          :class="{ 'elevation-2 bg-white ml-1': isMobile }"
        >
          <v-icon icon="alex:DragIndicator" size="small" />
        </alex-custom-button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" :side-offset="8" class="pa-2">
        <template v-for="item in popoverItens" :key="item.value">
          <v-divider v-if="item.value === 'delete'" class="py-1 my-1 divider" />
          <v-btn
            variant="text"
            class="tw-w-full tw-flex justify-start text-body-1"
            :class="
              item.value === 'delete'
                ? 'text-error-0 delete-btn'
                : 'text-gray-600 default-btn'
            "
            @click="item.onClick"
          >
            <v-icon :icon="item.icon" size="small" class="tw-mr-1" />
            {{ item.text }}
          </v-btn>
        </template>
      </PopoverContent>
    </Popover>
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/vue-3';
import { Node } from '@tiptap/pm/model';
import useContentItemActions from './Actions';

const props = defineProps<{
  editor: Editor;
  defaultNodeType: string;
  currentNode: Ref<Node | null>;
  currentNodePos: Ref<number>;
  showDragHandle: Ref<boolean>;
}>();

const menu = ref(false);
const { t } = useI18n();

watch(menu, () => {
  if (menu.value) {
    props.editor.commands.setMeta('lockDragHandle', true);
  } else {
    props.editor.commands.setMeta('lockDragHandle', false);
  }
});

const shouldShowDragHandle = computed(() => {
  return props.showDragHandle.value;
});

const actions = useContentItemActions(props.editor, props.defaultNodeType);
const getTranslation = (key: string) =>
  t(`components.tiptap.menus.dragMenu.${key}`);

const popoverItens = [
  {
    value: 'clearFormatting',
    text: getTranslation('clearFormatting'),
    icon: 'mdi-format-clear',
    ariaLabel: 'Clear formatting',
    onClick: () => {
      actions.resetTextFormatting(props.currentNode, props.currentNodePos);
      menu.value = false;
    },
  },
  {
    value: 'copyToClipboard',
    text: getTranslation('copyToClipboard'),
    icon: 'mdi-clipboard-outline',
    ariaLabel: 'Copy to clipboard',
    onClick: () => {
      actions.copyNodeToClipboard(props.currentNodePos);
      menu.value = false;
    },
  },
  {
    value: 'duplicate',
    text: getTranslation('duplicate'),
    icon: 'mdi-content-duplicate',
    ariaLabel: 'Duplicate',
    onClick: () => {
      actions.duplicateNode(props.currentNode, props.currentNodePos);
      menu.value = false;
    },
  },
  {
    value: 'delete',
    text: getTranslation('delete'),
    icon: 'mdi-trash-can-outline',
    ariaLabel: 'Delete',
    onClick: () => {
      actions.deleteNode(props.currentNodePos);
      menu.value = false;
    },
  },
];

const addNode = () => {
  actions.handleAdd(props.currentNode, props.currentNodePos);
  menu.value = false;
};

const screenWidth = ref(window.innerWidth);

const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', updateScreenWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenWidth);
});

const isMobile = computed(() => screenWidth.value <= 768);
</script>

<style scoped>
.delete-btn {
  background-color: rgb(var(--v-theme-error--2));
  &:hover {
    color: rgb(var(--v-theme-error-2)) !important;
    background-color: rgb(var(--v-theme-error--1));
  }
}

.default-btn {
  &:hover {
    color: rgb(var(--v-theme-gray-900)) !important;
  }
}

.divider {
  border-color: rgb(var(--v-theme-gray-800));
}
</style>
