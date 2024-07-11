<template>
  <ToggleGroup
    v-if="props.editor"
    type="multiple"
    class="d-flex flex-wrap justify-center"
    size="sm"
  >
    <ToggleGroupItem
      v-for="option in toggleItens"
      :key="option.value"
      :value="option.value"
      :aria-label="option.ariaLabel"
      :disabled="option.disabled"
      :data-active="option.isActive?.()"
      @click="option.onClick?.()"
    >
      <component :is="option.icon" class="tw-h-4 tw-w-4" />
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
import { Editor } from '@tiptap/vue-3';

const props = defineProps({
  editor: {
    type: Editor,
    required: true,
  },
});

const toggleItens = [
  {
    value: 'bold',
    icon: Bold,
    ariaLabel: 'Toggle bold',
    onClick: () => props.editor.chain().focus().toggleBold().run(),
    isActive: () => props.editor.isActive('bold'),
  },
  {
    value: 'italic',
    icon: Italic,
    ariaLabel: 'Toggle italic',
    onClick: () => props.editor.chain().focus().toggleItalic().run(),
    isActive: () => props.editor.isActive('italic'),
  },
  {
    value: 'underline',
    icon: Underline,
    ariaLabel: 'Toggle underline',
    onClick: () => props.editor.chain().focus().toggleUnderline().run(),
    isActive: () => props.editor.isActive('underline'),
  },
  {
    value: 'strikethrough',
    icon: Strikethrough,
    ariaLabel: 'Toggle strikethrough',
    onClick: () => props.editor.chain().focus().toggleStrike().run(),
    isActive: () => props.editor.isActive('strike'),
  },
  {
    value: 'code',
    icon: Code,
    ariaLabel: 'Toggle code',
    onClick: () => props.editor.chain().focus().toggleCode().run(),
    isActive: () => props.editor.isActive('code'),
  },
  {
    value: 'codeXml',
    icon: CodeXml,
    ariaLabel: 'Toggle code xml',
    onClick: () => props.editor.chain().focus().toggleCodeBlock().run(),
  },
  {
    value: 'link',
    icon: Link,
    ariaLabel: 'Toggle link',
    disabled: true,
  },
  {
    value: 'highlighter',
    icon: Highlighter,
    ariaLabel: 'Toggle highlighter',
    disabled: true,
  },
  {
    value: 'palette',
    icon: Palette,
    ariaLabel: 'Toggle palette',
    disabled: true,
  },
  {
    value: 'ellipsisVertical',
    icon: EllipsisVertical,
    ariaLabel: 'Toggle ellipsis vertical',
    disabled: true,
  },
];
</script>
