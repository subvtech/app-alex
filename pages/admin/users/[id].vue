<template>
  <div>
    <div class="tw-flex tw-space-x-4">
      <alex-inputs-text-field
        class="tw-flex-1"
        v-model="inputText"
        name="name"
        placeholder="Nome"
        required
        info="Nome do usuário"
        label="Nome"
        :schema="schema"
      />
      <alex-inputs-text-field
        class="tw-flex-1"
        v-model="inputText"
        name="name"
        placeholder="Nome"
        required
        info="Nome do usuário"
        label="Nome"
        :schema="schema"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import * as yup from 'yup';
const route = useRoute();
const router = useRouter();

const id = route.params.id;

const inputText = ref('');
const schema = yup.string().required('Obrigatório');

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
});
</script>

<style lang="scss" scoped></style>
