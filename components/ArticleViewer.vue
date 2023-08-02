<template>
  <v-dialog v-model="visible" width="95%">
    <v-card>
      <v-card-title>
        {{ isLoading ? "Carregando..." : title }}
      </v-card-title>
      <div ref="contentContainer" class="content-container pa-10"></div>
      <v-skeleton-loader
        v-if="isLoading"
        class="mx-auto"
        max-width="100%"
        type="card"
      />
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    url: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isLoading: false,
      visible: false,
      title: "",
    };
  },
  methods: {
    handleModal(value) {
      this.visible = value;
    },
    async parsePage() {
      this.isLoading = true;
      try {
        const res = await this.$http.$post(`${location.origin}/api/parse-url`, {
          url: this.url,
        });
        if (res.data.error) {
          this.$error("Ocorreu um erro no processamento da página.");
        }
        this.$refs.contentContainer.innerHTML = res.data.content;
        this.title = res.data.title;
      } catch (error) {
        this.$error("Ocorreu um erro no processamento da página.");
      }
      this.isLoading = false;
    },
  },
};
</script>
<style>
.content-container img {
  max-width: 100% !important;
}
</style>
