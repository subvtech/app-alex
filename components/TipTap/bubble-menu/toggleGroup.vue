<template>
  <ToggleGroup
    type="multiple"
    class="d-flex flex-wrap justify-center"
    size="sm"
  >
    <ToggleGroupItem
      v-for="item in toggleItens"
      :key="item.value"
      :value="item.value"
      :aria-label="item.ariaLabel"
    >
      <component :is="item.icon" class="tw-h-4 tw-w-4" />
    </ToggleGroupItem>
  </ToggleGroup>
</template>

<script setup lang="ts">
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  CodeXml,
  Link,
  Highlighter,
  Palette,
  EllipsisVertical,
} from 'lucide-vue-next';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const toggleItens = [
  {
    value: 'bold',
    icon: Bold,
    ariaLabel: 'Toggle bold',
  },
  {
    value: 'italic',
    icon: Italic,
    ariaLabel: 'Toggle italic',
  },
  {
    value: 'underline',
    icon: Underline,
    ariaLabel: 'Toggle underline',
  },
  {
    value: 'strikethrough',
    icon: Strikethrough,
    ariaLabel: 'Toggle strikethrough',
  },
  {
    value: 'code',
    icon: Code,
    ariaLabel: 'Toggle code',
  },
  {
    value: 'codeXml',
    icon: CodeXml,
    ariaLabel: 'Toggle code xml',
  },
  {
    value: 'link',
    icon: Link,
    ariaLabel: 'Toggle link',
  },
  {
    value: 'highlighter',
    icon: Highlighter,
    ariaLabel: 'Toggle highlighter',
  },
  {
    value: 'palette',
    icon: Palette,
    ariaLabel: 'Toggle palette',
  },
  {
    value: 'ellipsisVertical',
    icon: EllipsisVertical,
    ariaLabel: 'Toggle ellipsis vertical',
  },
];
</script>
