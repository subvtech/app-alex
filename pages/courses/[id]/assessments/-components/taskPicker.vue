<template>
  <alex-custom-dialog
    v-model="openDialog"
    :loading="isLoading"
    @on-main-action="() => associateTasks()"
    @on-secondary-action="openDialog = false"
  >
    <alex-inputs-select
      v-model="selectedTasks"
      name="tasks"
      class="ellipsis lines-1"
      label="Quais tarefas deseja associar?"
      placeholder="Selecione as tarefas"
      no-data-text="Nenhuma tarefa com modo de avaliação associado foi encontrada"
      :items="props.available"
      item-title="title"
      item-value="id"
      multiple
      hide-details
    >
      <template #item="{ props: task, item }">
        <v-list-item class="pa-1" v-bind="task" title="">
          <template #default>
            <div class="px-6 py-4 w-100">
              <p class="text-body-2 ellipsis lines-1 text-primary-0 mb-2">{{ task?.title }}</p>
              <div class="text-body-5 text-gray-600">
                <alex-custom-chip
                  prepend-icon="mdi-calendar"
                  :text="formattedDate(item.raw?.date)"
                  class="px-2 mr-2"
                  status="secondary"
                  size="x-small"
                />
                <span v-if="item.raw?.isGroup">
                  <v-icon size="16" icon="mdi-account-multiple" />
                  Grupo
                </span>
                <span v-else>
                  <v-icon size="16" icon="mdi-account-multiple" />
                  Individual
                </span>
              </div>
            </div>
          </template>
        </v-list-item>
      </template>
    </alex-inputs-select>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
// eslint-disable-next-line import/no-duplicates
import { format } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import { enIN, ptBR } from 'date-fns/locale';
const i18n = useI18n();
const openDialog = defineModel({ default: false });
const isLoading = ref(false);
const props = defineProps<{
  available: any[];
}>();

const selectedTasks = ref([]);

const emit = defineEmits(['onAssociateTasks']);

const formattedDate = (date: string): string => {
  return format(new Date(date.split('T')[0]), 'dd MMM yyyy', { locale: i18n.locale.value === 'en' ? enIN : ptBR });
};

const associateTasks = () => {
  isLoading.value = true;
  emit('onAssociateTasks', selectedTasks.value);
};
</script>
