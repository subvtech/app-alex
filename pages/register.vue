<template>
  <v-container id="register" class="pa-0 height-100 overflow-hidden" fluid>
    <v-row class="fill-height w-100 ma-0">
      <v-col
        sm="6"
        md="8"
        class="justify-center align-center d-none d-md-flex pa-0"
      >
        <img class="signUp" src="/images/signUp.svg" />
      </v-col>

      <v-col cols="12" sm="12" md="4" class="bg-primary-0 pa-0 content-field">
        <div
          class="mt-12 mt-sm-16"
          align="center"
          style="align-self: flex-end"
        ></div>

        <SuccessMessage
          v-if="registeredUser"
          :title="$t('pages.register.success.title')"
          :subtitle="$t('pages.register.success.subtitle')"
        />

        <RegisterFields v-else @success:message="onRegisteredUser" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'control-access',
});
const registeredUser = ref(false);
const onRegisteredUser = () => {
  registeredUser.value = true;
};
</script>

<style scoped lang="scss">
.content-field {
  background-image: url('/images/login-bg.svg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  max-width: 629px;
  overflow-y: scroll;
  display: grid;
}

.height-100 {
  height: 100vh !important;
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

.signUp {
  width: clamp(550px, 65%, 50vw);
}

@media screen and (max-width: 500px) {
  .content-field::-webkit-scrollbar {
    width: 8px;
  }
}

@media (max-height: 768px) {
  .content-field {
    div.mt-12 {
      margin-top: 20px !important;
    }

    div img.mt-8 {
      margin-bottom: 8px !important;
    }
  }
}
</style>
