<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column align-start pb-15"
  >
    <alex-documentation-header :title="title" :description="description" />
    <alex-documentation-accordions-props-list :data="listProps" />
    <alex-documentation-accordions-props-list :data="listEmits" list-emits />
    <alex-documentation-example
      v-for="(item, index) in examples"
      :key="index"
      :snippets="item.snippets"
      :title="item.title"
      :description="item.description"
      :has-example="item.hasExample"
    >
      <template #component>
        <alex-profile-cards-institutions
          :user-id="institutionsProps.userId"
          :institutions="institutionsProps.institutions"
          :can-edit="institutionsProps.canEdit"
        /> </template
    ></alex-documentation-example>
  </v-container>
</template>

<script setup lang="ts">
import { ExampleComponentType } from '~/components/alex/documentation/Example.vue';
import { PlaygroundItemType } from '~/components/alex/documentation/Playground.vue';
import { PropItemType } from '~/components/alex/documentation/accordions/PropsList.vue';
import { InstitutionsComponentType } from '~/components/alex/profile/cards/Institutions.vue';

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const title = 'Card de Instituições';
const description =
  "The InstitutionsComponent is a Vue 3 component designed to manage and display a user's institutional affiliations. It provides functionality for adding, reordering, and deleting institutions in a user profile. The component supports drag-and-drop reordering of institutions and includes an editing mode for enhanced user interaction.";

const institutionsProps: InstitutionsComponentType = {
  canEdit: true,
  userId: 1,
  institutions: [
    {
      url: 'https://picsum.photos/400/600',
      name: 'name',
      acronym: 'acronym',
      sector: 'sector',
      backgroundColor: 'bg-white',
      canEdit: true,
      isDeleted: false,
      id: 1,
    },
  ],
};

const listProps: PlaygroundItemType[] = [
  {
    name: 'userId',
    type: 'number',
    required: true,
    description: 'The user ID associated with the institutions.',
    initialValue: institutionsProps.userId,
  },
  {
    name: 'canEdit',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Whether the current user can edit the component or not.',
    initialValue: institutionsProps.canEdit,
  },
  {
    name: 'institutions',
    type: 'InstitutionsType[]',
    required: true,
    description: 'A list with the institutions associated with the User',
    initialValue: institutionsProps.institutions,
  },
];

const listEmits: PropItemType[] = [
  {
    name: 'update',
    type: 'void',
    description:
      "It's triggered when the user saves the information by click on the mainButton",
  },
];

const examples = ref<ExampleComponentType[]>([
  {
    snippets: [
      {
        template: `<alex-profile-cards-institutions
          :user-id="institutionsProps.userId"
          :institutions="institutionsProps.institutions"
          :can-edit="institutionsProps.canEdit"
        />`,
        label: 'Template',
      },
      {
        template: `const institutionsProps: InstitutionsComponentType = {
  canEdit: true,
  userId: 1,
  institutions: [
    {
      url: 'https://picsum.photos/400/600',
      name: 'name',
      acronym: 'acronym',
      sector: 'sector',
      backgroundColor: 'bg-white',
      canEdit: true,
      isDeleted: false,
      institutionId: 1,
    },
  ],
};
`,
        label: 'Script',
      },
    ],
    hasExample: true,
    title: 'Basic Usage',
    description: '',
  },
]);
</script>
