<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column align-start pb-15"
  >
    <h1 class="text-h2 text-gray-800">Button</h1>
    <p class="text-subtitle-2 text-gray-500">
      O
      <strong class="bg-accent pa-1 rounded">alex-custom-button</strong>
      é um componente usado para todo tipo de ação em todo o site.
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
          href="https://vuetifyjs.com/en/components/buttons/#usage"
          target="_blank"
          >vuetifyjs.com</a
        >
      </div>
    </div>
    <h2 class="text-h3 text-gray-800">Uso do Componente</h2>
    <p class="text-subtitle-2 text-gray-500">
      o componente tem basicamente três propriedades principais que foram
      alteradas: <strong>variant</strong>, <strong>size</strong> e
      <strong>icon</strong>.
    </p>
    <div class="d-flex w-100 justify-space-evenly flex-column flex-sm-row">
      <div>
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
              <td>variant</td>
              <td>
                'primary' | 'secondary' | 'tertiary' | 'text' | 'error' |
                'success' | 'warning' | 'info'
              </td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>size</td>
              <td>'small' | 'default' | 'large</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>icon</td>
              <td>string</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </div>
    <div class="d-flex gap-4">
      <alex-custom-button>Primary</alex-custom-button>
      <alex-custom-button variant="secondary">Secondary</alex-custom-button>
      <alex-custom-button variant="tertiary">Tertiary</alex-custom-button>
      <alex-custom-button variant="text">Text</alex-custom-button>
      <alex-custom-button variant="error">Error</alex-custom-button>
      <alex-custom-button variant="success">Success</alex-custom-button>
      <alex-custom-button variant="info">Info</alex-custom-button>
      <alex-custom-button variant="warning">Warning</alex-custom-button>
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

    <h2 class="text-h3 text-gray-800">Variante: Apenas ícone</h2>
    <div class="d-flex gap-4">
      <alex-custom-button icon="mdi-plus" />
      <alex-custom-button variant="secondary" icon="mdi-plus" />
      <alex-custom-button variant="tertiary" icon="mdi-plus" />
      <alex-custom-button variant="text" icon="mdi-plus" />
      <alex-custom-button variant="error" icon="mdi-plus" />
      <alex-custom-button variant="success" icon="mdi-plus" />
      <alex-custom-button variant="info" icon="mdi-plus" />
      <alex-custom-button variant="warning" icon="mdi-plus" />
    </div>
    <div class="w-100">
      <div class="bg-grey-lighten-5 pa-3" style="position: relative">
        <prism class="bg-grey-lighten-5">
          {{ secondExampleTemplate }}
        </prism>
        <v-btn
          class="copy-icon"
          variant="text"
          color="gray-400"
          @click="copyToClipboard(secondExampleTemplate, 'secondTemplate')"
        >
          <v-icon
            v-if="copiedValue == 'secondTemplate'"
            size="x-large"
            icon="mdi-clipboard-check-multiple-outline"
            color="green-lighten-1"
          />
          <v-icon v-else size="x-large" icon="mdi-content-copy" />
        </v-btn>
      </div>
    </div>
    <h2 class="text-h3 text-gray-800">Variante: tamanhos</h2>
    <div class="d-flex gap-4">
      <alex-custom-button size="small" text="Primary" />
      <alex-custom-button text="Primary" />
      <alex-custom-button size="large" text="Primary" />
    </div>
    <div class="d-flex gap-4">
      <alex-custom-button icon="mdi-plus" size="small" />
      <alex-custom-button icon="mdi-plus" />
      <alex-custom-button icon="mdi-plus" size="large" />
    </div>
    <div class="w-100">
      <div class="bg-grey-lighten-5 pa-3" style="position: relative">
        <prism class="bg-grey-lighten-5">
          {{ thirtyExampleTemplate }}
        </prism>
        <v-btn
          class="copy-icon"
          variant="text"
          color="gray-400"
          @click="copyToClipboard(thirtyExampleTemplate, 'thirtyTemplate')"
        >
          <v-icon
            v-if="copiedValue == 'thirtyTemplate'"
            size="x-large"
            icon="mdi-clipboard-check-multiple-outline"
            color="green-lighten-1"
          />
          <v-icon v-else size="x-large" icon="mdi-content-copy" />
        </v-btn>
      </div>
    </div>

    <h2 class="text-h3 text-gray-800">
      Variante: ícone na esquerda e/ou na direita
    </h2>
    <div class="d-flex flex-column gap-2">
      <div class="d-flex gap-4">
        <alex-custom-button prepend-icon="mdi-plus">Primary</alex-custom-button>
        <alex-custom-button variant="secondary" prepend-icon="mdi-plus"
          >Secondary</alex-custom-button
        >
        <alex-custom-button variant="tertiary" prepend-icon="mdi-plus"
          >Tertiary</alex-custom-button
        >
        <alex-custom-button variant="text" prepend-icon="mdi-plus"
          >Text</alex-custom-button
        >
        <alex-custom-button variant="error" prepend-icon="mdi-plus"
          >Error</alex-custom-button
        >
        <alex-custom-button variant="success" prepend-icon="mdi-plus"
          >Success</alex-custom-button
        >
        <alex-custom-button variant="info" prepend-icon="mdi-plus"
          >Info</alex-custom-button
        >
        <alex-custom-button variant="warning" prepend-icon="mdi-plus"
          >Warning</alex-custom-button
        >
      </div>
      <div class="d-flex gap-4">
        <alex-custom-button append-icon="mdi-plus">Primary</alex-custom-button>
        <alex-custom-button variant="secondary" append-icon="mdi-plus"
          >Secondary</alex-custom-button
        >
        <alex-custom-button variant="tertiary" append-icon="mdi-plus"
          >Tertiary</alex-custom-button
        >
        <alex-custom-button variant="text" append-icon="mdi-plus"
          >Text</alex-custom-button
        >
        <alex-custom-button variant="error" append-icon="mdi-plus"
          >Error</alex-custom-button
        >
        <alex-custom-button variant="success" append-icon="mdi-plus"
          >Success</alex-custom-button
        >
        <alex-custom-button variant="info" append-icon="mdi-plus"
          >Info</alex-custom-button
        >
        <alex-custom-button variant="warning" append-icon="mdi-plus"
          >Warning</alex-custom-button
        >
      </div>
      <div class="d-flex gap-4 flex-wrap">
        <alex-custom-button append-icon="mdi-plus" prepend-icon="mdi-plus"
          >Primary</alex-custom-button
        >
        <alex-custom-button
          variant="secondary"
          append-icon="mdi-plus"
          prepend-icon="mdi-plus"
          >Secondary</alex-custom-button
        >
        <alex-custom-button
          variant="tertiary"
          append-icon="mdi-plus"
          prepend-icon="mdi-plus"
          >Tertiary</alex-custom-button
        >
        <alex-custom-button
          variant="text"
          append-icon="mdi-plus"
          prepend-icon="mdi-plus"
          >Text</alex-custom-button
        >
        <alex-custom-button
          variant="error"
          append-icon="mdi-plus"
          prepend-icon="mdi-plus"
          >Error</alex-custom-button
        >
        <alex-custom-button
          variant="success"
          append-icon="mdi-plus"
          prepend-icon="mdi-plus"
          >Success</alex-custom-button
        >
        <alex-custom-button
          variant="info"
          append-icon="mdi-plus"
          prepend-icon="mdi-plus"
          >Info</alex-custom-button
        >
        <alex-custom-button
          variant="warning"
          append-icon="mdi-plus"
          prepend-icon="mdi-plus"
          >Warning</alex-custom-button
        >
      </div>
    </div>

    <div class="w-100">
      <div class="bg-grey-lighten-5 pa-3" style="position: relative">
        <prism class="bg-grey-lighten-5">
          {{ forthExampleTemplate }}
        </prism>
        <v-btn
          class="copy-icon"
          variant="text"
          color="gray-400"
          @click="copyToClipboard(forthExampleTemplate, 'forthTemplate')"
        >
          <v-icon
            v-if="copiedValue == 'forthTemplate'"
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
import { ref } from 'vue';
import 'prismjs';
import 'prismjs/themes/prism.css';
import Prism from 'vue-prism-component';

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const copiedValue = ref('');

const firstExampleTemplate = ref(`
<alex-custom-button>Primary</alex-custom-button>
      <alex-custom-button variant="secondary">Secondary</alex-custom-button>
      <alex-custom-button variant="tertiary">Tertiary</alex-custom-button>
      <alex-custom-button variant="text">Text</alex-custom-button>
      <alex-custom-button variant="error">Error</alex-custom-button>
      <alex-custom-button variant="success">Success</alex-custom-button>
      <alex-custom-button variant="info">Info</alex-custom-button>
      <alex-custom-button variant="warning">Warning</alex-custom-button>
`);

const secondExampleTemplate = ref(`
<alex-custom-button icon="mdi-plus" />
      <alex-custom-button variant="secondary" icon="mdi-plus" />
      <alex-custom-button variant="tertiary" icon="mdi-plus" />
      <alex-custom-button variant="text" icon="mdi-plus" />
      <alex-custom-button variant="error" icon="mdi-plus" />
      <alex-custom-button variant="success" icon="mdi-plus" />
      <alex-custom-button variant="info" icon="mdi-plus" />
      <alex-custom-button variant="warning" icon="mdi-plus" />
`);
const thirtyExampleTemplate = ref(`
<alex-custom-button size="small" text="Primary" />
      <alex-custom-button text="Primary" />
      <alex-custom-button size="large" text="Primary" />
      <alex-custom-button icon="mdi-plus" size="small" />
      <alex-custom-button icon="mdi-plus" />
      <alex-custom-button icon="mdi-plus" size="large" />
`);
const forthExampleTemplate = ref(`
<alex-custom-button append-icon="mdi-plus" prepend-icon="mdi-plus"
          >Primary</alex-custom-button
        >
        <alex-custom-button
          variant="secondary"
          append-icon="mdi-plus"
          prepend-icon="mdi-plus"
          >Secondary</alex-custom-button
        >
        <alex-custom-button
          variant="tertiary"
          append-icon="mdi-plus"
          prepend-icon="mdi-plus"
          >Tertiary</alex-custom-button
        >
        <alex-custom-button
          variant="text"
          append-icon="mdi-plus"
          prepend-icon="mdi-plus"
          >Text</alex-custom-button
        >
        <alex-custom-button
          variant="error"
          append-icon="mdi-plus"
          prepend-icon="mdi-plus"
          >Error</alex-custom-button
        >
        <alex-custom-button
          variant="success"
          append-icon="mdi-plus"
          prepend-icon="mdi-plus"
          >Success</alex-custom-button
        >
        <alex-custom-button
          variant="info"
          append-icon="mdi-plus"
          prepend-icon="mdi-plus"
          >Info</alex-custom-button
        >
        <alex-custom-button
          variant="warning"
          append-icon="mdi-plus"
          prepend-icon="mdi-plus"
          >Warning</alex-custom-button
        >
`);

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
