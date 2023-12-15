<template>
  <v-container
    class="pa-0 d-flex flex-column h-75 mid-container justify-center"
    style="max-width: 400px"
  >
    <div class="mb-10">
      <p class="text-white text-h3 text-center font-weight-bold mb-4">
        {{ $t('components.forgot.sendResetPassword.newPassword') }}
      </p>
      <p class="text-white text-h6 font-weight-regular text-center my-2">
        {{ $t('components.forgot.sendResetPassword.enterPassword') }}
      </p>
    </div>
    <v-form
      ref="form"
      color="white"
      class="mb-10"
      @submit.prevent="changePassword"
    >
      <alex-inputs-text-field
        :label="$t('components.forgot.sendResetPassword.password')"
        :placeholder="$t('components.forgot.sendResetPassword.passwordHolder')"
        name="password"
        :type="passwordVisible ? 'text' : 'password'"
        color="white"
        class="mb-1"
        theme="dark"
        :append-inner-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="passwordVisible = !passwordVisible"
      />

      <alex-inputs-text-field
        :label="$t('components.forgot.sendResetPassword.confirmPassword')"
        :placeholder="
          $t('components.forgot.sendResetPassword.confirmPasswordHolder')
        "
        name="confirmPassword"
        :append-inner-icon="confirmationVisible ? 'mdi-eye' : 'mdi-eye-off'"
        :type="confirmationVisible ? 'text' : 'password'"
        color="white"
        class="mb-1"
        theme="dark"
        @click:append-inner="confirmationVisible = !confirmationVisible"
      />
      <alex-custom-button
        theme="dark"
        block
        type="submit"
        size="large"
        :disabled="!isValid"
        :loading="loading"
      >
        {{
          $t('components.forgot.sendResetPassword.changePassword')
        }}</alex-custom-button
      >
    </v-form>
    <p class="text-center text-body-1 mt-5">
      {{ $t('components.forgot.sendResetPassword.recalledPassword') }}
      <NuxtLink to="/login" class="text-accent text-decoration-none">
        {{ $t('components.forgot.sendResetPassword.login') }}
      </NuxtLink>
    </p>
  </v-container>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useForm } from 'vee-validate';
const { resetPassword } = useStrapiAuth();
const messageStore = useMessageStore();

const { schema4 } = useFormRules();

const form = ref(null);
const loading = ref(false);
const passwordVisible = ref(false);
const confirmationVisible = ref(false);

const route = useRoute();
onBeforeMount(() => {
  if (!route.query.code) navigateTo('/login');
});

const emit = defineEmits(['confirmation-message']);

const { handleSubmit, errors, values, controlledValues } = useForm({
  validationSchema: schema4,
  keepValuesOnUnmount: true,
});

const isValid = computed(
  () =>
    !Object.values(controlledValues.value).includes(undefined) &&
    !Object.values(errors.value).length,
);

const changePassword = handleSubmit(async () => {
  loading.value = true;
  try {
    await resetPassword({
      code: route.query.code as string,
      password: values.password,
      passwordConfirmation: values.confirmPassword,
    });

    emit('confirmation-message');
  } catch (error) {
    messageStore.message = error as string;
    messageStore.color = 'red';
    messageStore.show = true;
    navigateTo('/login');
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped lang="scss">
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
