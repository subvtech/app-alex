<template>
  <v-dialog v-model="visible" class="modal-document" width="98%">
    <v-card class="modal-document">
      <v-card-title>
        {{ isLoading ? $t('layouts.default.isLoading') : title }}
      </v-card-title>
      <div class="pdf-app-container">
        <vue-pdf-app theme="dark" :pdf="url"></vue-pdf-app>
      </div>
      <link rel="resource" type="application/l10n" :href="locale" />
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import '~/assets/css/pdf-icons.css';

// import Loader from './AppLoader.vue';

// import VuePdfApp from 'vue-pdf-app'
const props = defineProps({
  url: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
});

const { title, url } = toRefs(props);

const isLoading = ref(false);
const visible = ref(false);

const locale = computed(() => {
  return isElectronEnv()
    ? // eslint-disable-next-line no-undef
      `file://${__resources}/locale.txt`
    : '/locale.txt';
});

const handleModal = (value) => {
  visible.value = value;
};
const isElectronEnv = () => {
  return process.env.isElectronEnv;
};
</script>

<style>
.pdf-app-container {
  width: 100%;
  height: 98%;
}

.content-container img {
  max-width: 100% !important;
}

.modal-document {
  height: 100% !important;
}

.ant-modal-content {
  height: 100%;
  width: 100%;
}
</style>
