<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useForm } from 'vee-validate';

const emit = defineEmits(['confirmation-message']);

const { t } = useI18n();
const { $trpc } = useNuxtApp();
const { schema4 } = useFormRules();
const messageStore = useMessageStore();
const route = useRoute();

const form = ref(null);
const passwordVisible = ref(false);
const confirmationVisible = ref(false);
const resetPassword = $trpc.users.resetPassword.useMutation();

const { errors, values, controlledValues } = useForm({
  validationSchema: schema4,
  keepValuesOnUnmount: true,
});

const isValid = computed(() => {
  return (
    !Object.values(controlledValues.value).includes(undefined) &&
    !Object.values(errors.value).length
  );
});

const changePassword = () => {
  resetPassword.mutate({
    password: values.password,
    passwordConfirm: values.confirmPassword,
    token: route.query.token as string,
  });
};

watchEffect(() => {
  if (resetPassword.data.value) {
    emit('confirmation-message');
    return;
  }

  if (resetPassword.error.value) {
    messageStore.show = true;
    messageStore.color = 'red';
    messageStore.message = (() => {
      switch (resetPassword.error.value.message) {
        case 'invalid_email':
          return t('auth.invalid_email');
        case 'invalid_token':
          return t('auth.invalid_token');
        case 'passwords_do_not_match':
          return t('auth.passwords_do_not_match');
      }

      const zodError = resetPassword.error.value.data?.zodError;

      return zodError?.fieldErrors.token?.includes('Required')
        ? t('auth.confirmation_token_required')
        : t('errors.default');
    })();
  }
});
</script>

<template>
  <v-container
    class="content d-flex flex-column align-content-start justify-start max-400"
  >
    <div class="mb-10">
      <v-card-title class="text-white text-h3 text-center text-bold">
        {{ $t('components.forgot.sendResetPassword.newPassword') }}
      </v-card-title>
      <v-card-subtitle
        class="text-subtitle-2 text-white text-center white-space-normal"
      >
        {{ $t('components.forgot.sendResetPassword.enterPassword') }}
      </v-card-subtitle>
    </div>
    <v-form
      ref="form"
      color="white"
      class="d-flex flex-column gap-1 mb-10"
      @submit.prevent="changePassword"
    >
      <alex-inputs-text-field
        name="password"
        color="white"
        class="mb-1"
        theme="dark"
        :label="$t('components.forgot.sendResetPassword.password')"
        :placeholder="$t('components.forgot.sendResetPassword.passwordHolder')"
        :type="passwordVisible ? 'text' : 'password'"
        :append-inner-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="passwordVisible = !passwordVisible"
      />
      <alex-inputs-text-field
        name="confirmPassword"
        color="white"
        class="mb-1"
        theme="dark"
        :append-inner-icon="confirmationVisible ? 'mdi-eye' : 'mdi-eye-off'"
        :type="confirmationVisible ? 'text' : 'password'"
        :label="$t('components.forgot.sendResetPassword.confirmPassword')"
        :placeholder="
          $t('components.forgot.sendResetPassword.confirmPasswordHolder')
        "
        @click:append-inner="confirmationVisible = !confirmationVisible"
      />
      <alex-custom-button
        block
        theme="dark"
        type="submit"
        size="large"
        :disabled="!isValid"
        :loading="resetPassword.pending.value"
      >
        {{ $t('components.forgot.sendResetPassword.changePassword') }}
      </alex-custom-button>
    </v-form>
    <p class="text-center text-body-1 font-weight-bold mt-5">
      {{ $t('components.forgot.sendResetPassword.recalledPassword') }}
      <NuxtLink to="/auth/login" class="text-accent text-decoration-none">
        {{ $t('components.forgot.sendResetPassword.login') }}
      </NuxtLink>
    </p>
  </v-container>
</template>

<style scoped lang="scss">
.max-400 {
  max-width: 400px;
}

.white-space-normal {
  white-space: normal;
}

@media (max-height: 700px) {
  .v-container {
    .mt-5 {
      margin-top: 10px !important;
    }

    .mb-10 {
      margin-bottom: 10px !important;
    }
  }
}
</style>
