<template>
  <v-snackbar v-if="message" v-model="show" :color="color" top timeout="5000">
    <v-row justify="space-between" align="center" class="pa-2">
      <span class="text-white font-weight-bold">{{ message }}</span>
      <v-btn role="button" @click="show = false">Fechar</v-btn>
    </v-row>
  </v-snackbar>
</template>

<script setup lang="ts">
const messageStore = useMessageStore();
const { show, message, color } = storeToRefs(messageStore);
</script>
