<template>
  <v-dialog v-model="visible" class="modal-document" width="98%">
    <v-card class="modal-document">
      <v-card-title>
        {{ isLoading ? "Carregando..." : title }}
      </v-card-title>
      <div class="pdf-app-container">
        <vue-pdf-app theme="dark" :pdf="url"></vue-pdf-app>
      </div>
      <link rel="resource" type="application/l10n" :href="locale" />
    </v-card>
  </v-dialog>
</template>

<script>
import "~/assets/css/pdf-icons.css";

// import Loader from './AppLoader.vue';

// import VuePdfApp from 'vue-pdf-app'

export default {
  components: {
    // VuePdfApp,
    // VuePdfApp: () => ({
    //   component: new Promise((resolve, _reject) => {
    //     return setTimeout(
    //       () =>
    //         resolve(import(/* webpackChunkName: "pdf-viewer" */ 'vue-pdf-app')),
    //       3000
    //     );
    //   }),
    //   loading: Loader,
    // }),
  },
  props: {
    url: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isLoading: false,
      visible: false,
    };
  },
  computed: {
    locale() {
      return this.isElectronEnv()
        ? // eslint-disable-next-line no-undef
          `file://${__resources}/locale.txt`
        : "/locale.txt";
    },
  },
  methods: {
    handleModal(value) {
      this.visible = value;
    },
    isElectronEnv() {
      return process.env.isElectronEnv;
    },
  },
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
