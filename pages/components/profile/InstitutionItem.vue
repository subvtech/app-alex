<template>
  <v-container
    class="page rounded-lg bg-white pa-6 gap-6 d-flex flex-column align-start pb-15"
  >
    <alex-documentation-header :title="title" :description="description" />
    <alex-documentation-accordions-props-list
      :data="listProps"
      show-positions
    />
    <alex-documentation-accordions-props-list :data="listEmits" list-emits />
    <alex-documentation-example
      v-for="(item, index) in examples"
      :key="index"
      :snippets="item.snippets"
      :title="item.title"
      :description="item.description"
    >
    </alex-documentation-example>
    <alex-documentation-playground :data="listProps">
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
    </alex-documentation-playground>
  </v-container>
</template>

<script setup lang="ts">
import { ExampleComponentType } from '~/components/alex/documentation/Example.vue';
import { PlaygroundItemType } from '~/components/alex/documentation/Playground.vue';
import { PropItemType } from '~/components/alex/documentation/accordions/PropsList.vue';
import { InstitutionComponentType } from '~/components/alex/profile/InstitutionItem.vue';

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const title = 'Institution Item';
const description =
  'É usado para exibir informações da Instituição da qual o usuário faz parte na tela de perfil';

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

const listProps: PlaygroundItemType[] = [
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

const listEmits: PropItemType[] = [
  {
    name: 'delete:institution',
    type: 'number',
    description: "It's triggered when the removes an institution",
  },
];

const examples = ref<ExampleComponentType[]>([
  {
    snippets: [
      {
        template: `<alex-profile-institution-item
          :url="props.url"
          :acronym="props.acronym"
          :sector="props.sector"
          :name="props.name"
          :can-edit="props.canEdit"
          :is-deleted="props.isDeleted"
          :institution-id="props.institutionId"
          :background-color="props.backgroundColor"
        />`,
        label: 'Template',
      },
      {
        template: `
const institutionProps: InstitutionComponentType = {
  url: 'https://picsum.photos/400/600',
  name: 'name',
  acronym: 'acronym',
  sector: 'sector',
  backgroundColor: 'bg-white',
  canEdit: true,
  isDeleted: false,
  institutionId: 1,
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
