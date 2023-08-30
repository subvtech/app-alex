<template>
  <v-app>
    <v-main class="secondary"> <AppSnackbar /> <slot /> </v-main>
  </v-app>
</template>

<script setup lang="ts"></script>
<style lang="scss">
html,
body {
  font-family: 'Montserrat' !important;

  .v-application {
    font-family: 'Montserrat' !important;
  }
}

html {
  overflow-y: auto !important
}

html::-webkit-scrollbar {
  width: 16px;
}


html::-webkit-scrollbar-thumb {
  background-color: #00B8CC;
  border-radius: 999px;
  border: 3px solid #010f1b;
}

html::-webkit-scrollbar-track { 
  background-color: #010f1b;
}
</style>
