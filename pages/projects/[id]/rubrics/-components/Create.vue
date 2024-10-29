<template>
  <alex-custom-dialog
    v-model="open"
    :title="$t(`${i18Dir}.createTitle`)"
    :main-button-text="$t(`${i18Dir}.create`)"
    :secondary-button-text="$t(`${i18Dir}.cancel`)"
    main-button-icon="mdi-plus"
    secondary-button-icon="mdi-close"
    @on-main-action="() => console.log('Testando')"
    @on-secondary-action="open = false"
  >
    <alex-inputs-editable-text
      v-model="name"
      class="text-h2 text-gray-500 py-2 mb-4 tw-resize-none"
      tag="h2"
      :placeholder="$t(`${i18Dir}.typeName`)"
      cant-edit
    />
    <alex-learningplan-evaluation-rubrics :criteria="[]" :data="[]" editable />
  </alex-custom-dialog>
</template>

<script setup lang="ts">
const i18Dir = 'pages.evaluations.rubrics';

const name = ref<string>('');

const open = defineModel<boolean>({ required: true });
</script>
