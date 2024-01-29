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
        <alex-profile-box-item
          :icon="props.icon"
          :label="props.label"
          :number="props.number"
        />
      </template>
    </alex-documentation-playground>
  </v-container>
</template>

<script setup lang="ts">
import { ExampleComponentType } from '~/components/alex/documentation/Example.vue';
import { PlaygroundItemType } from '~/components/alex/documentation/Playground.vue';
import { BoxItemType } from '~/components/alex/profile/BoxItem.vue';

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const title = 'Box Item';
const description = "É usado pra exibir informações dentro de uma caixa. Um número, um texto e um ícone.s"
const boxItemProps: BoxItemType = {
  icon: 'mdi-alert-cicle',
  label: 'assignments',
  number: 0,
};

const listProps: PlaygroundItemType[] = [
  {
    name: 'icon',
    type: 'string',
    required: true,
    description:
      'A valid mdi icon, such as mdi-alert-circle that will be displayed on the box',
    initialValue: boxItemProps.icon,
  },
  {
    name: 'label',
    type: 'trails | assignments | students | projects | courses',
    required: true,
    description: 'Label that will be shown',
    initialValue: boxItemProps.label,
  },
  {
    name: 'number',
    type: 'number',
    required: false,
    default: '0',
    description: 'Number that represents the counter',
    initialValue: boxItemProps.number,
  },
];

const examples = ref<ExampleComponentType[]>([
  {
    snippets: [
      {
        template: `<alex-profile-box-item
          :icon="props.icon"
          :label="props.label"
          :number="props.number"
        />`,
        label: 'Template',
      },
      {
        template: `const boxItemProps: BoxItemType = {
  icon: 'mdi-alert-cicle',
  label: 'assignments',
  number: 0,
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
