<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column gap-6 align-center pb-15"
  >
    <alex-documentation-header :title="title" :description="description" />
    <alex-documentation-accordions-props-list
      :data="listProps"
      show-positions
    />
    <alex-documentation-accordions-props-list :data="listEmits" list-emits />
    <alex-documentation-example
      v-for="item in examples"
      :snippets="item.snippets"
      :title="item.title"
      :description="item.description"
    />
    <alex-documentation-example
      v-for="item in examples"
      :snippets="item.snippets"
      :title="item.title"
      :description="item.description"
      :has-example="item.hasExample"
    >
      <template v-slot:component>
        <alex-profile-settings-basic-info
          :fullname="basicInfoProps.fullname"
          :cpf="basicInfoProps.cpf"
          :phone="basicInfoProps.phone"
        /> </template
    ></alex-documentation-example>
  </v-container>
</template>

<script setup lang="ts">
import { ExampleComponentType } from '~/components/alex/documentation/Example.vue';
import { PlaygroundItemType } from '~/components/alex/documentation/Playground.vue';
import { PropItemType } from '~/components/alex/documentation/accordions/PropsList.vue';
import { BasicInfoComponentType } from '~/components/alex/profile/settings/BasicInfo.vue';

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const title = 'Card de BasicInfo';
const description =
  'The BasicInfoComponent is a Vue 3 component designed for managing and updating basic user information such as full name, phone number, and CPF (Cadastro de Pessoas Físicas) in a user profile. It includes input fields, validation, and buttons for canceling and saving changes.';

const basicInfoProps: BasicInfoComponentType = {
  fullname: 'User user user',
  cpf: '05088424094',
  phone: '83987481352',
};

const listProps: PlaygroundItemType[] = [
  {
    name: 'fullname',
    type: 'string',
    required: true,
    description: 'User fullname',
    initialValue: basicInfoProps.fullname,
  },
  {
    name: 'cpf',
    type: 'string',
    required: true,
    description: 'User cpf, cant be edited',
    initialValue: basicInfoProps.cpf,
  },
  {
    name: 'phone',
    type: 'string',
    required: false,
    description: 'User telephone',
    initialValue: basicInfoProps.phone,
  },
];

const listEmits: PropItemType[] = [
  {
    name: 'update',
    type: '{ fullname: string; phone: string }',
    description:
      "It's triggered when the user saves the information by clicking on the mainButton",
  },
];

const examples = ref<ExampleComponentType[]>([
  {
    snippets: [
      {
        template: `<alex-profile-settings-basic-info
          :fullname="basicInfoProps.fullname"
          :cpf="basicInfoProps.cpf"
          :phone="basicInfoProps.phone"
        />`,
        label: 'Template',
      },
      {
        template: `const basicInfoProps: BasicInfoComponentType = {
  fullname: 'User user user',
  cpf: '05088424094',
  phone: '83987481352',
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
