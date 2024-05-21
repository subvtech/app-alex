<template>
  <v-expansion-panels
    v-for="i in 3"
    :key="i"
    v-model="expand[i - 1]"
    class="task-accordion"
  >
    <v-expansion-panel>
      <v-expansion-panel-title class="cursor-default" disabled hide-actions>
        <v-icon
          :icon="expand[i - 1] === 0 ? 'mdi-chevron-down' : 'mdi-chevron-up'"
          @click="toggleExpand(i)"
        />
        <span class="text-h5 text-gray-800">{{ taskSections[i - 1] }}</span>
        <alex-custom-chip status="secondary" text="0"></alex-custom-chip>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <alex-learningplan-tasks-empty-state
          v-if="!tasks[i - 1].length"
          :index="i"
        />
        <alex-learningplan-tasks-table
          v-else
          :index="i"
          :tasks="tasks[i - 1]"
          :filter="search"
          @delete-task="handleDeleteTask"
        />
        <div v-if="i === 1" class="mb-4">
          <Transition mode="out-in" name="add-task">
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
                @keyup.enter="handleCreateTask"
              />
              <alex-custom-button size="large" @click="handleCreateTask">
                Adicionar
              </alex-custom-button>
            </div>
          </Transition>
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
// import { Task } from "@/models/task.model"
interface TasksType {
  id: number;
  status: string;
  name: string;
  deadline?: string;
  type?: string;
  students?: { name: string; image?: { url: string } }[];
  delivered?: {
    toDo: number;
    doing: number;
    underReview: number;
    completed: number;
  };
}

defineProps<{
  search: string;
}>();

const expand = ref([0, 0, 0]);
const isCreatingTask = ref(false);
const taskTitle = ref('');
const handleCreateTask = () => {
  if (!taskTitle.value) return;
  tasksArray.value.push({
    id: Math.floor(Math.random() * 100),
    name: taskTitle.value,
    status: 'draft',
  });
  taskTitle.value = '';
  isCreatingTask.value = false;
};
const toggleExpand = (index: number) => {
  isCreatingTask.value = false;
  taskTitle.value = '';
  expand.value[index - 1] = !expand.value[index - 1] ? -1 : 0;
};
const taskSections = ['Rascunho', 'Publicadas', 'Encerradas'];

const tasksArray = ref<TasksType[]>([]);

onMounted(() => {
  setTimeout(() => {
    const tasks = [
      {
        name: 'Criar um mapa mental sobre o vídeo',
        deadline: '10/10/2024',
        status: 'draft',
        type: 'individual',
        students: [
          { name: 'João', image: { url: 'https://picsum.photos/100/100' } },
          { name: 'Maria Santos' },
        ],
        delivered: {
          toDo: 1,
          doing: 1,
          underReview: 2,
          completed: 6,
        },
      },
      {
        name: 'Ler as páginas 9-12, 19-23 do livro',
        deadline: '05/16/2024',
        status: 'published',
        type: 'group',
        students: [
          { name: 'João', image: { url: 'https://picsum.photos/110/100' } },
          { name: 'Maria', image: { url: 'https://picsum.photos/100/110' } },
          { name: 'José', image: { url: 'https://picsum.photos/110/105' } },
          { name: 'Ana', image: { url: 'https://picsum.photos/120/100}' } },
          { name: 'Carlos', image: { url: 'https://picsum.photos/100/120}' } },
        ],
        delivered: {
          toDo: 1,
          doing: 1,
          underReview: 2,
          completed: 6,
        },
      },
      {
        name: 'Criar uma protótipagem para a página de dashboard e depois assistir o jogo do Flamengo contra o bolivar que o flamengo tem que e vai ganhar pelo amor de Deus',
        deadline: '05/11/2024',
        status: 'published',
        type: 'group',
        students: [
          { name: 'João', image: { url: 'https://picsum.photos/110/100' } },
          { name: 'Maria', image: { url: 'https://picsum.photos/100/110' } },
          { name: 'José', image: { url: 'https://picsum.photos/110/105' } },
          { name: 'Ana', image: { url: 'https://picsum.photos/120/100}' } },
          { name: 'Carlos', image: { url: 'https://picsum.photos/100/120}' } },
        ],
      },
      {
        name: 'Ser feliz né',
        deadline: '05/17/2024',
        status: 'closed',
        type: 'group',
        students: [
          { name: 'João', image: { url: 'https://picsum.photos/110/100' } },
          { name: 'Maria', image: { url: 'https://picsum.photos/100/110' } },
          { name: 'José', image: { url: 'https://picsum.photos/110/105' } },
          { name: 'Ana', image: { url: 'https://picsum.photos/120/100}' } },
          { name: 'Carlos', image: { url: 'https://picsum.photos/100/120}' } },
        ],
      },
    ];
    tasks.forEach((task, index) => {
      tasksArray.value.push({ ...task, id: index + 1 });
    });
  }, 1000);
});

const tasks = computed(() => {
  const draft: TasksType[] = [];
  const published: TasksType[] = [];
  const closed: TasksType[] = [];
  tasksArray.value.forEach((task) => {
    if (task.status === 'draft') draft.push(task);
    if (task.status === 'published') published.push(task);
    if (task.status === 'closed') closed.push(task);
  });
  return [draft, published, closed];
});

const handleDeleteTask = (id: number) => {
  tasksArray.value = tasksArray.value.filter((task) => task.id !== id);
};
</script>

<style>
.cursor-default {
  cursor: default;
}

.create-task-btn {
  border: 1px dashed var(--Cinza-Cinza-600, #6e7a87);
}

.task-accordion {
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  .v-theme--mainTheme {
    --v-border-opacity: unset !important;
  }

  .v-expansion-panel-text__wrapper {
    padding: 0 16px !important;
  }

  .v-expansion-panel-title {
    transition: all 0.3s ease;
    height: 52px !important;
    justify-content: flex-start !important;
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

.add-task-enter-active {
  transition: all 0.5s ease-in-out;
}

.add-task-enter-from,
.add-task-leave-to {
  opacity: 0;
}
</style>
