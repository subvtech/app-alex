<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column align-start pb-15"
  >
    <alex-documentation-header :title="title" :description="description" />
    <alex-documentation-accordions-props-list :data="listProps" />
    <alex-documentation-example
      v-for="item in examples"
      :snippets="item.snippets"
      :title="item.title"
      :description="item.description"
      :has-example="item.hasExample"
    >
      <template v-slot:component>
        <alex-documentation-prism-highlighter
          :active-page="highlighterProps.activePage"
          :has-example="highlighterProps.hasExample"
          :templates="highlighterProps.templates"
        />
      </template>
    </alex-documentation-example>
  </v-container>
</template>

<script setup lang="ts">
import { ExampleComponentType } from '~/components/alex/documentation/Example.vue';
import { PlaygroundItemType } from '~/components/alex/documentation/Playground.vue';
import { HighlighterComponentType } from '~/components/alex/documentation/prism/Highlighter.vue';
import { InstitutionComponentType } from '~/components/alex/profile/InstitutionItem.vue';

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const title = 'Highlighter Component';
const description =
  'O componente de highligth é feito pra que exibir um texto como se fosse um código no editor.';

const highlighterProps: HighlighterComponentType = {
  activePage: '1',
  hasExample: true,
  templates: [
    {
      template: `const institutionProps: InstitutionComponentType = {
    url: 'https://picsum.photos/400/600',
    name: 'name',
    acronym: 'acronym',
    sector: 'sector',
    backgroundColor: 'bg-white',
    canEdit: true,
    isDeleted: false,
    institutionId: 1,
  };`,
    },
  ],
};

const listProps: PlaygroundItemType[] = [
  {
    name: 'activePage',
    type: 'string',
    required: true,
    description:
      'Defines which page will be open, it might be template or the component in the example slot',
    initialValue: highlighterProps.activePage,
  },
  {
    name: 'hasExample',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Defines if the slot component will be user/shown.',
    initialValue: highlighterProps.hasExample,
  },

  {
    name: 'templates',
    type: 'HighlighterItemType[]',
    required: true,
    description: 'Defines if the slot component will be user/shown.',
    initialValue: highlighterProps.hasExample,
  },
];

const examples = ref<ExampleComponentType[]>([
  {
    snippets: [
      {
        template: `   <alex-documentation-prism-highlighter
          :active-page="highlighterProps.activePage"
          :has-example="highlighterProps.hasExample"
          :templates="highlighterProps.templates"
        />`,
        label: 'Template',
      },
      {
        template: `const highlighterProps: HighlighterComponentType = {
  activePage: '1',
  hasExample: true,
  templates: [
    {
      template: "const institutionProps: InstitutionComponentType = {
    url: 'https://picsum.photos/400/600',
    name: 'name',
    acronym: 'acronym',
    sector: 'sector',
    backgroundColor: 'bg-white',
    canEdit: true,
    isDeleted: false,
    institutionId: 1,
  };",
    },
  ],
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
