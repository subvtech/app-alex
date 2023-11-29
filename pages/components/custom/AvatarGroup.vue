<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column align-start pb-15"
  >
    <h1 class="text-h2 text-gray-800">AvatarGroup</h1>
    <p class="text-subtitle-2 text-gray-500">
      O componente
      <strong class="bg-accent pa-1 rounded">alex-custom-pagination</strong>
      é usado para separar agrupar outro componente chamado Avatar
    </p>
    <div class="d-flex align-center pa-4 container rounded-lg">
      <img class="align-self-stretch" src="@/assets/svg/vuetify.svg" />
      <div>
        <p class="text-body-1 text-primary align-self-stretch">
          Esse componente utiliza a estrutura do Vuetify, acesse ele a partir
          desse link e veja mais informações.<br />
        </p>
        <a
          class="text-decoration-underline text-blue"
          href="https://vuetifyjs.com/en/components/avatars/"
          target="_blank"
          >vuetifyjs.com</a
        >
      </div>
    </div>
    <alex-custom-avatar-group
      :size="34"
      :max="1"
      :peaple="[
        {
          name: 'Jorge Lima',
          image: {
            url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Woman_at_Lover%27s_Bridge_Tanjung_Sepat_%28cropped%29.jpg',
          },
        },
        {
          name: 'Jorge Lima',
          image: {
            url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Woman_at_Lover%27s_Bridge_Tanjung_Sepat_%28cropped%29.jpg',
          },
        },
      ]"
    />
  </v-container>
</template>

<script setup lang="ts">
// import { ref } from 'vue';
import 'prismjs';
import 'prismjs/themes/prism.css';
// import Prism from 'vue-prism-component';
// const copiedValue = ref('');
// const copyToClipboard = async (message, item) => {
//   try {
//     await navigator.clipboard.writeText(message);
//     copiedValue.value = item;
//   } catch (err) {
//     copiedValue.value = item;
//   }
// };
</script>

<style>
.container {
  border: 1px solid #a0a8b1;
  gap: 16px;
  align-self: stretch;
}

.align-self-stretch {
  align-self: stretch;
}

.page {
  max-width: 1200px;
  gap: 40px;
}

.copy-icon {
  position: absolute;
  right: 24px;
  top: 24px;
  color: #a0a8b1;
}
</style>
