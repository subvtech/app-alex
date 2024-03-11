<template>
  <alex-custom-dialog
    v-model="model"
    activator="parent"
    title="Adicionar nova turma"
    body-classes="pa-6 bg-white"
  >
    <v-form class="test" @submit="onSubmit">
      <alex-inputs-text-field
        name="className"
        label="Qual o nome da turma?"
        required
      />
      <alex-inputs-autocomplete
        name="responsible"
        label="Quem será o colaborador responsável pela turma?"
        required
      />
    </v-form>
    <template #footer>
      <alex-custom-dialog-footer>
        <template #mainSlotButton>
          <alex-custom-button
            :text="$t(`components.courses.meeting.${data ? 'save' : 'add'}`)"
            size="large"
            type="submit"
            :prepend-icon="data ? 'mdi-check' : 'mdi-plus'"
          />
        </template>
        <template #secondarySlotButton>
          <alex-custom-button
            :text="$t('components.courses.meeting.cancel')"
            variant="secondary"
            size="large"
            prepend-icon="mdi-close"
            @click="model = false"
          />
        </template>
      </alex-custom-dialog-footer>
    </template>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
type ClassData = { className: string; userId: number } | null;
const model = ref(false);
const data = defineModel<ClassData>('data', {
  default: null,
});
const emit = defineEmits(['onSubmit']);
const { handleSubmit } = useForm({
  initialValues: {
    class: data.value?.className,
    userId: data.value?.userId,
  },
});
const onSubmit = handleSubmit((values) => {
  emit('onSubmit', values);
});
</script>

<style lang="scss" scoped>
.test {
  height: auto;
}
</style>
