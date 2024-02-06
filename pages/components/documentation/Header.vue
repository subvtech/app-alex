<template>
  <v-container
    class="page rounded-lg bg-white pa-6 gap-6 d-flex flex-column align-start pb-15"
  >
    <alex-documentation-header :title="title" :description="description" />
    <alex-documentation-accordions-props-list
      :data="listProps"
      show-positions
    />
    <alex-documentation-example
      v-for="item in examples"
      :snippets="item.snippets"
      :title="item.title"
      :description="item.description"
    >
    </alex-documentation-example>
    <alex-documentation-playground :data="listProps">
      <template #component="{ props }">
        <alex-documentation-header
          :title="props.title"
          :description="props.description"
          :vuetify-link="props.vuetifyLink"
        />
      </template>
    </alex-documentation-playground>
  </v-container>
</template>

<script setup lang="ts">
import { ExampleComponentType } from '~/components/alex/documentation/Example.vue';
import { HeaderComponentType } from '~/components/alex/documentation/Header.vue';
import { PlaygroundItemType } from '~/components/alex/documentation/Playground.vue';

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const title = 'Header';
const description = 'É usado como header padrão da documentation.';
const boxItemProps: HeaderComponentType = {
  title: 'My Header',
  description: 'myDescription',
  vuetifyLink: 'https://vuetifyjs.com/en/components/expansion-panels/#api',
};

const listProps: PlaygroundItemType[] = [
  {
    name: 'title',
    type: 'string',
    required: true,
    description: 'A title that describes the component being documented',
    initialValue: boxItemProps.title,
  },
  {
    name: 'description',
    type: 'string',
    required: true,
    description: 'A description about the component being documented',
    initialValue: boxItemProps.description,
  },
  {
    name: 'vuetifyLink',
    type: 'string',
    required: false,
    description:
      'When a component is but a variation from an offical vuetify component, you shall put its link here',
    initialValue: boxItemProps.vuetifyLink,
  },
];

const examples = ref<ExampleComponentType[]>([
  {
    snippets: [
      {
        template: `<alex-documentation-header
          :title="props.title"
          :description="props.description"
          :vuetifyLink="props.vuetifyLink"
        />`,
        label: 'Template',
      },
      {
        template: `const boxItemProps: HeaderComponentType = {
  title: 'My Header',
  description: 'myDescription',
  vuetifyLink: 'https://vuetifyjs.com/en/components/expansion-panels/#api',
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
