<template>
  <v-container class="pa-0 d-flex flex-column h-75 mid-container mt-220">
    <div class="mb-10">
      <p class="text-white text-h4 text-center font-weight-bold mb-4">
        Cadastre sua nova senha
      </p>
      <p class="text-white text-h6 font-weight-regular text-center my-2">
        Digite sua nova senha e a confirmação
      </p>
    </div>
    <v-form
      ref="form"
      v-model="validForm"
      color="white"
      class="mb-10"
      :update:modelValue="!validForm ? (errorMessage = false) : null"
      @submit.prevent="changePassword"
    >
      <v-text-field
        v-model="password"
        label="Senha"
        class="mb-2"
        rounded="lg"
        variant="outlined"
        density="comfortable"
        :rules="validatePassword"
        type="password"
      >
      </v-text-field>
      <v-text-field
        v-model="passwordConfirmation"
        label="Confirmação"
        class="mb-6"
        rounded="lg"
        variant="outlined"
        density="comfortable"
        :rules="validatePasswordConfirmation"
        type="password"
      >
        <template #details>
          <span v-if="errorMessage" class="text-error w-100"
            >Ocorreu um erro ao alterar a senha, tente novamente mais tarde.
            tarde.</span
          >
        </template>
      </v-text-field>
      <v-btn
        :color="!validForm ? 'grey-darken-1' : 'accent'"
        class="text-none text-white rounded-lg pa-5"
        block
        type="submit"
        size="large"
        :disabled="!validForm"
        :loading="loading"
      >
        ALTERAR SENHA</v-btn
      >
    </v-form>
    <orRow />
    <p class="text-center text-body-1">
      Lembrou da senha?
      <NuxtLink to="/login" class="text-accent text-decoration-none">
        acesse aqui!
      </NuxtLink>
    </p>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import orRow from './DividerRow.vue';
const messageStore = useMessageStore();
const { resetPassword } = useStrapiAuth();

const password = ref('');
const passwordConfirmation = ref('');
const validForm = ref(false);
const form = ref(null);
const loading = ref(false);
const errorMessage = ref(false);
const route = useRoute();

const emit = defineEmits(['confirmation-message']);

const validatePassword = ref([
  (password) =>
    password.length > 7 || 'A senha deve ter no mínimo 8 caracteres',
  (password) =>
    (/[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /\W/.test(password)) ||
    'A senha deve conter uma combinação de letras maiúsculas e minusculas, números e símbolos',
  (password) => {
    if (passwordConfirmation.value && password !== passwordConfirmation.value) {
      return 'A confirmação deve ser igual à senha';
    }
    return true;
  },
]);

const validatePasswordConfirmation = ref([
  (passwordConfirmation) =>
    passwordConfirmation === password.value ||
    'A confirmação deve ser igual a senha',
  (passwordConfirmation) =>
    !!passwordConfirmation || 'A confirmação é obrigatória',
]);

const changePassword = async () => {
  loading.value = true;
  errorMessage.value = false;
  try {
    await resetPassword({
      code: route.query.code as string,
      password: password.value,
      passwordConfirmation: passwordConfirmation.value,
    });
    emit('confirmation-message');
    loading.value = false;
  } catch (error) {
    messageStore.message = error as string;
    errorMessage.value = true;
    loading.value = false;
  }
};
</script>
