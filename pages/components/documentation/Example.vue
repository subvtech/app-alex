<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column align-start pb-15"
  >
    <alex-documentation-header :title="title" :description="description" />
    <alex-documentation-accordions-props-list :data="listProps" />
    <alex-documentation-example
      v-for="item in examples"
      :key="item.title"
      :snippets="item.snippets"
      :title="item.title"
      :description="item.description"
      :has-example="item.hasExample"
    >
      <template #component>
        <alex-profile-institution-item
          :url="institutionProps.url"
          :acronym="institutionProps.acronym"
          :sector="institutionProps.sector"
          :name="institutionProps.name"
          :can-edit="institutionProps.canEdit"
          :is-deleted="institutionProps.isDeleted"
          :institution-id="institutionProps.institutionId"
          :background-color="institutionProps.backgroundColor"
        />
      </template>
    </alex-documentation-example>
  </v-container>
</template>

<script setup lang="ts">
import { ExampleComponentType } from '~/components/alex/documentation/Example.vue';
import { PlaygroundItemType } from '~/components/alex/documentation/Playground.vue';
import { InstitutionComponentType } from '~/components/alex/profile/InstitutionItem.vue';

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const title = 'Example Component';
const description =
  'O componente de example é feito pra que se possa testar um componente e exibir o código usado.';

const institutionProps: InstitutionComponentType = {
  url: 'https://picsum.photos/400/600',
  name: 'name',
  acronym: 'acronym',
  sector: 'sector',
  backgroundColor: 'bg-white',
  canEdit: true,
  isDeleted: false,
  institutionId: 1,
};

const exampleProps: ExampleComponentType = {
  snippets: [
    {
      template: `<alex-documentation-example
      v-for="item in examples"
      :snippets="item.snippets"
      :title="item.title"
      :description="item.description"
      :has-example="item.hasExample"
    >
      <template v-slot:component>
        <alex-profile-institution-item
          :url="institutionProps.url"
          :acronym="institutionProps.acronym"
          :sector="institutionProps.sector"
          :name="institutionProps.name"
          :can-edit="institutionProps.canEdit"
          :is-deleted="institutionProps.isDeleted"
          :institution-id="institutionProps.institutionId"
          :background-color="institutionProps.backgroundColor"
        />
      </template>
    </alex-documentation-example>`,
      label: 'Template',
    },
    {
      template: `const institutionProps: InstitutionComponentType = {
    url: 'https://picsum.photos/400/600',
    name: 'name',
    acronym: 'acronym',
    sector: 'sector',
    backgroundColor: 'bg-white',
    canEdit: true,
    isDeleted: false,
    institutionId: 1,
  };
  
 `,
      label: 'Script',
    },
  ],
  hasExample: true,
  title: 'Basic Usage',
  description: '',
};

const listProps: PlaygroundItemType[] = [
  {
    name: 'title',
    type: 'string',
    required: false,
    description: 'The title that will be exhibited here.',
    initialValue: exampleProps.title,
  },
  {
    name: 'description',
    type: 'string',
    required: false,
    description: 'The description that will be exhibited here.',
    initialValue: exampleProps.description,
  },
  {
    name: 'hasExample',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Defines if the slot component will be user/shown.',
    initialValue: exampleProps.hasExample,
  },
  {
    name: 'snippets',
    type: 'ExampleItemType[]',
    required: true,
    description:
      'The List with the examples that will be used and copied in the component.',
    initialValue: exampleProps.snippets,
  },
];

const examples = ref<ExampleComponentType[]>([
  {
    snippets: [
      {
        template: `<alex-documentation-example
      v-for="item in examples"
      :snippets="item.snippets"
      :title="item.title"
      :description="item.description"
      :has-example="item.hasExample"
    >
      <template v-slot:component>
        <alex-profile-institution-item
          :url="institutionProps.url"
          :acronym="institutionProps.acronym"
          :sector="institutionProps.sector"
          :name="institutionProps.name"
          :can-edit="institutionProps.canEdit"
          :is-deleted="institutionProps.isDeleted"
          :institution-id="institutionProps.institutionId"
          :background-color="institutionProps.backgroundColor"
        />
      </template>
    </alex-documentation-example>`,
        label: 'Template',
      },
      {
        template: `const institutionProps: InstitutionComponentType = {
    url: 'https://picsum.photos/400/600',
    name: 'name',
    acronym: 'acronym',
    sector: 'sector',
    backgroundColor: 'bg-white',
    canEdit: true,
    isDeleted: false,
    institutionId: 1,
  };
    
    
    const exampleProps: ExampleComponentType = {
        snippets: [
            {
            template: "<alex-documentation-playground
                    :title="playgroundProps.title"
                    :data="playgroundProps.data"
                />",
            label: 'Template',
            },
            {
            template: "const institutionProps: InstitutionComponentType = {
                url: 'https://picsum.photos/400/600',
                name: 'name',
                acronym: 'acronym',
                sector: 'sector',
                backgroundColor: 'bg-white',
                canEdit: true,
                isDeleted: false,
                institutionId: 1,
            }; 
            label: 'Script',
            },
        ],
        hasExample: true,
        title: 'Basic Usage',
        description: '',
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
