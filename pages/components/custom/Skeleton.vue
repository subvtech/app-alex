<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column align-start pb-15"
  >
    <h1 class="text-h2 text-gray-800">Skeleton</h1>
    <p class="text-subtitle-2 text-gray-500">
      O componente
      <strong class="bg-accent pa-1 rounded">alex-custom-skeleton</strong>
      é usado para separar como substítuto do spinner para representar que um
      elemento está carregando.
    </p>
    <h2 class="text-h3 text-gray-800">Uso do Componente</h2>
    <p class="text-subtitle-2 text-gray-500">
      o componente tem basicamente 2 propriedades principais que são
      <strong>color</strong>, <strong>rounded</strong>.
    </p>
    <div class="d-flex w-100 justify-space-evenly flex-column flex-sm-row">
      <div class="w-100">
        <p class="text-h5 text-center">Props do componente</p>
        <v-table variant="outline">
          <thead>
            <tr>
              <th>Propriedade</th>
              <th>Tipo</th>
              <th>Obrigatório</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>avatar-items</td>
              <td>person[]</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>rounded</td>
              <td>'sm' | 'md' | 'rounded' | 'lg'</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </div>
    <div class="d-flex w-100 gap-4 pa-4 rounded-lg flex-column align-start">
      <alex-custom-skeleton
        color="gray-300"
        class="w-100 height-4"
      /><alex-custom-skeleton
        color="gray-300"
        class="width-12 height-12"
        rounded="pill"
      />
    </div>
    <div class="w-100">
      <div class="bg-grey-lighten-5 pa-3" style="position: relative">
        <prism class="bg-grey-lighten-5">
          {{ firstExampleTemplate }}
        </prism>
        <v-btn
          class="copy-icon"
          variant="text"
          color="gray-400"
          @click="copyToClipboard(firstExampleTemplate, 'firstTemplate')"
        >
          <v-icon
            v-if="copiedValue == 'firstTemplate'"
            size="x-large"
            icon="mdi-clipboard-check-multiple-outline"
            color="green-lighten-1"
          />
          <v-icon v-else size="x-large" icon="mdi-content-copy" />
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import 'prismjs';
import 'prismjs/themes/prism.css';
import Prism from 'vue-prism-component';

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const firstExampleTemplate = ref(
  `<alex-custom-skeleton
      color="gray-300"
      class="w-100 height-4"
    />
    <alex-custom-skeleton
      color="gray-300"
      class="width-12 height-12"
      rounded="pill"
    />`,
);
const copiedValue = ref('');
const copyToClipboard = async (message, item) => {
  try {
    await navigator.clipboard.writeText(message);
    copiedValue.value = item;
  } catch (err) {
    copiedValue.value = item;
  }
};
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
