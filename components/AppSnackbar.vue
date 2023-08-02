<template>
  <v-snackbar v-model="show" :color="color" top timeout="5000">
    <v-row justify="space-between" align="center" class="pa-2">
      <span class="white--text font-weight-bold">{{ message }}</span>
      <v-btn text @click="show = false">Fechar</v-btn>
    </v-row>
  </v-snackbar>
</template>

<script>
export default {
  name: "AppSnackbar",
  data() {
    return {
      show: false,
      message: "",
      color: "",
    };
  },

  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === "snackbar/showMessage") {
        this.message = state.snackbar.content;
        this.color = state.snackbar.color;
        this.show = true;
      }
    });
  },
};
</script>
