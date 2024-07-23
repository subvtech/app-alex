<template>
  <v-container
    class="page rounded-lg bg-white pa-6 gap-6 d-flex flex-column align-start pb-15"
  >
    <alex-documentation-header :title="title" :description="description" />
    <alex-documentation-accordions-props-list
      :data="listProps"
      show-positions
    />
    <alex-documentation-example
      v-for="item in examples"
      :snippets="item.snippets"
      :title="item.title"
      :description="item.description"
    >
    </alex-documentation-example>
    <alex-documentation-playground :data="listProps">
      <template #component="{ props }">
        <alex-documentation-buttons-copy
          :text="props.text"
          :copy-icon="props.copyIcon"
          :copied-icon="props.copiedIcon"
          :tooltip-text="props.tooltipText"
        />
      </template>
    </alex-documentation-playground>
  </v-container>
</template>

<script setup lang="ts">
import { ExampleComponentType } from '~/components/alex/documentation/Example.vue';
import { PlaygroundItemType } from '~/components/alex/documentation/Playground.vue';
import { CopyButtonComponentType } from '~/components/alex/documentation/buttons/Copy.vue';

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const title = 'Copy Button';
const description = 'É usado um alex-documentation-buttons-tooltip para copiar textos';
const copyButtonProps: CopyButtonComponentType = {
  tooltipText: 'text',
  copyIcon: 'mdi-content-copy',
  copiedIcon: 'mdi-clipboard-check-multiple-outline',
  text: 'mock text',
};

const listProps: PlaygroundItemType[] = [
  {
    name: 'tooltipText',
    type: 'string',
    required: false,
    default: '',
    description: 'The text that will be shown in the tooltip box',
    initialValue: copyButtonProps.tooltipText,
  },
  {
    name: 'text',
    type: 'string',
    required: true,
    description: 'The text to be copied',
    initialValue: copyButtonProps.text,
  },

  {
    name: 'copyIcon',
    type: 'string',
    required: false,
    default: 'mdi-content-copy',
    description: 'A valid mdi-icon to be shown before the user copies the text',
    initialValue: copyButtonProps.copyIcon,
  },
  {
    name: 'copiedIcon',
    type: 'string',
    required: false,
    default: 'mdi-clipboard-check-multiple-outline',
    description: 'A valid mdi-icon to be shown after the user copies the text',
    initialValue: copyButtonProps.copiedIcon,
  },
];

const examples = ref<ExampleComponentType[]>([
  {
    snippets: [
      {
        template: `<alex-documentation-buttons-copy
          :text="props.text"
          :copy-icon="props.copyIcon"
          :copied-icon="props.copiedIcon"
          :tooltip-text="props.tooltipText"
        />`,
        label: 'Template',
      },
      {
        template: `const copyButtonProps: CopyButtonComponentType = {
  tooltipText: 'text',
  copyIcon: 'mdi-content-copy',
  copiedIcon: 'mdi-clipboard-check-multiple-outline',
  text: 'mock text',
};`,
        label: 'Script',
      },
    ],
    hasExample: true,
    title: 'Basic Usage',
    description: '',
  },
]);
</script>
