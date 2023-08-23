<template>
  <v-container class="pa-0 d-flex flex-column h-75 mid-container mt-220">
    <div class="mb-10">
      <p class="text-white text-h4 text-center font-weight-bold mb-4">
        Esqueceu a senha?
      </p>
      <p class="text-white text-h6 font-weight-regular text-center my-2">
        Digite seu e-mail e enviaremos instruções
      </p>
    </div>
    <v-form
      ref="form"
      v-model="validForm"
      color="white"
      class="mb-10"
      :update:modelValue="!validForm ? (errorMessage = false) : null"
      @submit.prevent="sendEmail"
    >
      <v-text-field
        v-model="email"
        label="Email"
        class="mb-6"
        variant="outlined"
        density="comfortable"
        :rules="emailRules"
      >
        <template #details>
          <span v-if="errorMessage" class="text-error w-100"
            >Ocorreu um erro ao enviar o e-mail, tente novamente mais
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
        >RECUPERAR SENHA</v-btn
      >
    </v-form>
    <ForgotPasswordDividerRow />
    <p class="text-center text-body-1">
      Lembrou da senha?
      <NuxtLink to="/login" class="text-decoration-none text-accent"
        >acesse aqui!</NuxtLink
      >
    </p>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const { emailRules } = useFormRules();
const validForm = ref(false);
const email = ref('');
const form = ref(null);
const loading = ref(false);
const errorMessage = ref(false);
const messageStore = useMessageStore();
const { forgotPassword } = useStrapiAuth();
const emit = defineEmits(['confirmation-message']);

const sendEmail = async () => {
  loading.value = true;
  errorMessage.value = false;
  try {
    await forgotPassword({ email: email.value });
    emit('confirmation-message', email.value);
    loading.value = false;
  } catch (error) {
    messageStore.message = error as string;
    errorMessage.value = true;
    loading.value = false;
  }
};
</script>
