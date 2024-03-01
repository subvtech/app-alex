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
        <alex-profile-detail-boxes
          :boxes="detailsProps.boxes"
          :hide-divider="detailsProps.hideDivider"
        />
      </template>
    </alex-documentation-example>
  </v-container>
</template>

<script setup lang="ts">
import { ExampleComponentType } from '~/components/alex/documentation/Example.vue';
import { PlaygroundItemType } from '~/components/alex/documentation/Playground.vue';
import { DetailsComponentType } from '~/components/alex/profile/DetailBoxes.vue';

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const title = 'Detalhes';
const description =
  'The DetailsComponent is a Vue 3 component designed to display a set of profile details in the form of boxes. Each box includes an icon, a label, and a corresponding number. This component is versatile and can be used to showcase various types of information in a visually appealing format.';
const detailsProps: DetailsComponentType = {
  hideDivider: true,
  boxes: [
    {
      icon: 'mdi-account-outline',
      number: 0,
      label: 'students',
    },
    {
      icon: 'trails.svg',
      number: 1,
      label: 'trails',
    },
    {
      icon: 'mdi-newspaper-variant-multiple-outline',
      number: 0,
      label: 'assignments',
    },
  ],
};

const listProps: PlaygroundItemType[] = [
  {
    name: 'boxes',
    type: 'array',
    required: true,
    description: 'An array of BoxItem[], used to display said boxes.',
    initialValue: detailsProps.boxes,
  },
  {
    name: 'hideDividers',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Whether a divider below the boxes is diplayed or not',
    initialValue: detailsProps.hideDivider,
  },
];

const examples = ref<ExampleComponentType[]>([
  {
    snippets: [
      {
        template: `<alex-profile-cards-details
          :boxes="detailsProps.boxes"
          :hide-divider="detailsProps.hideDivider"
        />`,
        label: 'Template',
      },
      {
        template: `const detailsProps: DetailsComponentType = {
  hideDivider: true,
  boxes: [
    {
      icon: 'mdi-account-outline',
      number: 0,
      label: 'students',
    },
    {
      icon: 'trails.svg',
      number: 1,
      label: 'trails',
    },
    {
      icon: 'mdi-newspaper-variant-multiple-outline',
      number: 0,
      label: 'assignments',
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
