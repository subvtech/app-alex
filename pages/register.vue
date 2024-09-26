<template>
  <v-container id="register" class="pa-0 container-grid overflow-hidden" fluid>
    <div class="image justify-center align-center d-none d-md-flex pa-0">
      <img class="signUp" src="public/images/signUp.svg" />
    </div>

    <div class="bg-primary-0 pa-0 content-field">
      <div class="mt-12 mt-sm-16" align="center" style="align-self: flex-end" />

      <SuccessMessage
        v-if="registeredUser"
        :title="$t('pages.register.success.title')"
        :subtitle="$t('pages.register.success.subtitle')"
      />

      <RegisterFields v-else @success:message="onRegisteredUser" />
    </div>
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

.signUp {
  width: clamp(500px, 65%, 1000px);
}

@media screen and (max-width: 959px) {
  .container-grid {
    grid-template-columns: 1fr;
  }
  .signUp {
    display: none;
  }
}
</style>
