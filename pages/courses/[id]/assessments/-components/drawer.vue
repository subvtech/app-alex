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
    <div
      class="rounded-lg tw-border-2 tw-border-dashed tw-w-[260px] tw-h-[120px] px-6 py-4 mt-4 mb-6 d-flex justify-center align-center"
    >
      <span class="text-body-3 text-black">
        <v-icon class="mr-2">mdi-plus</v-icon>
        Adicionar Tarefa
      </span>
    </div>
    <h3 class="text-gray-800 text-h3 my-4">Composição</h3>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
const model = defineModel({ default: true });
const title = ref('');
</script>
