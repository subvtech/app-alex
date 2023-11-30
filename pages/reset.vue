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
        id="reset-container"
        cols="12"
        md="4"
        sm="12"
        class="bg-primary px-16"
      >
        <div class="mt-12 mt-sm-16" align="center">
          <img
            height="40"
            width="120"
            alt="Alex"
            src="../static/images/alex.svg"
            class="mt-8 mb-12 mb-sm-16"
          />
        </div>
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
  middleware: 'control-access',
});

const handlePasswordChanged = () => {
  passwordChanged.value = true;
};
</script>

<style scoped lang="scss">
#reset-container {
  background-image: url('../static/images/login-bg.svg');
  background-repeat: no-repeat;
  background-size: cover;
}

@media (max-height: 700px) {
  #reset-container {
    div {
      margin-top: 0px !important;
    }

    div img.mt-8 {
      margin-bottom: 24px !important;
    }
  }
}
</style>
