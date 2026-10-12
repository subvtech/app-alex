<template>
  <v-container class="pa-0 container-grid" fluid>
    <div class="image justify-center align-center d-none d-md-flex pa-0">
      <img class="left-image" src="/images/imagem_forgot.png" />
    </div>
    <div class="bg-primary-0 pa-0 content-field">
      <div class="mt-12 mt-sm-16 align-self-end" align="center" />
      <ForgotPasswordResetPassword
        v-if="!passwordChanged"
        @confirmation-message="handlePasswordChanged"
      />
      <ForgotPasswordConfirmationMessage
        v-else
        :title="$t('pages.reset.passwordChanged')"
        :text="$t('pages.reset.info')"
      />
    </div>
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
.align-self-end {
  align-self: flex-end;
}
.content-field {
  background-image: url('/images/login-bg.svg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  overflow-y: scroll;
  display: grid;
}

.container-grid {
  display: grid;
  grid-template-columns: 1fr minmax(auto, 629px);
  height: 100%;
}
.content-field {
  overflow-y: auto !important;
}

.content-field::-webkit-scrollbar {
  width: 12px;
}

.content-field::-webkit-scrollbar-thumb {
  background-color: #00b8cc;
  border-radius: 999px;
  border: 3px solid rgb(var(--v-theme-primary)) !important;
}

.content-field::-webkit-scrollbar-track {
  background-color: rgb(var(--v-theme-primary)) !important;
}

.left-image {
  width: clamp(500px, 55%, 800px);
}

@media screen and (max-width: 959px) {
  .container-grid {
    grid-template-columns: 1fr;
  }
  .left-image {
    display: none;
  }
}
</style>
