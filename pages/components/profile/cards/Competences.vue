<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column gap-6 align-start pb-15"
  >
    <alex-documentation-header :title="title" :description="description" />
    <alex-documentation-accordions-props-list
      :data="listProps"
      show-positions
    />
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
        <alex-profile-cards-competences
          :relation-id="props.relationId"
          :selected-tags="props.selectedTags"
          :title="props.title"
          :placeholder="props.placeholder"
          :is-general="props.isGeneral"
          :empty-message="props.emptyMessage"
          :can-edit="props.canEdit"
        />
      </template>
    </alex-documentation-playground>
  </v-container>
</template>

<script setup lang="ts">
import { ExampleComponentType } from '~/components/alex/documentation/Example.vue';
import { PlaygroundItemType } from '~/components/alex/documentation/Playground.vue';
import { PropItemType } from '~/components/alex/documentation/accordions/PropsList.vue';
import { CompetencesComponentType } from '~/components/alex/profile/cards/Competences.vue';

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const title = 'Card de Competências';
const description =
  "The CompetencesComponent is a Vue 3 component designed to manage and display a user's competences. It supports the addition, deletion, and updating of competences, providing a user-friendly interface for managing tags associated with a specific user or learning plan. The component includes features such as autocomplete, chip display, and editing controls.";
const competencesProps: CompetencesComponentType = {
  canEdit: true,
  placeholder: 'Placeholder',
  emptyMessage: "It's empty",
  relationId: 1,
  selectedTags: [],
  title: 'Title',
  isGeneral: true,
};

const listProps: PlaygroundItemType[] = [
  {
    name: 'relationId',
    type: 'number',
    required: true,
    description: 'The user or learningPlan ID associated with the tags.',
    initialValue: competencesProps.relationId,
  },
  {
    name: 'canEdit',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Whether the current user can edit the component or not.',
    initialValue: competencesProps.canEdit,
  },
  {
    name: 'isGeneral',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Indicates what kind of tags are going to be handled',
    initialValue: competencesProps.isGeneral,
  },
  {
    name: 'title',
    type: 'string',
    required: true,
    description: 'The title to be exhibited.',
    initialValue: competencesProps.title,
  },

  {
    name: 'placeholder',
    type: 'string',
    required: true,
    description: 'The Placeholder text to be used on the input',
    initialValue: competencesProps.placeholder,
  },
  {
    name: 'emptyMessage',
    type: 'string',
    required: true,
    description:
      'The text message used to indicated that no tags have been added',
    initialValue: competencesProps.emptyMessage,
  },
  {
    name: 'selectedTags',
    type: 'Tag[]',
    required: true,
    description:
      'A list with the tags associated with the user or learningplan',
    initialValue: competencesProps.selectedTags,
  },
];

const listEmits: PropItemType[] = [
  {
    name: 'update',
    type: 'void',
    description:
      "It's triggered when the user saves the information by click on the mainButton and changes are detected",
  },
];

const examples = ref<ExampleComponentType[]>([
  {
    snippets: [
      {
        template: `<alex-profile-cards-competences
          :relation-id="competencesProps.relationId"
          :selected-tags="competencesProps.selectedTags"
          :title="competencesProps.title"
          :placeholder="competencesProps.placeholder"
          :learningplan="competencesProps.learningplan"
          :is-general="competencesProps.isGeneral"
          :empty-message="competencesProps.emptyMessage"
          :can-edit="competencesProps.canEdit"
        /> `,
        label: 'Template',
      },
      {
        template: `const competencesProps: CompetencesComponentType = {
  canEdit: true,
  placeholder: 'Placeholder',
  emptyMessage: "It's empty",
  relationId: 1,
  selectedTags: [],
  title: 'Title',
  isGeneral: true,
  learningplan: true,
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
