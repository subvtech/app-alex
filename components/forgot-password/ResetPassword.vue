<template>
  <v-container class="pa-0 d-flex flex-column h-75 mid-container mt-220">
    <div class="mb-10">
      <p class="text-white text-h4 text-center font-weight-bold mb-4">
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
      <alex-inputs-stepper-field
        :label="$t('components.forgot.sendResetPassword.password')"
        name="password"
        :type="passwordVisible ? 'text' : 'password'"
        color="white"
        class="my-3 text-secondary"
        theme="dark"
        @click:append-inner="passwordVisible = !passwordVisible"
      />

      <alex-inputs-stepper-field
        :label="$t('components.forgot.sendResetPassword.confirmPassword')"
        name="password"
        :append-inner-icon="passwordVisible2 ? 'mdi-eye' : 'mdi-eye-off'"
        :type="passwordVisible2 ? 'text' : 'password'"
        color="white"
        class="my-3 text-secondary"
        theme="dark"
        @click:append-inner="passwordVisible2 = !passwordVisible2"
      />
      <v-btn
        :color="!isValid ? 'grey-darken-1' : 'accent'"
        class="text-none text-white rounded-lg pa-5"
        block
        type="submit"
        size="large"
        :disabled="!isValid"
        :loading="loading"
      >
        {{ $t('components.forgot.sendResetPassword.changePassword') }}</v-btn
      >
    </v-form>
    <ForgotPasswordDividerRow />
    <p class="text-center text-body-1">
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
const passwordVisible2 = ref(false);

const route = useRoute();

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
  } finally {
    loading.value = false;
  }
});
</script>
