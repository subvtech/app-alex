<template>
  <v-container class="fill-height pa-0 card overflow-hidden" fluid>
    <v-row class="fill-height">
      <v-col
        md="8"
        sm="6"
        class="justify-center align-center d-none d-md-flex pa-0"
      >
        <img class="w-50" src="/images/imagem_forgot.png" />
      </v-col>
      <v-col
        id="forgot-container"
        cols="12"
        md="4"
        sm="12"
        class="bg-primary-0 px-16 d-flex justify-center align-center"
      >
        <ForgotPasswordSendResetPasswordEmail
          v-if="!emailSent"
          @confirmation-message="handleSentEmail"
        />
        <ForgotPasswordConfirmationMessage
          v-else
          :text="$t('pages.forgot.success.subtitle1')"
          :email="userEmail"
          :text2="$t('pages.forgot.success.subtitle2')"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const emailSent = ref(false);
const userEmail = ref('');
definePageMeta({
  layout: 'auth',
  middleware: 'control-access',
});

const handleSentEmail = (email) => {
  userEmail.value = email;
  emailSent.value = true;
};
</script>

<style scoped lang="scss">
#forgot-container {
  background-image: url('/images/login-bg.svg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  max-width: 629px;
}
</style>
