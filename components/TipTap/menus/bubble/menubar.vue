<template>
  <Menubar v-if="props.editor" class="border-0 rounded-t-lg">
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
    <!-- Text Align -->
    <MenubarMenu>
      <MenubarTrigger>
        <v-icon
          :icon="activeTextAlign.icon"
          class="tw-mt-0.5 mr-2"
          size="16px"
        />
        <v-icon icon="mdi-chevron-down" size="8px" class="tw-ml-0.5" />
      </MenubarTrigger>
      <MenubarContent class="menuContent min-w-12">
        <MenubarItem
          v-for="item in textAlignOptions"
          :key="`${item.name}-item`"
          :data-highlighted="activeTextAlign.value === item.value"
          :style="{ fontSize: item?.value }"
          class="d-flex justify-center"
          @select="setTextAlign(item.value || '')"
        >
          <v-icon :icon="item.icon" size="14px" />
        </MenubarItem>
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

const { t } = useI18n();

const getTranslation = (key: string) =>
  t(`components.tiptap.menus.bubbleMenu.blocks.${key}`);

const contentTypeList: menuItens[] = [
  {
    name: 'HIERARQUIA',
    isLabel: true,
  },
  {
    name: getTranslation('paragraph'),
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
    name: getTranslation('heading1'),
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
    name: getTranslation('heading2'),
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
    name: getTranslation('heading3'),
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
    name: getTranslation('lists'),
    isLabel: true,
  },
  {
    name: getTranslation('bulletList'),
    icon: 'mdi-format-list-bulleted',
    value: 'bulletList',
    onClick: () => props.editor.chain().focus().toggleBulletList().run(),
    isActive: () => props.editor.isActive('bulletList'),
  },
  {
    name: getTranslation('orderedList'),
    icon: 'mdi-format-list-numbered',
    value: 'orderedList',
    onClick: () => props.editor.chain().focus().toggleOrderedList().run(),
    isActive: () => props.editor.isActive('orderedList'),
  },
  {
    name: getTranslation('todoList'),
    icon: 'mdi-format-list-checks',
    value: 'todoList',
    onClick: () => props.editor.chain().focus().toggleTaskList().run(),
    isActive: () => props.editor.isActive('taskList'),
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

const textAlignOptions: menuItens[] = [
  {
    name: 'Left',
    icon: 'mdi-format-align-left',
    value: 'left',
    isActive: () => props.editor.isActive({ textAlign: 'left' }),
  },
  {
    name: 'Center',
    icon: 'mdi-format-align-center',
    value: 'center',
    isActive: () => props.editor.isActive({ textAlign: 'center' }),
  },
  {
    name: 'Right',
    icon: 'mdi-format-align-right',
    value: 'right',
    isActive: () => props.editor.isActive({ textAlign: 'right' }),
  },
  {
    name: 'Justify',
    icon: 'mdi-format-align-justify',
    value: 'justify',
    isActive: () => props.editor.isActive({ textAlign: 'justify' }),
  },
];

const setFontFamily = (fontFamily: string) => {
  if (!fontFamily || fontFamily.length === 0) {
    return props.editor.chain().focus().unsetFontFamily().run();
  }
  props.editor.chain().focus().setFontFamily(fontFamily).run();
};

const setTextAlign = (textAlign: string) => {
  if (!textAlign || textAlign.length === 0) {
    return props.editor.chain().focus().unsetTextAlign().run();
  }
  props.editor.chain().focus().setTextAlign(textAlign).run();
};

const activeContentType = computed(() =>
  contentTypeList.find((item) => item.isActive?.()),
);
// const activeFontSize = ref<menuItens | null>(fontSizeList[2]);

const activeFontFamily = computed(() => {
  if (props.editor) {
    return props.editor.getAttributes('textStyle')?.fontFamily || 'Sen';
  }
  return 'Sen';
});

const activeTextAlign = computed(
  () =>
    textAlignOptions.find((item) => item.isActive?.()) || textAlignOptions[0],
);
</script>

<style>
.menuContent {
  z-index: 99999;
}
</style>
