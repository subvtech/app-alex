<template>
  <v-container
    class="page rounded-lg bg-white pa-6 gap-6 d-flex flex-column align-start pb-15"
  >
    <alex-documentation-header :title="title" :description="description" />
    <alex-documentation-accordions-props-list
      :data="listProps"
      title="Props"
      show-positions
    />
    <alex-documentation-example
      v-for="item in examples"
      :key="item.title"
      :snippets="item.snippets"
      :title="item.title"
      :description="item.description"
      has-example
    >
      <template #component>
        <div class="flex gap-2 p-2">
          <alex-custom-button @click="studentDrawer = true">
            Student Drawer
          </alex-custom-button>
          <alex-custom-button variant="secondary" @click="teacherDrawer = true">
            Teacher Drawer
          </alex-custom-button>
        </div>
      </template>
    </alex-documentation-example>

    <alex-learningplan-task-drawer-student
      v-model="studentDrawer"
      :messages="[]"
      :submission="{
        constraints: [],
        description: 'Teste',
        status: 'not_started',
      }"
      send-submission
      :submissions="submissions"
      :task="{ finalDate: new Date(), status: 'to_do' }"
      :student="{ name: 'Jorge santos lima', studentClass: 'Turma A' }"
    />
    <alex-learningplan-task-drawer-teacher
      v-model="teacherDrawer"
      :messages="[]"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ExampleComponentType } from '~/components/alex/documentation/Example.vue';
import { PlaygroundItemType } from '~/components/alex/documentation/Playground.vue';
definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const title = 'Tasks Drawers';
const description = 'Drawers used on tasks page';
const listProps: PlaygroundItemType[] = [
  {
    name: 'icon',
    type: 'string',
    required: true,
    description:
      'A valid mdi icon, such as mdi-alert-circle that will be displayed on the box',
    initialValue: undefined,
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

const teacherDrawer = ref(false);
const studentDrawer = ref(false);
const submissions: Array<AttachedSubmission> = [
  {
    id: 1,
    status: 'reviewed',
    time: new Date(),
    mark: 9.5,
    maxMark: 10,
    justification: {
      text: 'Amigos, a mobilidade dos capitais internacionais não pode mais se dissociar das formas de ação. A prática cotidiana prova que a crescente influência da mídia oferece uma interessante oportunidade para verificação dos relacionamentos verticais entre as hierarquias. ',
    },
  },
];
</script>
