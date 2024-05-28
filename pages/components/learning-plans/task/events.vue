<template>
  <v-container
    class="page rounded-lg bg-white pa-6 gap-6 d-flex flex-column align-start pb-15"
  >
    <alex-documentation-header :title="title" :description="description" />
    <alex-documentation-accordions-props-list
      :data="listProps"
      title="Component Props"
      show-positions
    />
    <alex-documentation-example
      v-for="(item, index) in examples"
      :key="index"
      :snippets="item.snippets"
      :title="item.title"
      :description="item.description"
      has-example
    >
      <template #component>
        <div class="bg-white">
          <alex-learningplan-task-events />
        </div>
      </template>
      <alex-learningplan-task-events />
    </alex-documentation-example>
  </v-container>
</template>

<script setup lang="ts">
import { ExampleComponentType } from '@/components/alex/documentation/Example.vue';
import { PlaygroundItemType } from '~/components/alex/documentation/Playground.vue';
import { CopyButtonComponentType } from '~/components/alex/documentation/buttons/Copy.vue';

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const title = 'Events';
const description = 'É usado em tarefas para mostrar os eventos que ocorreram';
const copyButtonProps: CopyButtonComponentType = {
  tooltipText: 'text',
  copyIcon: 'mdi-content-copy',
  copiedIcon: 'mdi-clipboard-check-multiple-outline',
  text: 'mock text',
};

const listProps: PlaygroundItemType[] = [
  {
    name: 'date',
    type: 'string',
    required: true,
    default: '',
    description: 'Date of event',
    initialValue: undefined,
  },
  {
    name: 'Event',
    type: `{
  user: string;
  action: string;
  time: string;
}`,
    required: true,
    description: 'Events that happened',
    initialValue: copyButtonProps.text,
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
