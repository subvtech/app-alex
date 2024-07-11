<template>
  <ToggleGroup
    v-if="props.editor"
    type="multiple"
    class="d-flex flex-wrap justify-center"
    size="sm"
  >
    <v-tooltip
      v-for="option in toggleItens"
      :key="option.value"
      :text="option.ariaLabel"
      content-class="bg-white tw-text-white tw-rounded-md tw-p-2 tw-shadow-md"
      location="top center"
      transition="fade-transition"
    >
      <template #activator="{ props: tooltip }">
        <ToggleGroupItem
          :value="option.value"
          :aria-label="option.ariaLabel"
          :disabled="option.disabled"
          :data-active="option.isActive?.()"
          v-bind="tooltip"
          @click="option.onClick?.()"
        >
          <component :is="option.icon" class="tw-h-4 tw-w-4" />
        </ToggleGroupItem>
      </template>
    </v-tooltip>
  </ToggleGroup>
</template>

<script setup lang="ts">
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
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
    ariaLabel: 'Negrito',
    onClick: () => props.editor.chain().focus().toggleBold().run(),
    isActive: () => props.editor.isActive('bold'),
  },
  {
    value: 'italic',
    icon: Italic,
    ariaLabel: 'Itálico',
    onClick: () => props.editor.chain().focus().toggleItalic().run(),
    isActive: () => props.editor.isActive('italic'),
  },
  {
    value: 'underline',
    icon: Underline,
    ariaLabel: 'Sublinhar',
    onClick: () => props.editor.chain().focus().toggleUnderline().run(),
    isActive: () => props.editor.isActive('underline'),
  },
  {
    value: 'strikethrough',
    icon: Strikethrough,
    ariaLabel: 'Tachar',
    onClick: () => props.editor.chain().focus().toggleStrike().run(),
    isActive: () => props.editor.isActive('strike'),
  },
  {
    value: 'code',
    icon: Code,
    ariaLabel: 'Inline Code',
    onClick: () => props.editor.chain().focus().toggleCode().run(),
    isActive: () => props.editor.isActive('code'),
  },
  {
    value: 'link',
    icon: Link,
    ariaLabel: 'Inserir link',
    disabled: true,
  },
  {
    value: 'highlighter',
    icon: Highlighter,
    ariaLabel: 'Cor do texto',
    disabled: true,
  },
  {
    value: 'palette',
    icon: Palette,
    ariaLabel: 'Cor de destaque',
    disabled: true,
  },
  {
    value: 'ellipsisVertical',
    icon: EllipsisVertical,
    ariaLabel: 'Mais opções',
    disabled: true,
  },
];
</script>
