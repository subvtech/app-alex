<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column align-start pb-15"
  >
    <h1 class="text-h2 text-gray-800">Tooltip</h1>
    <p class="text-subtitle-2 text-gray-500">
      O
      <strong class="bg-accent pa-1 rounded">alex-custom-tooltip</strong>
      é um tooltip para exibir informação adicional on Hover. Este componente é
      útil para fornecer um feedback visual quanto a um elemento
      html/botão/seção.
    </p>

    <h2 class="text-h2 text-gray-800">Uso Básico</h2>
    <p class="text-subtitle-2 text-gray-500">
      Todas as propriedades são opcionais com exceção do texto. Aqui
      ilustraremos apenas os comportamentos mais comuns.
    </p>

    <h2 class="text-h3 text-gray-800">Adicionando propriedades básicas</h2>
    <div v-for="(item, index) in documentation">
      <p class="text-subtitle-2 text-gray-500" v-html="item.text" />

      <div class="d-flex flex-column w-100">
        <div
          class="d-flex align-center rounded-lg my-2 justify-center bg-gray-100 w-100 px-3 rounded-t"
        >
          <alex-custom-tooltip v-bind="item.props">
            <template #content>{{
              item.props.content
            }}</template></alex-custom-tooltip
          >
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
const copiedValue = ref('');

const copiedIndex = ref(-1);

const copyText = useCopyText();
const copyToClipboard = async (index: number) => {
  if (examples.length < index) return;
  try {
    copyText.copyToClipboard(examples[index]);
    copiedValue.value = examples[index] as string;
  } catch (err) {
    copiedValue.value = examples[index] as string;
  }
  copiedIndex.value = index;
};

const documentation = [
  {
    text: 'Esse é o modelo mais simples, passado a propriedade obrigatória text',
    props: { text: 'this is an example' },
  },
  {
    text: 'Passado <strong>showIcon</strong> é exibido um icon que serve como body caso a tag #content não seja usada',
    props: {
      text: 'This is an explanation',
      showIcon: true,
    },
  },
  {
    text: 'É necessário usar o slot <strong>content</strong> para evolver aquilo que você que o hover seja aplicado',
    props: {
      text: 'Here is some explanation',
      content: "What's this?",
    },
  },
  {
    text: 'Para alterar o posicionamento do tooltip tem que usar <strong>extraClasses</strong>',
    props: {
      text: "That's why",
      content: "T",
      extraClasses: 'mt-8',
    },
  },
];
const examples = [
  `<alex-custom-tooltip text="this is an example" />`,
  `<alex-custom-tooltip
      text="this is an example"
      show-icon
      />`,
  `<alex-custom-tooltip
          text="this is an example"    
    >
        <template #content>
            <span>What's this</span>
        </template>
    </alex-custom-tooltip>`,
  `<alex-custom-tooltip
        text="this is an example"    
        extraClasses="mt-8"
    >
        <template #content>
            <div>T</div>
        </template>
    </alex-custom-tooltip>`,
  ,
];

const propsDocumentation = [
  {
    name: 'text',
    type: 'String',
    description: 'O texto que vai ser usado',
  },
  {
    name: 'extraClasses',
    type: 'String',
    description:
      'Aqui são classes do vuetify que podem ser adicionas, principalmente para alterar o posicionamento do texto.',
    default: 'empty string',
  },
  {
    name: 'showIcon',
    type: 'Boolean',
    description: 'Exibir um ícone i',
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
