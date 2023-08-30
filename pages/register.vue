<template>
  <v-container class="fill-height pa-0 overflow-hidden" fluid>
    <v-row class="fill-height">
      <v-col
        sm="0"
        md="7"
        lg="7"
        xl="8"
        class="justify-center align-center d-none d-md-flex pa-0"
      >
        <img class="signUp" src="../static/images/signUp.svg" />
      </v-col>
      <v-col
        cols="12"
        sm="12"
        md="5"
        lg="5"
        xl="4"
        class="bg-primary pa-0 content d-flex flex-column"
      >
        <div class="ellipse ellipse-top" />
        <SuccessMessage
          v-if="registeredUser"
          :title="$t('pages.register.success.title')"
          :subtitle="$t('pages.register.success.subtitle')"
        />

        <RegisterFields v-else @successMessage="onRegisteredUser"/>
        <div class="ellipse ellipse-bottom" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'control-access'
});
const registeredUser = ref(false);
const onRegisteredUser = () => {
  registeredUser.value = true
}
</script>

<style scoped lang="scss">
.content {
  background-image: url('../assets/svg/Bubbles.svg');
  background-size: 100% 100%;
  position: relative;
  height: auto;
}
.ellipse {
  width: 100%;
  aspect-ratio: 4.4 / 1.3;
  &-top {
    background-image: url('../assets/svg/EllipseLogo.svg');
    background-size: 130%;
    background-position: 50% 100%;
  }
  &-bottom {
    background-image: url('../assets/svg/Ellipse.svg');
    background-size: 130%;
    background-position: top;
  }
}

.signUp {
  width: clamp(550px, 65%, 870px);
}
</style>
