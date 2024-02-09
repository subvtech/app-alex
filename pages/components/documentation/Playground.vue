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
        <alex-documentation-playground
          :title="playgroundProps.title"
          :data="playgroundProps.data"
        >
          <template #component="{ props }">
            <alex-profile-institution-item
              :url="props.url"
              :acronym="props.acronym"
              :sector="props.sector"
              :name="props.name"
              :can-edit="props.canEdit"
              :is-deleted="props.isDeleted"
              :institution-id="props.institutionId"
              :background-color="props.backgroundColor"
            />
          </template>
        </alex-documentation-playground> </template
    ></alex-documentation-example>
  </v-container>
</template>

<script setup lang="ts">
import { ExampleComponentType } from '~/components/alex/documentation/Example.vue';
import {
  PlaygroundComponentType,
  PlaygroundItemType,
} from '~/components/alex/documentation/Playground.vue';
import { PropItemType } from '~/components/alex/documentation/accordions/PropsList.vue';
import { InstitutionComponentType } from '~/components/alex/profile/InstitutionItem.vue';
import { InstitutionsComponentType } from '~/components/alex/profile/cards/Institutions.vue';

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const title = 'Playground Component';
const description =
  'O componente de playground é feito pra que se possa testar um componente de diversas formas diferentes, anulando a necessidade de documentar várias variantes.';

const institutionProps: InstitutionComponentType = {
  url: 'https://picsum.photos/400/600',
  name: 'name',
  acronym: 'acronym',
  sector: 'sector',
  backgroundColor: 'bg-white',
  canEdit: true,
  isDeleted: false,
  institutionId: 1,
};

const listPlaygroundExampleProps: PlaygroundItemType[] = [
  {
    name: 'url',
    type: 'string',
    required: false,
    description: "Image url, it's better served if it comes from strapi",
    initialValue: institutionProps.url,
  },
  {
    name: 'name',
    type: 'string',
    required: true,
    description: 'Institution name',
    initialValue: institutionProps.name,
  },
  {
    name: 'acronym',
    type: 'string',
    required: true,
    description: 'Institution acronym',
    initialValue: institutionProps.acronym,
  },
  {
    name: 'sector',
    type: 'string',
    required: true,
    description: 'Institution sector',
    initialValue: institutionProps.sector,
  },
  {
    name: 'backgroundColor',
    type: 'string',
    required: false,
    default: "'bg-white'",
    description: 'It changes the component default backgroundColor',
    initialValue: institutionProps.backgroundColor,
  },
  {
    name: 'canEdit',
    type: 'boolean',
    required: false,
    default: 'false',
    description:
      'It controls whether the user can edit/move the institution item',
    initialValue: institutionProps.canEdit,
  },
  {
    name: 'isDeleted',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'If its true it hides the component.',
    initialValue: institutionProps.isDeleted,
  },
  {
    name: 'institutionId',
    type: 'number',
    required: true,
    description: 'It returns the institutionId on the button event',
    initialValue: institutionProps.institutionId,
  },
];

const playgroundProps: PlaygroundComponentType = {
  title: 'Playground Title',
  data: listPlaygroundExampleProps,
};

const listProps: PlaygroundItemType[] = [
  {
    name: 'title',
    type: 'string',
    required: false,
    default: "'Component Playground'",
    description: 'The title that will be exhibited here.',
    initialValue: playgroundProps.title,
  },
  {
    name: 'data',
    type: 'PlaygroundItemType[]',
    required: true,
    description:
      'The List with the components properties that will be used to generate the fields.',
    initialValue: playgroundProps.data,
  },
];

const examples = ref<ExampleComponentType[]>([
  {
    snippets: [
      {
        template: `<alex-documentation-playground
          :title="playgroundProps.title"
          :data="playgroundProps.data"
        />`,
        label: 'Template',
      },
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
};

const listPlaygroundExampleProps: PlaygroundItemType[] = [
  {
    name: 'url',
    type: 'string',
    required: false,
    description: "Image url, it's better served if it comes from strapi",
    initialValue: institutionProps.url,
  },
  {
    name: 'name',
    type: 'string',
    required: true,
    description: 'Institution name',
    initialValue: institutionProps.name,
  },
  {
    name: 'acronym',
    type: 'string',
    required: true,
    description: 'Institution acronym',
    initialValue: institutionProps.acronym,
  },
  {
    name: 'sector',
    type: 'string',
    required: true,
    description: 'Institution sector',
    initialValue: institutionProps.sector,
  },
  {
    name: 'backgroundColor',
    type: 'string',
    required: false,
    default: "'bg-white'",
    description: 'It changes the component default backgroundColor',
    initialValue: institutionProps.backgroundColor,
  },
  {
    name: 'canEdit',
    type: 'boolean',
    required: false,
    default: 'false',
    description:
      'It controls whether the user can edit/move the institution item',
    initialValue: institutionProps.canEdit,
  },
  {
    name: 'isDeleted',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'If its true it hides the component.',
    initialValue: institutionProps.isDeleted,
  },
  {
    name: 'institutionId',
    type: 'number',
    required: true,
    description: 'It returns the institutionId on the button event',
    initialValue: institutionProps.institutionId,
  },
];

const playgroundProps: PlaygroundComponentType = {
  title: 'Playground Title',
  data: [
    {
      name: 'title',
      type: 'string',
      required: false,
      default: 'Component Playground',
      description: 'The title that will be exhibited here.',
      initialValue: 'title',
    },
    {
      name: 'data',
      type: 'PlaygroundItemType[]',
      required: true,
      description:
        'The List with the components properties that will be used to generate the fields.',
      initialValue: listPlaygroundExampleProps,
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
