<template>
  <div v-if="isInTable" class="table-menu text-dark-gray pa-1 d-flex align-center rounded-lg">
    <template v-for="(group, groupIndex) in actionGroups" :key="groupIndex">
      <v-divider v-if="groupIndex > 0" class="divider mx-1" vertical />
      <v-tooltip
        v-for="action in group"
        :key="action.value"
        :text="action.ariaLabel"
        content-class="bg-white tw-text-white tw-rounded-md tw-p-2 tw-shadow-md"
        location="top center"
        transition="fade-transition"
      >
        <template #activator="{ props: tooltip }">
          <button
            :aria-label="action.ariaLabel"
            :disabled="!action.canRun()"
            :data-active="action.isActive?.()"
            v-bind="tooltip"
            type="button"
            @click="action.onClick()"
          >
            <v-icon :icon="action.icon" size="16px" />
          </button>
        </template>
      </v-tooltip>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/vue-3';

const props = defineProps({
  editor: {
    type: Editor,
    required: true,
  },
});

const { t } = useI18n();

const getTranslation = (key: string) => t(`components.tiptap.menus.tableMenu.${key}`);

const isInTable = computed(() => props.editor.isActive('table'));

interface TableAction {
  value: string;
  icon: string;
  ariaLabel: string;
  onClick: () => void;
  canRun: () => boolean;
  isActive?: () => boolean;
}

const actionGroups: TableAction[][] = [
  [
    {
      value: 'addColumnBefore',
      icon: 'mdi-table-column-plus-before',
      ariaLabel: getTranslation('addColumnBefore'),
      onClick: () => props.editor.chain().focus().addColumnBefore().run(),
      canRun: () => props.editor.can().addColumnBefore(),
    },
    {
      value: 'addColumnAfter',
      icon: 'mdi-table-column-plus-after',
      ariaLabel: getTranslation('addColumnAfter'),
      onClick: () => props.editor.chain().focus().addColumnAfter().run(),
      canRun: () => props.editor.can().addColumnAfter(),
    },
    {
      value: 'deleteColumn',
      icon: 'mdi-table-column-remove',
      ariaLabel: getTranslation('deleteColumn'),
      onClick: () => props.editor.chain().focus().deleteColumn().run(),
      canRun: () => props.editor.can().deleteColumn(),
    },
  ],
  [
    {
      value: 'addRowBefore',
      icon: 'mdi-table-row-plus-before',
      ariaLabel: getTranslation('addRowBefore'),
      onClick: () => props.editor.chain().focus().addRowBefore().run(),
      canRun: () => props.editor.can().addRowBefore(),
    },
    {
      value: 'addRowAfter',
      icon: 'mdi-table-row-plus-after',
      ariaLabel: getTranslation('addRowAfter'),
      onClick: () => props.editor.chain().focus().addRowAfter().run(),
      canRun: () => props.editor.can().addRowAfter(),
    },
    {
      value: 'deleteRow',
      icon: 'mdi-table-row-remove',
      ariaLabel: getTranslation('deleteRow'),
      onClick: () => props.editor.chain().focus().deleteRow().run(),
      canRun: () => props.editor.can().deleteRow(),
    },
  ],
  [
    {
      value: 'toggleHeaderRow',
      icon: 'mdi-table-row',
      ariaLabel: getTranslation('toggleHeaderRow'),
      onClick: () => props.editor.chain().focus().toggleHeaderRow().run(),
      canRun: () => props.editor.can().toggleHeaderRow(),
    },
    {
      value: 'toggleHeaderColumn',
      icon: 'mdi-table-column',
      ariaLabel: getTranslation('toggleHeaderColumn'),
      onClick: () => props.editor.chain().focus().toggleHeaderColumn().run(),
      canRun: () => props.editor.can().toggleHeaderColumn(),
    },
    {
      value: 'mergeOrSplit',
      icon: 'mdi-table-merge-cells',
      ariaLabel: getTranslation('mergeOrSplit'),
      onClick: () => props.editor.chain().focus().mergeOrSplit().run(),
      canRun: () => props.editor.can().mergeOrSplit(),
    },
  ],
  [
    {
      value: 'deleteTable',
      icon: 'mdi-table-remove',
      ariaLabel: getTranslation('deleteTable'),
      onClick: () => props.editor.chain().focus().deleteTable().run(),
      canRun: () => props.editor.can().deleteTable(),
    },
  ],
];
</script>

<style scoped>
.table-menu {
  background: #fff;
  border: 1px solid rgb(var(--v-theme-gray-100));
  box-shadow: 0 2px 8px rgb(0 0 0 / 12%);

  button {
    align-items: center;
    border-radius: 4px;
    display: flex;
    padding: 6px;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background-color: #f5f5f5;
      color: rgb(var(--v-theme-gray-900)) !important;
    }

    &[data-active='true'] {
      background-color: #e5e5e5;
      color: rgb(var(--v-theme-gray-900)) !important;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.35;
    }
  }
}

.divider {
  border-color: rgb(var(--v-theme-gray-800));
}
</style>
