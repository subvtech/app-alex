<template>
  <v-container
    class="page rounded-lg bg-white pa-8 d-flex flex-column align-start pb-15"
  >
    <h1 class="text-h2 text-gray-800">Stepper</h1>
    <p class="text-subtitle-2 text-gray-500">
      O
      <strong class="bg-accent pa-1 rounded">alex-inputs-text-field</strong>
      é um componente que utiliza a estrutura do Vuetify para criar um campo de
      texto.
    </p>
    <div class="d-flex align-center container rounded-lg pa-4">
      <img class="align-self-stretch" src="@/assets/svg/vuetify.svg" />
      <div>
        <p class="text-body-1 text-primary align-self-stretch">
          Esse componente utiliza a estrutura do Vuetify, acesse ele a partir
          desse link e veja mais informações.<br />
        </p>
        <a
          class="text-decoration-underline text-blue"
          href="https://vuetifyjs.com/en/components/text-fields/"
          target="_blank"
          >vuetifyjs.com</a
        >
      </div>
    </div>
    <h2 class="text-h3 text-gray-800">Uso do Componente</h2>
    <div>
      <p class="text-subtitle-2 text-gray-500">
        O componente não requer nenhuma propriedade especifica, apenas o
        v-model.<br />todas as suas propriedades são herdadas do
        <a
          class="text-decoration-underline text-blue"
          href="https://vuetifyjs.com/en/api/v-text-field/"
          target="_blank"
          >v-text-field</a
        >, as mudanças que fizemos foram apenas estéticas.
      </p>
    </div>
    <alex-inputs-stepper
      :steps-config="{
        step1: { title: 'Informações', subtitle: 'Básicas' },
        step2: { title: 'Informações', subtitle: 'Básicas' },
      }"
    >
      <template #step1>a</template>
      <template #step2>b</template>
    </alex-inputs-stepper>
  </v-container>
</template>

<script setup lang="ts">
import 'prismjs';
import 'prismjs/themes/prism.css';
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

.playground-controls {
  border-left: 1px solid #a0a8b7;
  gap: 16px;
}

.playground-select > * .v-select__selection {
  margin-left: 35px !important;
}
</style>
