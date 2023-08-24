<template>
  <v-container class="pa-0 d-flex flex-column h-75 mid-container mt-220">
    <div class="mb-10">
      <p class="text-white text-h4 text-center font-weight-bold mb-4">
        {{ $t('sendResetPassword.forgotPassword') }}
      </p>
      <p class="text-white text-h6 font-weight-regular text-center my-2">
        {{ $t('sendResetPassword.enterEmail') }}
      </p>
    </div>
    <v-form ref="form" color="white" class="mb-10" @submit.prevent="submit">
      <alex-inputs-stepper-field
        :label="$t('sendResetPassword.email')"
        name="email"
        color="white"
        class="my-3 text-secondary"
        theme="dark"
      />
      <span v-if="submitError" class="text-error w-100">{{
        $t('sendResetPassword.emailError')
      }}</span>

      <v-btn
        :color="!isValid ? 'grey-darken-1' : 'accent'"
        class="text-none text-white rounded-lg pa-5"
        block
        type="submit"
        size="large"
        :disabled="!isValid"
        :loading="loading"
        >{{ $t('sendResetPassword.recoverPassword') }}</v-btn
      >
    </v-form>
    <ForgotPasswordDividerRow />
    <p class="text-center text-body-1">
      {{ $t('sendResetPassword.recalledPassword') }}
      <NuxtLink to="/login" class="text-decoration-none text-accent">{{
        $t('sendResetPassword.login')
      }}</NuxtLink>
    </p>
  </v-container>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';

const { emailRules } = useFormRules();
const form = ref(null);
const submitError = ref(false)
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
