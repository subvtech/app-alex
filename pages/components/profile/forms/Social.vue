<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column gap-6 align-center pb-15"
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
    />

    <alex-documentation-playground :data="listProps">
      <template #component="{ props }">
        <alex-profile-forms-social
          :url="props.url"
          :index="props.index"
          :name="props.name"
          :social-id="props.socialId"
        />
      </template>
    </alex-documentation-playground>
  </v-container>
</template>

<script setup lang="ts">
import { ExampleComponentType } from '~/components/alex/documentation/Example.vue';
import { PlaygroundItemType } from '~/components/alex/documentation/Playground.vue';
import { PropItemType } from '~/components/alex/documentation/accordions/PropsList.vue';
import { SocialFormComponentType } from '~/components/alex/profile/forms/Social.vue';

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const title = 'Social Form';
const description =
  'The SocialFormComponent is a Vue 3 component designed for editing social media information in a user profile. It includes input fields for the social media name and URL, with validation rules to ensure data integrity. This component emits events to notify the parent component of changes and validation status.';
const socialFormProps: SocialFormComponentType = {
  index: 1,
  url: 'url.com',
  name: 'name',
  socialId: 1,
};

const listProps: PlaygroundItemType[] = [
  {
    name: 'socialId',
    type: 'number',
    required: false,
    description: 'The social ID associated with the social.',
    initialValue: socialFormProps.socialId,
  },
  {
    name: 'index',
    type: 'number',
    required: true,
    description: 'The position in the array of the element being edited',
    initialValue: socialFormProps.index,
  },
  {
    name: 'url',
    type: 'string',
    required: true,
    description: 'The social media url, must be a valid link',
    initialValue: socialFormProps.url,
  },
  {
    name: 'name',
    type: 'string',
    required: false,
    description:
      'The social media name, applicable when the social media in question is not supported by default',
    initialValue: socialFormProps.name,
  },
];

const listEmits: PropItemType[] = [
  {
    name: 'error',
    type: 'void',
    description:
      "It's emitted whenever there's an error in the name or the url",
  },
  {
    name: 'no:error',
    type: 'void',
    description: "It's emitted whenever there's no error in the form",
  },
  {
    name: 'update:url',
    type: '{ url: string, socialId?: number, index: number }',
    description: "It's emitted whenever the url is updated",
  },
  {
    name: 'update:name',
    type: '{ name: string, socialId?: number, index: number }',
    description: "It's emitted whenever the name is updated",
  },
];

const examples = ref<ExampleComponentType[]>([
  {
    snippets: [
      {
        template: `<alex-profile-cards-details
            :boxes="socialFormProps.boxes"
            :hide-divider="socialFormProps.hideDivider"
          />`,
        label: 'Template',
      },
      {
        template: `const socialFormProps: SocialFormComponentType = {
  index: 1,
  url: 'url.com',
  name: 'name',
  socialId: 1,
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
