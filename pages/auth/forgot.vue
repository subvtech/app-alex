<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest-only',
});

const emailSent = ref(false);
const userEmail = ref('');

const handleSentEmail = (email: string) => {
  userEmail.value = email;
  emailSent.value = true;
};
</script>

<template>
  <v-container class="pa-0 container-grid" fluid>
    <div class="image justify-center align-center d-none d-md-flex pa-0">
      <img class="left-image" src="/images/imagem_forgot.png" />
    </div>
    <div class="bg-primary-0 pa-0 content-field">
      <div class="mt-0 mt-sm-0" align="center" style="align-self: flex-end" />
      <ForgotPasswordSendResetPasswordEmail
        v-if="!emailSent"
        @confirmation-message="handleSentEmail"
      />
      <ForgotPasswordConfirmationMessage
        v-else
        :email="userEmail"
        :title="$t('pages.forgot.success.title')"
        :text2="$t('pages.forgot.success.subtitle2')"
        :text="$t('pages.forgot.success.subtitle1')"
      />
    </div>
  </v-container>
</template>

<style scoped lang="scss">
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
