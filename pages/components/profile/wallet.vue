<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column align-start pb-15"
  >
    <h1 class="text-h2 text-gray-800">Card da Wallet</h1>
    <p class="text-subtitle-2 text-gray-500">
      O
      <strong class="bg-accent pa-1 rounded">alex-profile-wallet</strong>
      é um componente que tem como principal objetivo representar as informações
      da carteira.
    </p>

    <alex-documentation-example :examples="examples2" />
  </v-container>
</template>

<script setup lang="ts">
import 'prismjs';
import 'prismjs/themes/prism.css';
import Prism from 'vue-prism-component';
import { ExampleType } from '~/components/alex/documentation/Example.vue';

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const copiedValue = ref('');
const copiedIndex = ref(-1);
const examples = [
  `<alex-learningplan-card
          title="Gerenciamento de sistemas operacionais e projeto de redes utilizando o packet tracer"
          description="Fala pessoal, tudo bem? Sejam bem vindos ao Plano de Aprendizagem sobre Gerenciamento de Projetos e aprendizagem"
          :facilitator="{
            name: 'Carlos Andrade',
            imageURL: 'https://thispersondoesnotexist.com/',
          }"
          :trails-number="40"
          :image="{
            url: 'https://miro.medium.com/v2/resize:fit:1058/1*ci1A2ErPJuUdYUqfa45r0Q.png',
          }"
        />`,
  ` <alex-learningplan-card
            title="Gerenciamento de sistemas operacionais e projeto de redes utilizando o packet tracer"
            description="Fala pessoal, tudo bem? Sejam bem vindos ao Plano de Aprendizagem sobre Gerenciamento de Projetos e aprendizagem"
            :facilitator="{
              name: 'Carlos Andrade',
              imageURL: 'https://thispersondoesnotexist.com/',
            }"
            :trails-number="40"
            :image="{
              url: 'https://miro.medium.com/v2/resize:fit:1058/1*ci1A2ErPJuUdYUqfa45r0Q.png',
            }"
            hide
          />`,
  `<alex-learningplan-card
            title="Gerenciamento de sistemas operacionais e projeto de redes utilizando o packet tracer"
            description="Fala pessoal, tudo bem? Sejam bem vindos ao Plano de Aprendizagem sobre Gerenciamento de Projetos e aprendizagem"
            :facilitator="{
              name: 'Carlos Andrade',
              imageURL: 'https://thispersondoesnotexist.com/',
            }"
            :trails-number="40"
            :image="{
              url: 'https://miro.medium.com/v2/resize:fit:1058/1*ci1A2ErPJuUdYUqfa45r0Q.png',
            }"
          />`,
];

const examples2 = ref<ExampleType[]>([
  { label: 'Script', template: examples[0] },

  { label: 'Template', template: 'examples[1]' },
]);
</script>

<style>
.language-markup {
  overflow-x: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none;
  }
  border-radius: 8px;
}
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
  right: 10px;
  top: 10px;
  color: #a0a8b1;
}
</style>
