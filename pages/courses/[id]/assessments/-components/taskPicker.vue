<template>
  <alex-custom-dialog v-model="openDialog">
    <alex-inputs-select label="Quais tarefas deseja associar?" placeholder="Selecione as tarefas" :items="items">
      <template #item>
        <div class="pa-2 tw-cursor-pointer w-100 hover:tw-bg-green">
          <p class="text-body-2 ellipsis lines-1 text-primary-0 mb-2">Criar mapa mental sobre o vídeo</p>
          <div class="text-body-5 text-gray-600">
            <alex-custom-chip prepend-icon="mdi-calendar" text="20 Abr 2024" class="px-2 mr-2" status="secondary" />
            <span>
              <v-icon size="16" icon="mdi-account-multiple" />
              Grupo
            </span>
          </div>
        </div>
      </template>
    </alex-inputs-select>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
const openDialog = defineModel({ default: false });
const items = [1, 2, 3, 4, 5];
</script>
