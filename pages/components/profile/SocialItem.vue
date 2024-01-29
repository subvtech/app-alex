<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column gap-6 align-center pb-15"
  >
    <alex-documentation-header :title="title" :description="description" />
    <alex-documentation-accordions-props-list :data="listProps" />
    <alex-documentation-example
      v-for="item in examples"
      :snippets="item.snippets"
      :title="item.title"
      :description="item.description"
      has-example
    >
      <template v-slot:component>
        <alex-profile-social-item
          :content-data="socialItemProps.contentData"
          :icon="socialItemProps.icon"
          :title="socialItemProps.title"
        /> </template
    ></alex-documentation-example>
  </v-container>
</template>

<script setup lang="ts">
import { ExampleComponentType } from '~/components/alex/documentation/Example.vue';
import { PlaygroundItemType } from '~/components/alex/documentation/Playground.vue';
import { SocialItemComponentType } from '~/components/alex/profile/SocialItem.vue';

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const title = 'SocialItem';
const description =
  'É um component que exibe informações de uma rede social, se houver uma url ele vai redirecionar ao clique';
const socialItemProps: SocialItemComponentType = {
  contentData: {
    url: 'google.com',
  },
  title: 'Instagram',
  icon: 'mdi-information',
};

const listProps: PlaygroundItemType[] = [
  {
    name: 'title',
    type: 'string',
    required: true,
    description: 'The social media name',
    initialValue: socialItemProps.title,
  },

  {
    name: 'icon',
    type: 'string',
    required: true,
    description: 'A valid mdi icon',
    initialValue: socialItemProps.icon,
  },
  {
    name: 'contentData',
    type: 'object',
    required: false,
    description:
      'An object, it is expected to contain a { url: string } property',
    initialValue: socialItemProps.contentData,
  },
];

const examples = ref<ExampleComponentType[]>([
  {
    snippets: [
      {
        template: `<alex-profile-social-item
          :content-data="socialItemProps.contentData"
          :icon="socialItemProps.icon"
          :title="socialItemProps.title"
        />`,
        label: 'Template',
      },
      {
        template: `const socialItemProps: SocialItemComponentType = {
  contentData: {
    url: 'google.com',
  },
  title: 'Instagram',
  icon: 'mdi-information',
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
