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
          v-if="!option.popover"
          :value="option.value"
          :aria-label="option.ariaLabel"
          :disabled="option.disabled"
          :data-active="option.isActive?.()"
          v-bind="tooltip"
          @click="option.onClick?.()"
        >
          <component :is="option.icon" class="tw-h-4 tw-w-4" />
        </ToggleGroupItem>
        <Popover v-else>
          <PopoverTrigger
            v-bind="tooltip"
            :data-active="option.isActive?.()"
            class="tw-h-9 tw-px-2.5 tw-rounded-md hover:tw-bg-muted hover:tw-text-muted-foreground data-[active=true]:tw-bg-accent data-[active=true]:tw-text-accent-foreground"
          >
            <component :is="option.icon" class="tw-h-4 tw-w-4" />
          </PopoverTrigger>
          <PopoverContent class="max-w-55 pa-2">
            <colorSelector
              v-if="
                option.popover === 'color' || option.popover === 'highlight'
              "
              :type="option.popover"
              :active-color="
                option.popover === 'color' ? currentColor : currentHighLight
              "
              @set-text-color="setColor"
              @set-highlight-color="setHighlight"
            />
          </PopoverContent>
        </Popover>
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
import colorSelector from './colorSelector.vue';

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
    popover: 'link',
  },
  {
    value: 'highlighter',
    icon: Highlighter,
    ariaLabel: 'Cor do  destaque',
    popover: 'highlight',
    isActive: () => currentHighLight.value !== undefined,
  },
  {
    value: 'palette',
    icon: Palette,
    ariaLabel: 'Cor de texto ',
    popover: 'color',
    isActive: () => currentColor.value !== undefined,
  },
  {
    value: 'ellipsisVertical',
    icon: EllipsisVertical,
    ariaLabel: 'Mais opções',
    disabled: true,
  },
];

const currentColor = computed(
  () => props.editor.getAttributes('textStyle')?.color || undefined,
);

const setColor = (color: string) => {
  if (color && color !== currentColor.value && color !== '#000') {
    props.editor.commands.setColor(color);
  } else {
    props.editor.chain().focus().unsetColor().run();
  }
};

const setHighlight = (color: string) => {
  if (color && color !== currentColor.value && color !== '#fff') {
    props.editor.chain().setHighlight({ color }).run();
  } else {
    props.editor.chain().focus().unsetHighlight().run();
  }
};

const currentHighLight = computed(
  () => props.editor.getAttributes('highlight')?.color || undefined,
);
</script>
