<template>
  <v-container
    class="content d-flex flex-column align-content-start justify-start max-400"
  >
    <div>
      <v-card-title class="text-white text-h3 text-center text-bold">
        {{ $t('components.forgot.sendResetPassword.forgotPassword') }}
      </v-card-title>
      <v-card-subtitle
        class="text-subtitle-2 text-white text-center mb-8 white-space-normal"
      >
        {{ $t('components.forgot.sendResetPassword.enterEmail') }}
      </v-card-subtitle>
    </div>

    <v-form
      ref="form"
      class="d-flex flex-column mb-10"
      color="white"
      @submit.prevent="submit"
    >
      <alex-inputs-text-field
        :label="$t('components.forgot.sendResetPassword.email')"
        :placeholder="$t('components.forgot.sendResetPassword.emailHolder')"
        name="email"
        color="white"
        class="mb-1"
        theme="dark"
      />
      <span v-if="submitError" class="text-error w-100">{{
        $t('components.forgot.sendResetPassword.emailError')
      }}</span>

      <alex-custom-button
        block
        theme="dark"
        type="submit"
        size="large"
        :disabled="!isValid"
        :loading="loading"
        >{{
          $t('components.forgot.sendResetPassword.recoverPassword')
        }}</alex-custom-button
      >
    </v-form>
    <p class="text-center text-body-1 font-weight-bold">
      {{ $t('components.forgot.sendResetPassword.recalledPassword') }}
      <NuxtLink to="/login" class="text-decoration-none text-accent">{{
        $t('components.forgot.sendResetPassword.login')
      }}</NuxtLink>
    </p>
  </v-container>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
const { emailSchema } = useFormRules();
const form = ref(null);
const submitError = ref(false);
const loading = ref(false);
const messageStore = useMessageStore();
const { forgotPassword } = useStrapiAuth();
const emit = defineEmits(['confirmation-message']);

const { handleSubmit, errors, values, controlledValues } = useForm({
  validationSchema: emailSchema,
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

<style lang="scss">
.max-400 {
  max-width: 400px;
}
.white-space-normal {
  white-space: normal;
}
</style>
