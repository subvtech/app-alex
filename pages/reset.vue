<template>
  <v-container class="fill-height pa-0 card" fluid>
    <v-row class="fill-height">
      <v-col
        md="8"
        sm="6"
        class="justify-center align-center d-none d-md-flex pa-0"
      >
        <img class="w-50" src="../static/images/imagem_forgot.png" />
      </v-col>
      <v-col
        id="login-container"
        cols="12"
        md="4"
        sm="12"
        class="bg-primary px-16"
      >
        <ForgotPasswordResetPassword
          v-if="!passwordChanged"
          @confirmation-message="handlePasswordChanged"
        />
        <ForgotPasswordConfirmationMessage
          v-else
          :title="$t('pages.reset.passwordChanged')"
          :text="$t('pages.reset.info')"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const passwordChanged = ref(false);
definePageMeta({
  layout: 'auth',
});

const handlePasswordChanged = () => {
  passwordChanged.value = true;
};
</script>

<style scoped>
#login-container {
  background-image: url('../static/images/login-bg.svg');
  background-size: 100% 100%;
}

.w-90 {
  width: 90% !important;
}

.mt-220 {
  margin-top: 220px !important;
}
</style>
