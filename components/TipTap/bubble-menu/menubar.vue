<template>
  <Menubar v-if="props.editor" class="border-0">
    <!-- Text Type -->

    <MenubarMenu>
      <MenubarTrigger>
        <v-icon
          :icon="activeContentType?.icon || 'mdi-format-pilcrow'"
          size="16px"
        />
        <v-icon icon="mdi-chevron-down" size="8px" class="tw-ml-0.5" />
      </MenubarTrigger>
      <MenubarContent class="menuContent">
        <template v-for="item in contentTypeList">
          <p
            v-if="item.isLabel"
            :key="`${item.name}-label`"
            class="tw-text-[9px] text-gray-700 px-2 py-1"
          >
            {{ item.name }}
          </p>
          <MenubarItem
            v-else
            :key="`${item.name}-item`"
            :data-highlighted="item.isActive?.()"
            @select="item.onClick?.()"
          >
            <v-icon :icon="item.icon" class="tw-mt-0.5 mr-2" size="14px" />
            {{ item.name }}
          </MenubarItem>
        </template>
      </MenubarContent>
    </MenubarMenu>
    <!-- Font Size -->
    <MenubarMenu>
      <MenubarTrigger>
        <span>{{ activeFontSize?.name.split(' ', 1)[0] }}</span>
        <v-icon icon="mdi-chevron-down" size="8px" class="tw-ml-0.5" />
      </MenubarTrigger>
      <MenubarContent class="menuContent">
        <MenubarItem
          v-for="item in fontSizeList"
          :key="`${item.name}-item`"
          :data-highlighted="activeFontSize?.value === item.value"
          :style="{ fontSize: item?.value }"
          @select="activeFontSize = item"
        >
          {{ item.name }}
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    <!-- Font Family -->
    <MenubarMenu>
      <MenubarTrigger>
        <span>{{ activeFontFamily }}</span>
        <v-icon icon="mdi-chevron-down" size="8px" class="tw-ml-0.5" />
      </MenubarTrigger>
      <MenubarContent class="menuContent">
        <template v-for="item in fontFamilyList">
          <p
            v-if="item.isLabel"
            :key="`${item.name}-label`"
            class="tw-text-[9px] text-gray-700 pa-2"
          >
            {{ item.name }}
          </p>
          <MenubarItem
            v-else
            :key="`${item.name}-item`"
            :data-highlighted="activeFontFamily === item.value"
            :style="{ fontFamily: item?.value }"
            @select="setFontFamily(item.value || '')"
          >
            {{ item.name }}
          </MenubarItem>
        </template>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/vue-3';
const props = defineProps({
  editor: {
    type: Editor,
    required: true,
  },
});

interface menuItens {
  name: string;
  icon?: string;
  value?: string;
  isLabel?: boolean;
  isActive?: () => boolean;
  onClick?: () => void;
}

const contentTypeList: menuItens[] = [
  {
    name: 'HIERARQUIA',
    isLabel: true,
  },
  {
    name: 'Paragraph',
    icon: 'mdi-format-pilcrow',
    value: 'Paragraph',
    onClick: () =>
      props.editor
        .chain()
        .focus()
        .lift('taskItem')
        .liftListItem('listItem')
        .setParagraph()
        .run(),
    isActive: () =>
      props.editor.isActive('paragraph') &&
      !props.editor.isActive('orderedList') &&
      !props.editor.isActive('bulletList') &&
      !props.editor.isActive('taskList'),
  },
  {
    name: 'Heading 1',
    icon: 'mdi-format-header-1',
    value: 'h1',
    onClick: () =>
      props.editor
        .chain()
        .focus()
        .lift('taskItem')
        .liftListItem('listItem')
        .setHeading({ level: 1 })
        .run(),
    isActive: () => props.editor.isActive('heading', { level: 1 }),
  },
  {
    name: 'Heading 2',
    icon: 'mdi-format-header-2',
    value: 'h2',
    onClick: () =>
      props.editor
        .chain()
        .focus()
        .lift('taskItem')
        .liftListItem('listItem')
        .setHeading({ level: 2 })
        .run(),
    isActive: () => props.editor.isActive('heading', { level: 2 }),
  },
  {
    name: 'Heading 3',
    icon: 'mdi-format-header-3',
    value: 'h3',
    onClick: () =>
      props.editor
        .chain()
        .focus()
        .lift('taskItem')
        .liftListItem('listItem')
        .setHeading({ level: 3 })
        .run(),
    isActive: () => props.editor.isActive('heading', { level: 3 }),
  },
  {
    name: 'LISTAS',
    isLabel: true,
  },
  {
    name: 'Bulleted List',
    icon: 'mdi-format-list-bulleted',
    value: 'bulletList',
    onClick: () => props.editor.chain().focus().toggleBulletList().run(),
    isActive: () => props.editor.isActive('bulletList'),
  },
  {
    name: 'Numbered List',
    icon: 'mdi-format-list-numbered',
    value: 'orderedList',
    onClick: () => props.editor.chain().focus().toggleOrderedList().run(),
    isActive: () => props.editor.isActive('orderedList'),
  },
  {
    name: 'Todo List',
    icon: 'mdi-format-list-checks',
    value: 'todoList',
    onClick: () => props.editor.chain().focus().toggleTaskList().run(),
    isActive: () => props.editor.isActive('taskList'),
  },
];

const fontSizeList: menuItens[] = [
  {
    name: 'Smaller',
    value: '12px',
  },
  {
    name: 'Small',
    value: '14px',
  },
  {
    name: 'Medium',
    value: '16px',
  },
  {
    name: 'Large',
    value: '18px',
  },
  {
    name: 'Extra Large',
    value: '24px',
  },
];

const fontFamilyList: menuItens[] = [
  {
    name: 'SANS SERIF',
    isLabel: true,
  },
  {
    name: 'Arial',
    value: 'Arial',
  },
  {
    name: 'Verdana',
    value: 'Verdana',
  },
  {
    name: 'Sen',
    value: 'Sen',
  },
  {
    name: 'SERIF',
    isLabel: true,
  },
  {
    name: 'Times New Roman',
    value: 'Times',
  },
  {
    name: 'Georgia',
    value: 'Georgia',
  },
  {
    name: 'MONOSPACE',
    isLabel: true,
  },
  {
    name: 'Courier New',
    value: 'Courier New',
  },
];

const setFontFamily = (fontFamily: string) => {
  if (!fontFamily || fontFamily.length === 0) {
    return props.editor.chain().focus().unsetFontFamily().run();
  }
  props.editor.chain().focus().setFontFamily(fontFamily).run();
};

const activeContentType = computed(() =>
  contentTypeList.find((item) => item.isActive?.()),
);
const activeFontSize = ref<menuItens | null>(fontSizeList[2]);

const activeFontFamily = computed(() => {
  if (props.editor) {
    return props.editor.getAttributes('textStyle')?.fontFamily || 'Sen';
  }
  return 'Sen';
});
</script>

<style>
.menuContent {
  z-index: 99999;
}
</style>
