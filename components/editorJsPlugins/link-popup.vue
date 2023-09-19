<template>
  <div class="text-center">
    <v-btn color="primary">
      Open Dialog

      <v-dialog v-model="dialog" activator="parent" width="auto">
        <v-card class="bg-grey-lighten-3 rounded-lg align-center pa-10">
          <v-card-text class="text-h4">
            Selecione a natureza do link!
          </v-card-text>
          <img src="./imgLinkTeste.png" width="300" />
          <v-card-actions class="d-flex justify-space-around">
            <v-btn
              color="blue-darken-1"
              variant="outlined"
              prepend-icon="mdi-youtube"
              @click="setLinkType('Video')"
              >Video</v-btn
            >
            <v-btn
              color="blue-darken-1"
              variant="outlined"
              prepend-icon="mdi-note-text"
              @click="setLinkType('Article')"
              >Artigo</v-btn
            >
            <v-btn
              color="blue-darken-1"
              variant="outlined"
              prepend-icon="mdi-cast-education"
              @click="setLinkType('Tutorial')"
              >Tutorial</v-btn
            >
            <v-btn
              color="blue-darken-1"
              variant="outlined"
              prepend-icon="mdi-link"
              @click="setLinkType('Others')"
              >Outro</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-btn>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const dialog = ref(false);
const setLinkType = (type) => {
  dialog.value = false;
  console.log(type);
};
</script>
