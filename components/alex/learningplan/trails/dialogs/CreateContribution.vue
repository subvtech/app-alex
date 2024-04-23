<template>
  <alex-custom-dialog
    v-model="dialog"
    title="Nova Contribuição"
    persistent
    main-button-text="Contribuir"
    body-classes="width-270 pa-0 bg-white"
    :max-width="1080"
    @on-main-action="saveContribution"
    @on-secondary-action="dialog = false"
  >
    <alex-inputs-text-field
      v-model="title"
      required
      label="Título"
      placeholder="Descreva do que se trata sua contribuição"
      name="contributionTitle"
      class="ma-6 mb-1"
    />
    <div class="divider"></div>
    <div class="mx-auto editor my-6">
      <app-editor ref="editorDetails" :data="data" />
    </div>
  </alex-custom-dialog>
</template>
<script setup lang="ts">
const dialog = ref(false);
const title = ref('');
const data = ref();
const editorDetails = ref();

const saveContribution = async () => {
  const res = await editorDetails.value?.getData();
  console.log(res);
};
</script>

<style scoped>
.divider {
  border-top: 1px solid #e0e0e0;
}

#editor,
.editor {
  max-width: 785px !important;
}
</style>
