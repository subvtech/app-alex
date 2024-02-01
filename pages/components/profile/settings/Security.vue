<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column gap-6 align-center pb-15"
  >
    <alex-documentation-header :title="title" :description="description" />
    <alex-documentation-accordions-props-list :data="listProps" />
    <alex-documentation-accordions-props-list :data="listEmits" list-emits />
    <alex-documentation-example
      v-for="(item, index) in examples"
      :key="item.title ?? index"
      :snippets="item.snippets"
      :title="item.title"
      :description="item.description"
      has-example
    >
      <template #component>
        <alex-profile-settings-security
          :id="securityProps.id"
          :email="securityProps.email"
        /> </template
    ></alex-documentation-example>
  </v-container>
</template>

<script setup lang="ts">
import { ExampleComponentType } from '~/components/alex/documentation/Example.vue';
import { PlaygroundItemType } from '~/components/alex/documentation/Playground.vue';
import { PropItemType } from '~/components/alex/documentation/accordions/PropsList.vue';
import { SecurityComponentType } from '~/components/alex/profile/settings/Security.vue';

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const title = 'Card de Security';
const description =
  "The SecurityProfileComponent is a Vue 3 component designed to display and manage security-related information in a user's profile. It provides sections for editing email and password settings.";
const securityProps: SecurityComponentType = {
  id: -1,
  email: 'email@gmail.com',
};

const listProps: PlaygroundItemType[] = [
  {
    name: 'id',
    type: 'number',
    required: true,
    description: 'The user ID associated with the card.',
    initialValue: securityProps.id,
  },

  {
    name: 'email',
    type: 'string',
    required: true,
    description: 'User email',
    initialValue: securityProps.email,
  },
];

const listEmits: PropItemType[] = [
  {
    name: 'update',
    type: 'void',
    description:
      "It's triggered when the user updates the email field, as for now it doesn't work",
  },
];
const examples = ref<ExampleComponentType[]>([
  {
    snippets: [
      {
        template: `<alex-profile-settings-security
            :email="securityProps.email"
            :id="securityProps.id"
          />`,
        label: 'Template',
      },
      {
        template: `const securityProps: SecurityComponentType = {
  id: -1,
  email: 'email@gmail.com',
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
