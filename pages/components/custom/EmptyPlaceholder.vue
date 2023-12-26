<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column align-start pb-15"
  >
    <h1 class="text-h2 text-gray-800">EmptyPlaceholder</h1>
    <p class="text-subtitle-2 text-gray-500">
      O
      <strong class="bg-accent pa-1 rounded"
        >alex-custom-empty-placeholder</strong
      >
      é um componente Vue.js que exibe uma mensagem e uma imagem quando não há
      conteúdo disponível. Este componente é útil para fornecer um feedback
      visual quando uma área ou seção da aplicação está vazia.
    </p>

    <h2 class="text-h2 text-gray-800">Uso Básico</h2>
    <p class="text-subtitle-2 text-gray-500">
      Todas as propriedades são opcionais. Aqui ilustraremos apenas os
      comportamentos mais comuns.
    </p>

    <h2 class="text-h3 text-gray-800">Adicionando propriedades básicas</h2>
    <div v-for="(item, index) in documentation">
      <p class="text-subtitle-2 text-gray-500" v-html="item.text" />

      <div class="d-flex flex-column w-100">
        <div
          class="d-flex align-center rounded-lg my-2 justify-center bg-gray-100 w-100 px-3 rounded-t"
        >
          <alex-custom-empty-placeholder v-bind="item.props" />
        </div>
        <div class="px-3" style="position: relative">
          <prism>{{ examples[index] }}</prism>
          <v-btn
            class="copy-icon"
            variant="text"
            color="gray-400"
            @click="copyToClipboard(index)"
          >
            <v-icon
              v-if="copiedIndex === index"
              size="x-large"
              icon="mdi-clipboard-check-multiple-outline"
              color="green-lighten-1"
            />
            <v-icon v-else size="x-large" icon="mdi-content-copy" />
          </v-btn>
        </div>
      </div>
    </div>

    <h2 class="text-h3 text-gray-800">Propriedades disponíveis</h2>
    <div class="d-flex flex-column" style="gap: 8px">
      <div
        class="pa-6 d-flex flex-column rounded-lg align-baseline"
        v-for="(item, index) in propsDocumentation"
        :style="
          index % 2 === 0
            ? 'background-color: #EBEDEF'
            : 'background-color: #D1F6FA'
        "
      >
        <p class="text-subtitle-2 text-gray-500">{{ item.name }}</p>

        <p class="text-body-1 text-gray-800 ml-2 font-weight-bold">
          Descrição:
          <span class="font-weight-regular">{{ item.description }}</span>
        </p>
        <p class="text-body-1 text-gray-800 ml-2 font-weight-bold">
          Type:
          <span class="text-red-darken-2 font-weight-regular">{{
            item.type
          }}</span>
        </p>
        <p
          v-if="item.default"
          class="text-body-1 text-gray-800 ml-2 font-weight-bold"
        >
          Default:
          <span class="text-purple-darken-2 font-weight-regular">{{
            item.default
          }}</span>
        </p>
        <p v-else class="text-body-1 text-gray-800 ml-2 font-weight-bold">
          it's required
        </p>
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

const copyText = useCopyText();
const copyToClipboard = async (index) => {
  try {
    copyText.copyToClipboard(examples[index]);
    copiedValue.value = examples[index];
  } catch (err) {
    copiedValue.value = examples[index];
  }
  copiedIndex.value = index;
};
const canEdit1 = ref(false);
const canEdit2 = ref(false);
const canEdit3 = ref(false);

const copiedValue = ref('');
const copiedIndex = ref(-1);
const documentation = [
  {
    text: 'Esse é o modelo mais simples, passado nenhuma propriedade exibe a imagem padrão',
    props: {},
  },
  {
    text: 'Passado <strong>emptyTextMessage</strong> o texto é exibido com a imagem',
    props: {
      emptyTextMessage: 'Empty text',
    },
  },
  {
    text: 'Para esconder a imagem é preciso setar <strong>hideImage</strong> para true',
    props: {
      emptyTextMessage: 'Empty text',
      hideImage: true,
    },
  },
  {
    text: 'Para alterar a imagem é preciso passar o caminho em <strong>emptyTextImage</strong>',
    props: {
      emptyTextMessage: 'Empty text',
      emptyTextImage: '/svg/EmptyGoals.svg',
    },
  },
];
const examples = [
  '<alex-custom-empty-placeholder />',
  `<alex-custom-empty-placeholder
    emptyTextMessage="Empty text"
    />`,
  `<alex-custom-empty-placeholder
        emptyTextMessage="Empty text"
        hideImage="true"
    />`,
  `<alex-custom-empty-placeholder 
        emptyTextMessage="Empty text"
        emptyTextImage="/svg/EmptyGoals.svg"
      />`,
];

const propsDocumentation = [
  {
    name: 'emptyTextImage',
    type: 'String',
    description: 'O caminho da imagem que vai ser usada',
    default: '/svg/EmptyAbout.svg',
  },
  {
    name: 'emptyTextMessage',
    type: 'String',
    description: 'O texto exibido',
    default: 'empty string',
  },
  {
    name: 'hideImage',
    type: 'Boolean',
    description: 'Esconde a imagem',
    default: 'false',
  },
];
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
