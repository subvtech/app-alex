<template>
  <v-expansion-panels
    v-for="i in 3"
    :key="i"
    v-model="expand[i - 1]"
    class="task-accordion"
  >
    <v-expansion-panel>
      <v-expansion-panel-title>
        <alex-custom-chip status="secondary" text="0"></alex-custom-chip>
        <span class="text-h5 text-gray-800">{{
          taskSections[i - 1].title
        }}</span>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div class="w-100 d-flex justify-center align-center pb-4">
          <div class="py-4 pb-4">
            <v-img
              :src="taskSections[i - 1].image"
              class="max-w-40 mb-4 mx-auto"
            ></v-img>
            <p class="text-h4 text-gray-400">{{ taskSections[i - 1].text }}</p>
          </div>
        </div>
        <div v-if="i === 1 && learningPlanStore.userIsFacilitator" class="mb-4">
          <alex-custom-button
            v-if="!isCreatingTask"
            size="large"
            variant="text"
            prepend-icon="mdi-plus"
            class="w-100 create-task-btn"
            @click="isCreatingTask = true"
          >
            Adicionar tarefa
          </alex-custom-button>
          <div v-else class="d-flex ga-2">
            <alex-inputs-text-field
              v-model="taskTitle"
              placeholder="Digite o titulo da tarefa"
              class="w-100"
              density="comfortable"
              name="taskTitle"
              hide-details
            />
            <alex-custom-button size="large" @click="handleCreateTask">
              Adicionar
            </alex-custom-button>
          </div>
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
const expand = ref([0, 0, 0]);
const isCreatingTask = ref(false);
const taskTitle = ref('');
const learningPlanStore = useLearningPlanStore();

const handleCreateTask = () => {
  if (!taskTitle.value) return;
  console.log('Criar tarefa', taskTitle.value);
  taskTitle.value = '';
  isCreatingTask.value = false;
};

const taskSections = [
  {
    title: 'Rascunho',
    text: 'Nenhuma tarefa em rascunho!',
    image: '/images/emptyDraftTasks.svg',
  },
  {
    title: 'Publicadas',
    text: 'Nenhuma tarefa publicada!',
    image: '/images/emptyPublishedTasks.svg',
  },
  {
    title: 'Encerradas',
    text: 'Nenhuma tarefa encerrada!',
    image: '/images/emptyFinishedTasks.svg',
  },
];

// const tasks = [
//   {
//     name: 'Criar um mapa mental sobre o vídeo',
//     deadline: '10/10/2024',
//     type: 'individual',
//     students: [
//       { name: 'João', avatar: 'https://picsum.photos/100/100' },
//       { name: 'Maria Santos' },
//     ],
//     delivered: 1,
//   },
//   {
//     name: 'Ler as páginas 9-12, 19-23 do livro',
//     deadline: '05/11/2024',
//     type: 'group',
//     students: [
//       { name: 'João', avatar: 'https://picsum.photos/110/100' },
//       { name: 'Maria', avatar: 'https://picsum.photos/100/110' },
//       { name: 'José', avatar: 'https://picsum.photos/110/110' },
//     ],
//     delivered: -1,
//   },
//   {},
// ];
</script>

<style>
.create-task-btn {
  border: 1px dashed var(--Cinza-Cinza-600, #6e7a87);
}

.task-accordion {
  .v-theme--mainTheme {
    --v-border-opacity: unset !important;
  }

  .v-expansion-panel-text__wrapper {
    padding: 0 16px !important;
  }

  .v-expansion-panel-title {
    transition: all 0.3s ease;
    height: 52px !important;
    flex-direction: row-reverse !important;
    justify-content: flex-end !important;
    gap: 8px;
    width: 100%;
    padding: 16px;
    background-color: transparent !important;
    border-radius: 16px;
  }

  .v-expansion-panel-title__overlay {
    display: none;
  }

  .v-expansion-panel-title--active {
    background-color: #fff !important;
    height: 60px !important;
    min-height: 60px !important;
  }

  .v-expansion-panel-title:hover:not(:has(.delete-btn:hover)) {
    background-color: #fff !important;
  }

  .v-expansion-panel__shadow {
    display: none !important;
  }

  .v-expansion-panel-title__icon {
    margin-inline-start: 0 !important;
  }

  .v-expansion-panel__shadow {
    display: none !important;
  }
}
</style>
