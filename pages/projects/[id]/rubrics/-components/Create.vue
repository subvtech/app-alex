<template>
  <alex-custom-dialog
    v-model="open"
    title="Criar nova rúbrica"
    main-button-text="Criar"
    main-button-icon="mdi-plus"
    secondary-button-icon="mdi-close"
    @on-main-action="() => console.log('Testando')"
    @on-secondary-action="open = false"
  >
    <alex-inputs-editable-text
      v-model="name"
      class="text-h2 text-gray-500 py-2 mb-4 tw-resize-none"
      tag="h2"
      placeholder="Digite o nome da rúbrica"
      cant-edit
    />
    <alex-learningplan-evaluation-rubrics :criteria="[]" :data="[]" editable />
  </alex-custom-dialog>
</template>

<script setup lang="ts">
const name = ref<string>('');

const open = defineModel<boolean>({ required: true });
</script>
