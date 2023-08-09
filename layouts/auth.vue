<template>
  <v-app>
    <v-main class="secondary">
      <!-- <AppSnackbar></AppSnackbar> -->
      <v-container>
        <slot />
      </v-container>
    </v-main>
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
</style>
