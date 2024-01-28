<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column gap-6 align-center pb-15"
  >
    <alex-documentation-header :title="title" :description="description" />
    <alex-documentation-accordions-props-list :data="listProps" show-positions/>
    <alex-documentation-example
      v-for="item in examples"
      :snippets="item.snippets"
      :title="item.title"
      :description="item.description"
    />
    <alex-documentation-playground :data="listProps">
      <template v-slot:component="{ props }">
        <alex-profile-cards-overview
          :assignments="props.assignments"
          :learning-plans="props.learning"
          :email="props.email"
          :telephone="props.telephone"
          :projects="props.projects"
        />
      </template>
    </alex-documentation-playground>
  </v-container>
</template>

<script setup lang="ts">
import { ExampleComponentType } from '~/components/alex/documentation/Example.vue';
import { PlaygroundItemType } from '~/components/alex/documentation/Playground.vue';
import { OverviewComponentType } from '~/components/alex/profile/cards/Overview.vue';

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const title = 'Card de Overview';
const description =
  "The OverviewComponent is a Vue 3 component designed to present an overview of a user's general information, including learning plans, assignments, projects, and contact details. It utilizes a custom card layout with detail boxes and contact items for a clean and organized display of the user's profile information.";
const overviewProps: OverviewComponentType = {
  assignments: 0,
  email: 'email@gmail.com',
  learningPlans: 0,
  projects: 1,
  telephone: '83987481352',
};

const listProps: PlaygroundItemType[] = [
  {
    name: 'email',
    type: 'string',
    required: false,
    description: 'User email',
    initialValue: overviewProps.email,
  },
  {
    name: 'telephone',
    type: 'string',
    required: false,
    description: 'User telephone',
    initialValue: overviewProps.telephone,
  },
  {
    name: 'assignments',
    type: 'number',
    required: false,
    default: '0',
    description: 'User assignments count',
    initialValue: overviewProps.assignments,
  },
  {
    name: 'learningPlans',
    type: 'number',
    required: false,
    default: '0',
    description: 'User learningPlans count',
    initialValue: overviewProps.learningPlans,
  },
  {
    name: 'projects',
    type: 'number',
    required: false,
    default: '0',
    description: 'User projects count',
    initialValue: overviewProps.projects,
  },
];

const examples = ref<ExampleComponentType[]>([
  {
    snippets: [
      {
        template: ` <alex-profile-cards-overview
          :assignments="overviewProps.assignments"
          :learning-plans="overviewProps.learning"
          :email="overviewProps.email"
          :telephone="overviewProps.telephone"
          :projects="overviewProps.projects"
        />`,
        label: 'Template',
      },
      {
        template: `const overviewProps: OverviewComponentType = {
  assignments: 0,
  email: 'email@gmail.com',
  learningPlans: 0,
  projects: 1,
  telephone: '83987481352',
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
