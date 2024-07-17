<template>
  <div v-if="editor" class="tw-flex">
    <alex-custom-button variant="text" icon="mdi-plus" @click="addNode">
      <v-icon icon="mdi-plus" size="small" />
    </alex-custom-button>
    <Popover :open="menu" @update:open="(value: boolean) => (menu = value)">
      <PopoverTrigger>
        <alex-custom-button variant="text" icon="mdi-plus">
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
  currentNode: Ref<Node | null>;
  currentNodePos: Ref<number>;
}>();

const menu = ref(false);

watch(menu, () => {
  if (menu.value) {
    props.editor.commands.setMeta('lockDragHandle', true);
  } else {
    props.editor.commands.setMeta('lockDragHandle', false);
  }
});

const actions = useContentItemActions(props.editor);

const popoverItens = [
  {
    value: 'clearFormatting',
    text: 'Clear formatting',
    icon: 'mdi-format-clear',
    ariaLabel: 'Clear formatting',
    onClick: () => {
      actions.resetTextFormatting(props.currentNode, props.currentNodePos);
      menu.value = false;
    },
  },
  {
    value: 'copyToClipboard',
    text: 'Copy to clipboard',
    icon: 'mdi-clipboard-outline',
    ariaLabel: 'Copy to clipboard',
    onClick: () => {
      actions.copyNodeToClipboard(props.currentNodePos);
      menu.value = false;
    },
  },
  {
    value: 'duplicate',
    text: 'Duplicate',
    icon: 'mdi-content-duplicate',
    ariaLabel: 'Duplicate',
    onClick: () => {
      actions.duplicateNode(props.currentNode, props.currentNodePos);
      menu.value = false;
    },
  },
  {
    value: 'delete',
    text: 'Delete',
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
