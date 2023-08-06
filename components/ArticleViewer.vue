<template>
  <v-dialog v-model="visible" width="95%">
    <v-card>
      <v-card-title>
        {{ isLoading ? 'Carregando...' : title }}
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
<script setup lang="ts">
const props = defineProps({
  url: {
    default: '',
    type: String,
  },
});
const { url } = toRefs(props);

const isLoading = ref(false);
const visible = ref(false);
const title = ref('');
const contentContainer = ref()

const handleModal = (value) => {
  visible.value = value;
};

const parsePage = async () => {
  isLoading.value = true;
  try {
    const res = await this.$http.$post(`${location.origin}/api/parse-url`, {
      url: url.value,
    });
    if (res.data.error) {
      this.$error('Ocorreu um erro no processamento da página.');
    }
    contentContainer.value.innerHTML = res.data.content;
    title.value = res.data.title;
  } catch (error) {
    this.$error('Ocorreu um erro no processamento da página.');
  }
  isLoading.value = false;
};
</script>
<style>
.content-container img {
  max-width: 100% !important;
}
</style>
