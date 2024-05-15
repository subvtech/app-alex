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
        <alex-learningplan-tasks-empty-state :index="i" />
        <alex-learningplan-tasks-table :index="i" />
        <div v-if="i === 1" class="mb-4">
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

const handleCreateTask = () => {
  if (!taskTitle.value) return;
  console.log('Criar tarefa', taskTitle.value);
  taskTitle.value = '';
  isCreatingTask.value = false;
};

const toggleExpand = (index: number) => {
  expand.value[index - 1] = !expand.value[index - 1] ? -1 : 0;
};

const taskSections = ['Rascunho', 'Publicadas', 'Encerradas'];
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
</style>
