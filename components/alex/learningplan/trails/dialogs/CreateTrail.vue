<template>
  <alex-custom-dialog
    v-model="value"
    title="Criar nova Trilha de Aprendizagem"
    name-main-button="Criar Trilha"
    name-second-button="Cancelar"
  >
    <div
      class="bg-gray-blue d-flex flex-column justify-center align-center ga-2 image-container rounded"
    >
      <p class="text-h5 text-secondary-0">Capa da Trilha</p>
      <alex-custom-button prepend-icon="mdi-pencil">
        Editar
      </alex-custom-button>
    </div>
    <alex-inputs-text-field
      class="my-6"
      label="Do que se trata sua Trilha de Aprendizagem?"
      placeholder="Digite o título da sua trilha"
      required
    />
    <alex-inputs-text-area
      label="Conte-nos mais sobre a trilha"
      placeholder="Descreva a sua trilha"
      required
    />
  </alex-custom-dialog>
</template>

<script setup>
// const value = computed({
//   get() {
//     return props.modelValue;
//   },
//   set(value) {
//     emit('update:modelValue', value);
//   },
// });
// const props = withDefaults(defineProps<{ modelValue?: boolean }>(), {
//   modelValue: false,
// });

// const emit = defineEmits(['update:modelValue', 'submit']);

// const createTrail = () => {
//   emit('update:modelValue', false);
//   emit('submit');
// };
</script>

<style scoped>
.image-container {
  height: 250px;
  width: 100%;
}
</style>
