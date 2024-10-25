<template>
  <v-navigation-drawer
    v-model="model"
    location="right"
    temporary
    floating
    :width="640"
    scrim="transparent"
    sticky
    class="pa-6 pt-2 rounded-s-lg"
  >
    <template #prepend>
      <div class="d-flex align-center justify-end">
        <alex-custom-button icon="mdi-close" size="small" variant="text" @click="() => (model = false)" />
      </div>
    </template>

    <alex-inputs-editable-text
      v-model="title"
      tag="h1"
      class="mt-4 text-h2 ellipsis lines-2"
      :cant-edit="true"
      :placeholder="'(' + $t('components.learningPlan.drawer.missing.title') + ')'"
    ></alex-inputs-editable-text>

    <h3 class="text-gray-800 text-h3 my-4">Tarefas associadas</h3>
    <div class="mt-4 mb-6 d-flex gap-4">
      <div class="rounded-lg tw-border tw-w-[260px] tw-h-[120px] pa-4">
        <p class="d-flex">
          <span class="text-body-4 text-gray-800 tw-max-w-[198px] ellipsis lines-2"
            >Criar uma protótipagem para a página de dashboard</span
          >
          <span class="text-body-2 text-secondary-0">#30</span>
        </p>
        <div class="mt-4 d-flex align-center">
          <v-icon
            class="mr-2 tw-border rounded-lg tw-border-gray-200"
            size="16"
            style="height: 28px; width: 28px; padding: 6px"
            >mdi-format-list-bulleted</v-icon
          >
          <span>
            <p class="text-gray-800 text-body-4">Rubrica</p>
            <p class="text-gray-600 text-body-3">Gestão de projetos</p>
          </span>
        </div>
      </div>
      <div class="rounded-lg tw-border-2 tw-border-dashed tw-w-[260px] tw-h-[120px] d-flex justify-center align-center">
        <span class="text-body-3 text-black">
          <v-icon class="mr-2">mdi-plus</v-icon>
          Adicionar Tarefa
        </span>
      </div>
    </div>
    <h3 class="text-gray-800 text-h3 mt-6">Composição</h3>
    <p class="text-gray-600 text-body-1 my-4">
      A composição dessa avaliação é formada pela média ponderada das avaliações.
    </p>
    <div class="w-100 tw-min-h-[250px] bg-gray-blue rounded-lg d-flex justify-center align-center tw-flex-col gap-4">
      <div v-if="!selectedTasks">
        <img src="/svg/emptyComposition.svg" />
        <p class="text-gray-400 text-body-3">Parece que não foi adicionada nenhuma tarefa</p>
      </div>
      <div v-else>
        <div class="d-flex">
          <div v-for="i in 3" :key="i" class="d-flex align-center">
            <div class="pa-4 bg-white rounded-lg tw-w-[150px] d-flex justify-center align-center gap-4">
              <span class="text-secondary-0 text-body-2"> #30 </span>
              <span class="text-body-3 text-gray-500">X</span>
              <span
                class="text-body-3 text-gray-600 d-flex tw-border px-2 rounded-lg tw-h-[26px] d-flex align-center gap-1 tw-min-w-[43px]"
                style="border-color: #a0a8b1"
              >
                <alex-inputs-editable-text v-model="inputModel" tag="span" :cant-edit="true" class="d-inline" />
                <v-icon icon="mdi-pencil-outline" size="16" />
              </span>
            </div>
            <v-icon v-if="i < 3" size="20" color="gray-800" icon="mdi-plus" class="ma-2" />
          </div>
        </div>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
const model = defineModel({ default: true });
const title = ref('');
const selectedTasks = ref([]);
const inputModel = ref('1');
</script>
