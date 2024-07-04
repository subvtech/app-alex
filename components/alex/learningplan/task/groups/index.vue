<template>
  <alex-custom-dialog v-model="open" class="groups-dialog" title="Criar grupo">
    <alex-learningplan-task-groups-edit />
    <!-- <alex-custom-dialog-footer>
      <template #mainSlotButton>
        <alex-custom-button text="Salvar alterações" size="large" />
      </template>
    </alex-custom-dialog-footer> -->
  </alex-custom-dialog>
</template>

<script setup lang="ts">
const open = defineModel<boolean>({ required: true });
</script>

<style>
.groups-dialog .v-input__details {
  display: none;
}
</style>
