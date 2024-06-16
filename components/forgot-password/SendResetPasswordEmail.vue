<script setup lang="ts">
import { useForm } from 'vee-validate';

const emit = defineEmits(['confirmation-message']);

const { t } = useI18n();
const { $trpc } = useNuxtApp();
const { emailRules } = useFormRules();
const messageStore = useMessageStore();
const form = ref(null);

const { errors, values, controlledValues } = useForm({
  validationSchema: emailRules,
  keepValuesOnUnmount: true,
});

const resetPassword = $trpc.users.sendResetPasswordEmail.useMutation();

const isValid = computed(() => {
  return (
    !Object.values(controlledValues.value).includes(undefined) &&
    !Object.values(errors.value).length
  );
});

watchEffect(() => {
  if (resetPassword.data.value) {
    emit('confirmation-message', values.email);
    return;
  }

  if (resetPassword.error.value) {
    messageStore.show = true;
    messageStore.color = 'red';
    messageStore.message = t('components.forgot.sendResetPassword.emailError');
  }
});
</script>

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
      @submit.prevent="resetPassword.mutate(values.email)"
    >
      <alex-inputs-text-field
        name="email"
        color="white"
        class="mb-1"
        theme="dark"
        :label="$t('components.forgot.sendResetPassword.email')"
        :placeholder="$t('components.forgot.sendResetPassword.emailHolder')"
      />
      <alex-custom-button
        block
        theme="dark"
        type="submit"
        size="large"
        :disabled="!isValid"
        :loading="resetPassword.status.value === 'pending'"
      >
        {{ $t('components.forgot.sendResetPassword.recoverPassword') }}
      </alex-custom-button>
    </v-form>
    <p class="text-center text-body-1 font-weight-bold">
      {{ $t('components.forgot.sendResetPassword.recalledPassword') }}
      <NuxtLink to="/auth/login" class="text-decoration-none text-accent">
        {{ $t('components.forgot.sendResetPassword.login') }}
      </NuxtLink>
    </p>
  </v-container>
</template>

<style lang="css">
.max-400 {
  max-width: 400px;
}

.white-space-normal {
  white-space: normal;
}
</style>
