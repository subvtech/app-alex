<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column align-start pb-15"
  >
    <alex-documentation-header
      :title="title"
      :description="description"
      :vuetify-link="vuetifyLink"
    />
    <alex-documentation-accordions-props-list :data="listProps" />
    <alex-documentation-example
      v-for="(item, index) in examples"
      :snippets="item.snippets"
      :title="item.title"
      :description="item.description"
      :has-example="item.hasExample"
    >
      <template #component>
        <alex-documentation-accordions-props-list
          :data="examplesPropList[index]"
          :list-emits="index == 1"
        /> </template
    ></alex-documentation-example>
  </v-container>
</template>

<script setup lang="ts">
import { ExampleComponentType } from '~/components/alex/documentation/Example.vue';
import { PlaygroundItemType } from '~/components/alex/documentation/Playground.vue';
import {
  PropItemType,
  PropsListComponentType,
} from '~/components/alex/documentation/accordions/PropsList.vue';
import { InstitutionComponentType } from '~/components/alex/profile/InstitutionItem.vue';

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const title = 'Propslist Component';
const description =
  'O componente de proplist é feito pra que se possa listar props e emits de um componente';
const vuetifyLink =
  'https://vuetifyjs.com/en/components/data-tables/basics/#usage';

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

const propsListExampleProps: PlaygroundItemType[] = [
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

const propsListExampleEmits: PropItemType[] = [
  {
    name: 'delete:institution',
    type: 'number',
    description: "It's triggered when the removes an institution",
  },
];

const examplesPropList = [propsListExampleProps, propsListExampleEmits];

const propslistProps: PropsListComponentType = {
  title: 'PropsListTitle Title',
  data: [],
  showPositions: false,
  listEmits: false,
};

const listProps: PlaygroundItemType[] = [
  {
    name: 'title',
    type: 'string',
    required: false,
    default: "'Component Props'",
    description:
      "The title that will be exhibited here. If list-emits is true then the default value will be 'Component Events'",
    initialValue: propslistProps.title,
  },
  {
    name: 'showPosition',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'If true it adds an index column to the table',
    initialValue: propslistProps.showPositions,
  },
  {
    name: 'listEmits',
    type: 'boolean',
    required: false,
    default: 'false',
    description:
      "If true it doesn't use the property 'default' from PropItemType and changes the default title to 'Component Events'",
    initialValue: propslistProps.listEmits,
  },
  {
    name: 'data',
    type: 'PropItemType[]',
    required: true,
    description:
      'The List of properties or events that will populate the table.',
    initialValue: propslistProps.data,
  },
];

const exampleConstString = `const institutionProps: InstitutionComponentType = {
  url: 'https://picsum.photos/400/600',
  name: 'name',
  acronym: 'acronym',
  sector: 'sector',
  backgroundColor: 'bg-white',
  canEdit: true,
  isDeleted: false,
  institutionId: 1,
};`;

const examplePropsString = `
const propsListExampleProps: PlaygroundItemType[] = [
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
];`;

const listEmitsExampleString = `const listEmits: PropItemType[] = [
  {
    name: 'delete:institution',
    type: 'number',
    description: "It's triggered when the removes an institution",
  },
];`;

const listPropsString = `const listProps: PlaygroundItemType[] = [
  {
    name: 'title',
    type: 'string',
    required: false,
    default: "'Component Props'",
    description:
      "The title that will be exhibited here. If list-emits is true then the default value will be 'Component Events'",
    initialValue: propslistProps.title,
  },
  {
    name: 'showPosition',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'If true it adds an index column to the table',
    initialValue: propslistProps.showPositions,
  },
  {
    name: 'listEmits',
    type: 'boolean',
    required: false,
    default: 'false',
    description:
      "If true it doesn't use the property 'default' from PropItemType and changes the default title to 'Component Events'",
    initialValue: propslistProps.listEmits,
  },
  {
    name: 'data',
    type: 'PropItemType[]',
    required: true,
    description:
      'The List of properties or events that will populate the table.',
    initialValue: propslistProps.data,
  },
];`;

const examples = ref<ExampleComponentType[]>([
  {
    snippets: [
      {
        template: `<alex-documentation-accordions-props-list
          :data="propsListExampleProps"
        />`,
        label: 'Template',
      },
      {
        template:
          exampleConstString +
          '\n' +
          examplePropsString +
          '\n' +
          listPropsString,
        label: 'Script',
      },
    ],
    hasExample: true,
    title: 'Basic Usage',
    description: '',
  },
  {
    snippets: [
      {
        template: `<alex-documentation-accordions-props-list
          :data="propsListExampleProps"
          list-emits
        />`,
        label: 'Template',
      },
      {
        template:
          exampleConstString +
          '\n' +
          listEmitsExampleString +
          '\n' +
          listPropsString,
        label: 'Script',
      },
    ],
    hasExample: true,
    title: 'List Emits variation',
    description: '',
  },
]);
</script>
