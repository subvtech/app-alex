<template>
  <div class="mt-8 bg-white rounded-lg py-6 px-4 md:p-6">
    <!-- Inputs -->
    <div class="d-flex align-center ga-3">
      <alex-inputs-text-field
        name="aluno"
        :placeholder="$t('components.courses.tasks.srchStudent')"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        class="w-full mr-auto min-w-40 max-w-80"
        density="comfortable"
      />
      <!-- Deixar filtrar funcional -->
      <v-tooltip text="Filtrar" location="bottom" content-class="bg-gray-800">
        <template #activator="{ props }">
          <alex-custom-button
            v-bind="props"
            icon="mdi-filter-variant"
            size="large"
            variant="secondary"
            @click="handleClickFilter"
          />
        </template>
      </v-tooltip>
    </div>

    <!-- "Hr" decorativo -->
    <v-divider class="my-4" />

    <!-- Categorias e seus respectivos alunos -->
    <div
      class="w-full flex gap-4 pa-0 overflow-x-auto overflow-y-hidden scroll-snap-mandatory"
    >
      <alex-learningplan-task-kanban-column
        v-for="(column, index) in columns"
        :id="index"
        :key="index"
        :tasks="column.tasks"
        :title="column.title"
        :color="column.color"
        @click:card="handleClickCard"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const columns = ref<
  {
    title: string;
    color: 'orange' | 'green' | 'blue' | 'gray';
    tasks: any[];
  }[]
>([
  {
    title: 'A fazer',
    color: 'gray',
    tasks: [
      {
        status: 'to_do',
        date: new Date(),
        studentClass: 'Classe A',
        user: {
          name: 'Jorge',
        },
        mark: 1,
        maxMark: 10,
      },
      {
        status: 'to_do',
        date: new Date(),
        studentClass: 'Classe b',
        user: {
          name: 'Jorge',
        },
        mark: 1,
        maxMark: 10,
      },
      {
        status: 'to_do',
        date: new Date(),
        studentClass: 'Classe c',
        user: {
          name: 'Jorge',
        },
        mark: 1,
        maxMark: 10,
      },
    ],
  },
  {
    title: 'Em andamento',
    color: 'blue',
    tasks: [
      {
        status: 'in_progress',
        date: new Date(),
        studentClass: 'Classe A',
        user: {
          name: 'Jorge',
        },
        mark: 1,
        maxMark: 10,
      },
      {
        status: 'in_progress',
        date: new Date(),
        studentClass: 'Classe A',
        user: {
          name: 'Jorge',
        },
        mark: 1,
        maxMark: 10,
      },
    ],
  },
  {
    title: 'Em avaliação',
    color: 'orange',
    tasks: [],
  },
  {
    title: 'Concluído',
    color: 'green',
    tasks: [],
  },
]);
// interface Kanban {}
const emit = defineEmits(['clickFilter', 'clickCard']);
const handleClickFilter = () => {
  emit('clickFilter');
};
const handleClickCard = () => {
  emit('clickCard');
};
</script>

<style scoped>
.scroll-snap-mandatory {
  scroll-snap-type: x mandatory;
}
</style>
