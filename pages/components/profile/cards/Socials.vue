<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column gap-6 align-center pb-15"
  >
    <alex-documentation-header :title="title" :description="description" />
    <alex-documentation-accordions-props-list :data="listProps" />
    <alex-documentation-example
      v-for="(item, index) in examples"
      :key="index"
      :snippets="item.snippets"
      :title="item.title"
      :description="item.description"
      has-example
    >
      <template #component>
        <alex-profile-cards-socials
          :can-edit="socialsProps.canEdit"
          :socials="socialsProps.socials"
          :user-id="socialsProps.userId"
        /> </template
    ></alex-documentation-example>
  </v-container>
</template>

<script setup lang="ts">
import { ExampleComponentType } from '~/components/alex/documentation/Example.vue';
import { PlaygroundItemType } from '~/components/alex/documentation/Playground.vue';
import { SocialsComponentType } from '~/components/alex/profile/cards/Socials.vue';

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const title = 'Card de Socials';
const description =
  "The SocialsComponent is a Vue 3 component designed to manage and display a user's social media links. It provides functionality for adding, reordering, and deleting social media links in a user profile. The component supports drag-and-drop reordering of social media links and includes an editing mode for enhanced user interaction.";
const socialsProps: SocialsComponentType = {
  userId: -1,
  socials: [
    {
      id: -1,
      name: 'Instagram',
      url: 'google.com',
    },
  ],
  canEdit: true,
};

const listProps: PlaygroundItemType[] = [
  {
    name: 'userId',
    type: 'number',
    required: true,
    description: 'The user ID associated with the institutions.',
    initialValue: socialsProps.userId,
  },
  {
    name: 'canEdit',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Whether the current user can edit the component or not.',
    initialValue: socialsProps.canEdit,
  },
  {
    name: 'socials',
    type: 'SocialsType[]',
    required: true,
    description: 'A list with the socials associated with the User',
    initialValue: socialsProps.socials,
  },
];

const examples = ref<ExampleComponentType[]>([
  {
    snippets: [
      {
        template: `<alex-profile-cards-socials
          :can-edit="socialsProps.canEdit"
          :socials="socialsProps.socials"
          :user-id="socialsProps.userId"
        />`,
        label: 'Template',
      },
      {
        template: `const socialsProps: SocialsComponentType = {
  userId: 1,
  socials: [{
    id: 1, name: "Instagram", url: "lkl" 
  }],
  canEdit: true,
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
