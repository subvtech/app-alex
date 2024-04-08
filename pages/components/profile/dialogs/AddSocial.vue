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
      has-example
    >
      <template #component>
        <alex-profile-dialogs-add-social
          :socials="addSocialProps.socials"
          @save:social="() => {}"
        /> </template
    ></alex-documentation-example>
  </v-container>
</template>

<script setup lang="ts">
import { ExampleComponentType } from '~/components/alex/documentation/Example.vue';
import { PlaygroundItemType } from '~/components/alex/documentation/Playground.vue';
import { PropItemType } from '~/components/alex/documentation/accordions/PropsList.vue';
import { AddSocialComponentType } from '~/components/alex/profile/dialogs/AddSocial.vue';
const i18n = useI18n();
definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const title = 'Dialog Add Social';
const description =
  'The AddSocialComponent is a Vue 3 component designed to allow users to add new social media profiles to their profiles. It provides a button that, when clicked, opens a dialog where users can input information such as the social media platform, URL, and name. ';
const addSocialProps: AddSocialComponentType = {
  socials: [
    'Youtube',
    'Instagram',
    'Linkedin',
    i18n.t('components.profile.socials.otherSocial'),
  ],
};

const listProps: PlaygroundItemType[] = [
  {
    name: 'socials',
    type: 'string[]',
    required: true,
    description:
      'A list with the social media names that the user will choose from',
    initialValue: addSocialProps.socials,
  },
];

const listEmits: PropItemType[] = [
  {
    name: 'save:social',
    type: 'void',
    description:
      'It emits when the user saves the information by click on the mainButton.',
  },
];

const examples = ref<ExampleComponentType[]>([
  {
    snippets: [
      {
        template: `<alex-profile-dialogs-add-social
          :socials="addSocialProps.socials"
          @save:social="() => {}"
        />`,
        label: 'Template',
      },
      {
        template: `const addSocialProps: AddSocialComponentType = {
  socials: [
    'Youtube',
    'Instagram',
    'Linkedin',
    i18n.t('components.profile.socials.otherSocial'),
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
