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
      v-for="(item, index) in examples"
      :key="index"
      :snippets="item.snippets"
      :title="item.title"
      :description="item.description"
    >
    </alex-documentation-example>
    <alex-documentation-playground :data="listProps">
      <template #component="{ props }">
        <alex-profile-contact-item
          :icon="props.icon"
          :label="props.label"
          :value="props.value"
        />
      </template>
    </alex-documentation-playground>
  </v-container>
</template>

<script setup lang="ts">
import { ExampleComponentType } from '~/components/alex/documentation/Example.vue';
import { PlaygroundItemType } from '~/components/alex/documentation/Playground.vue';
import { ContactItemType } from '~/components/alex/profile/ContactItem.vue';

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const title = 'Contact Item';
const description =
  'É usado pra exibir informações dentro em um formato simples. Um número, um texto e um ícone.';
const contactItemProps: ContactItemType = {
  icon: 'mdi-alert-cicle',
  label: 'assignments',
  value: 'value',
};

const listProps: PlaygroundItemType[] = [
  {
    name: 'icon',
    type: 'string',
    required: true,
    description:
      'A valid mdi icon, such as mdi-alert-circle that will be displayed on the box',
    initialValue: contactItemProps.icon,
  },
  {
    name: 'label',
    type: 'string',
    required: true,
    description: 'Label that will be shown',
    initialValue: contactItemProps.label,
  },
  {
    name: 'value',
    type: 'string',
    required: true,
    description: 'value that will be shown',
    initialValue: contactItemProps.value,
  },
];

const examples = ref<ExampleComponentType[]>([
  {
    snippets: [
      {
        template: `<alex-profile-contact-item
            :icon="props.icon"
            :label="props.label"
            :value="props.value"
          />`,
        label: 'Template',
      },
      {
        template: `const contactItemProps: ContactItemType = {
    icon: 'mdi-alert-cicle',
    label: 'assignments',
   value: 'value'
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
