<template>
  <v-container class="pa-0 d-flex flex-column h-75 mid-container mt-220">
    <div class="mb-10">
      <p class="text-white text-h4 text-center font-weight-bold mb-4">
        {{ t('forgotPassword') }}
      </p>
      <p class="text-white text-h6 font-weight-regular text-center my-2">
        {{ t('enterEmail') }}
      </p>
    </div>
    <v-form ref="form" color="white" class="mb-10" @submit.prevent="submit">
      <alex-inputs-stepper-field
        :label="t('email')"
        name="email"
        color="white"
        class="my-3 text-secondary"
        theme="dark"
      />
      <span v-if="submitError" class="text-error w-100">{{
        t('emailError')
      }}</span>

      <v-btn
        :color="!isValid ? 'grey-darken-1' : 'accent'"
        class="text-none text-white rounded-lg pa-5"
        block
        type="submit"
        size="large"
        :disabled="!isValid"
        :loading="loading"
        >{{ t('recoverPassword') }}</v-btn
      >
    </v-form>
    <ForgotPasswordDividerRow />
    <p class="text-center text-body-1">
      {{ t('recalledPassword') }}
      <NuxtLink to="/login" class="text-decoration-none text-accent">{{
        t('login')
      }}</NuxtLink>
    </p>
  </v-container>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
const { t } = useI18n({
  inheritLocale: true,
});
const { emailRules } = useFormRules();
const form = ref(null);
const submitError = ref(false);
const loading = ref(false);
const messageStore = useMessageStore();
const { forgotPassword } = useStrapiAuth();
const emit = defineEmits(['confirmation-message']);

const { handleSubmit, errors, values, controlledValues } = useForm({
  validationSchema: emailRules,
  keepValuesOnUnmount: true,
});

const isValid = computed(
  () =>
    !Object.values(controlledValues.value).includes(undefined) &&
    !Object.values(errors.value).length,
);
const submit = handleSubmit(async () => {
  loading.value = true;
  try {
    await forgotPassword({ email: values.email });
    emit('confirmation-message', values.email);
  } catch (error) {
    submitError.value = true;
    messageStore.message = error as string;
    messageStore.color = 'red';
    messageStore.show = true;
  } finally {
    loading.value = false;
  }
});
</script>

<i18n lang="json">
{
  "en": {
    "forgotPassword": "Forgot password?",
    "enterEmail": "Type in your email and you'll send you the required instructions",
    "email": "Email",
    "emailError": "An error occorred while sending the recovery email, try again later",
    "recoverPassword": "RECOVER PASSWORD",
    "recalledPassword": "Recalled your password?",
    "login": "Acess here",
    "password": "Password",
    "confirmPassword": "Confirm Password",
    "newPassword": "Register your new Password",
    "enterPassword": "Enter the new Password in both fields",
    "changePassword": "UPDATE PASSWORD",
    "divider": "or"
  },
  "pt": {
    "forgotPassword": "Esqueceu a senha?",
    "enterEmail": "Digite seu e-mail e enviaremos instruções",
    "email": "E-mail",
    "emailError": "Ocorreu um erro ao enviar o e-mail, tente novamente mais tarde",
    "recoverPassword": "RECUPERAR SENHA",
    "recalledPassword": "Lembrou da senha?",
    "login": "acesse aqui!",
    "password": "Senha",
    "confirmPassword": "Confirmar Senha",
    "newPassword": "Cadastre sua nova senha",
    "enterPassword": "Digite sua nova senha e a confirmação",
    "changePassword": "ALTERAR SENHA",
    "divider": "OU"
  }
}
</i18n>
