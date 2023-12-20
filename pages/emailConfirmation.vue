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
        id="container"
        cols="12"
        md="4"
        sm="12"
        class="bg-primary-0 px-16 d-flex justify-center align-center"
      >
        <ForgotPasswordConfirmationMessage
          :title="$t('pages.emailConfirmation.success.title')"
          :text="$t('pages.emailConfirmation.success.subtitle1')"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'control-access',
});
</script>

<style scoped lang="scss">
#container {
  background-image: url('/images/login-bg.svg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  max-width: 629px;
}
</style>
