<template>
  <Menubar class="border-0">
    <!-- Text Type -->

    <MenubarMenu>
      <MenubarTrigger>
        <v-icon :icon="activeTextType?.icon" size="16px" />
        <v-icon icon="mdi-chevron-down" size="8px" class="tw-ml-0.5" />
      </MenubarTrigger>
      <MenubarContent>
        <template v-for="item in textTypeList">
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
            :data-highlighted="activeTextType?.value === item.value"
            @select="activeTextType = item"
          >
            <v-icon :icon="item.icon" class="tw-mt-0.5 mr-2" size="14px" />
            {{ item.name }}
          </MenubarItem>
        </template>
      </MenubarContent>
    </MenubarMenu>
    <!-- Text Font -->
    <MenubarMenu>
      <MenubarTrigger>
        <span>{{ activeTextSize?.name.split(' ', 1)[0] }}</span>
        <v-icon icon="mdi-chevron-down" size="8px" class="tw-ml-0.5" />
      </MenubarTrigger>
      <MenubarContent>
        <MenubarItem
          v-for="item in textSizeList"
          :key="`${item.name}-item`"
          :data-highlighted="activeTextSize?.value === item.value"
          :style="{ fontSize: item?.value }"
          @select="activeTextSize = item"
        >
          {{ item.name }}
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    <!-- Text Size -->
    <MenubarMenu>
      <MenubarTrigger>
        <span>{{ activeFontFamily?.name.split(' ', 1)[0] }}</span>
        <v-icon icon="mdi-chevron-down" size="8px" class="tw-ml-0.5" />
      </MenubarTrigger>
      <MenubarContent>
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
            :data-highlighted="activeFontFamily?.value === item.value"
            :style="{ fontFamily: item?.value }"
            @select="activeFontFamily = item"
          >
            {{ item.name }}
          </MenubarItem>
        </template>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
</template>

<script setup lang="ts">
interface menuItens {
  name: string;
  icon?: string;
  value?: string;
  isLabel?: boolean;
}

const textTypeList: menuItens[] = [
  {
    name: 'HIERARQUIA',
    isLabel: true,
  },
  {
    name: 'Paragraph',
    icon: 'mdi-format-pilcrow',
    value: 'Paragraph',
  },
  {
    name: 'Heading 1',
    icon: 'mdi-format-header-1',
    value: 'h1',
  },
  {
    name: 'Heading 2',
    icon: 'mdi-format-header-2',
    value: 'h2',
  },
  {
    name: 'Heading 3',
    icon: 'mdi-format-header-3',
    value: 'h3',
  },
  {
    name: 'LISTAS',
    isLabel: true,
  },
  {
    name: 'Bulleted List',
    icon: 'mdi-format-list-bulleted',
    value: 'bulletList',
  },
  {
    name: 'Numbered List',
    icon: 'mdi-format-list-numbered',
    value: 'orderedList',
  },
  {
    name: 'Todo List',
    icon: 'mdi-format-list-checks',
    value: 'todoList',
  },
];

const textSizeList: menuItens[] = [
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
    value: 'Times New Roman',
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

const activeTextType = ref<menuItens | null>(textTypeList[1]);
const activeTextSize = ref<menuItens | null>(textSizeList[2]);
const activeFontFamily = ref<menuItens | null>(fontFamilyList[3]);
</script>
