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
        <alex-profile-settings-forms-security
          :button-text="props.buttonText"
          :is-password="props.isPassword"
          :label="props.label"
          :placeholder="props.placeholder"
          :schema="props.schema"
          :value="props.value"
        />
      </template>
    </alex-documentation-playground>
  </v-container>
</template>

<script setup lang="ts">
import * as yup from 'yup';
import { ExampleComponentType } from '~/components/alex/documentation/Example.vue';
import { PlaygroundItemType } from '~/components/alex/documentation/Playground.vue';
import { PropItemType } from '~/components/alex/documentation/accordions/PropsList.vue';
import { SecurityFormComponentType } from '~/components/alex/profile/settings/forms/Security.vue';

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const title = 'Security Form';
const description =
  'The SecurityFormComponent is a Vue 3 component designed to capture and display security-related information, such as passwords or emails. It provides a flexible input field with optional password visibility toggle and a custom button for additional actions.';

const securityFormProps: SecurityFormComponentType = {
  isPassword: false,
  label: 'label',
  buttonText: 'buttonText',
  value: '',
  placeholder: 'placeholder',
  schema: yup.string().required(),
};

const listProps: PlaygroundItemType[] = [
  {
    name: 'isPassword',
    type: 'boolean',
    required: false,
    description: 'Whether the field will hide its content or not.',
    initialValue: securityFormProps.isPassword,
  },
  {
    name: 'label',
    type: 'string',
    required: true,
    description: 'The field label',
    initialValue: securityFormProps.label,
  },
  {
    name: 'placeholder',
    type: 'string',
    required: false,
    description: 'The field placeholder',
    initialValue: securityFormProps.placeholder,
  },
  {
    name: 'buttonText',
    type: 'string',
    required: true,
    description: 'The text that will be shown on the submit button',
    initialValue: securityFormProps.buttonText,
  },
  {
    name: 'value',
    type: 'string',
    required: true,
    description: "The field's initial value",
    initialValue: securityFormProps.value,
  },
  {
    name: 'schema',
    type: 'YupSchema',
    required: true,
    description: 'The yup object that will validate the field',
    initialValue: securityFormProps.schema,
  },
];

const listEmits: PropItemType[] = [
  {
    name: 'click',
    type: 'void',
    description: "It's emitted whenever the submit button is clicked",
  },
];

const examples = ref<ExampleComponentType[]>([
  {
    snippets: [
      {
        template: `<alex-profile-settings-forms-security
            :button-text="props.buttonText"
            :is-password="props.isPassword"
            :label="props.label"
            :placeholder="props.placeholder"
            :schema="props.schema"
            :value="props.value"
        />`,
        label: 'Template',
      },
      {
        template: `const securityFormProps: SecurityFormComponentType = {
  isPassword: false,
  label: 'label',
  buttonText: 'buttonText',
  value: '',
  placeholder: 'placeholder',
  schema: yup.string().required(),
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
