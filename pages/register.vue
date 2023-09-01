<template>
  <v-container class="pa-0 height-100" fluid>
    <v-row class="fill-height w-100 ma-0">
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
        class="bg-primary pa-0 content-field"
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
.content-field {
  background-image: url('../assets/svg/Bubbles.svg');
  background-size: 100% 100%;
  height: 100%;
  overflow-y: scroll;
  display: grid;
}

.height-100 {
  height: 100vh !important;
}

.content-field {
  overflow-y: auto !important
}

.content-field::-webkit-scrollbar {
  width: 12px;
}


.content-field::-webkit-scrollbar-thumb {
  background-color: #00B8CC;
  border-radius: 999px;
  border: 3px solid rgb(var(--v-theme-primary)) !important;;
  
}

.content-field::-webkit-scrollbar-track { 
  background-color: rgb(var(--v-theme-primary)) !important;
}

.ellipse {
  width: 100%;
  aspect-ratio: 4.4 / 1.3;
  // min-height: 100px;
  &-top {
    background-image: url('../assets/svg/EllipseLogo.svg');
    background-size: 130%;
    background-position: 50% 100%;
  }
  &-bottom {
    aspect-ratio: 4 / 0.9;
    background-image: url('../assets/svg/Ellipse.svg');
    background-size: 130%;
    background-position: top;
    align-self: flex-end;
  }
}

.signUp {
  width: clamp(550px, 65%, 50vw);
}

@media screen and (max-width: 500px) {
  .content-field::-webkit-scrollbar {
  width: 8px;
}
}

</style>
