<template>
  <v-container
    class="page pa-8 rounded-lg bg-white 8 d-flex flex-column align-start pb-15"
  >
    <h1 class="text-h2 text-gray-800">useOnBoarding</h1>
    <p class="text-subtitle-2 text-gray-500">
      O
      <strong class="bg-accent pa-1 rounded">useOnBoarding</strong>
      é útil para criar um tour interativo passo a passo para os usuários. Ele
      possui um sistema de etapas que podem ser personalizadas para se adequar
      ao conteúdo e ao fluxo do site.
    </p>
    <div class="d-flex align-center pa-4 container rounded-lg">
      <img
        class="align-self-stretch"
        src="https://i.ibb.co/7nN5NGL/shepherd.png"
      />
      <div>
        <p class="text-body-1 text-primary align-self-stretch">
          Esse componente utiliza a estrutura do Shepherd.js, acesse ele a
          partir desse link e veja mais informações.<br />
        </p>
        <a
          class="text-decoration-underline text-blue"
          href="https://shepherdjs.dev/docs/index.html"
          target="_blank"
          >shepherdjs.dev</a
        >
      </div>
    </div>
    <h2 class="text-h3 text-gray-800">Uso do Composable para onBoarding</h2>

    <p class="text-subtitle-2 text-gray-500">
      O composable 'useOnBoarding' recebe um array de objetos, onde cada objeto
      representa uma etapa do tour. Cada etapa pode conter as propriedades 'id',
      'title', 'text', 'attachTo' e 'buttons'. Esse array deve ser passado para
      o composable. Além disso, o texto para cada etapa deve ser definido de
      acordo com o 'i18n', na pasta 'assets > locales' e na pasta correspondente
      ao idioma e local utilizado. Por exemplo, para definir as mensagens em
      inglês, você adicionaria as mensagens no arquivo 'en.json' na pasta
      'locales'.
    </p>
    <div class="d-flex w-100 justify-space-evenly flex-column flex-sm-row">
      <div>
        <p class="text-h5 text-center">Props do composable</p>
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
              <td>id</td>
              <td>String</td>
              <td class="text-center">
                <v-icon icon="mdi-checkbox-marked" color="success" />
              </td>
            </tr>
            <tr>
              <td>title</td>
              <td>String</td>
              <td class="text-center">
                <v-icon icon="mdi-checkbox-marked" color="success" />
              </td>
            </tr>
            <tr>
              <td>text</td>
              <td>String</td>
              <td class="text-center">
                <v-icon icon="mdi-checkbox-marked" color="success" />
              </td>
            </tr>
            <tr>
              <td>attachTo</td>
              <td>Object</td>
              <td class="text-center">
                <v-icon icon="mdi-checkbox-marked" color="success" />
              </td>
            </tr>
            <tr>
              <td>buttons</td>
              <td>Array</td>
              <td class="text-center">
                <v-icon icon="mdi-checkbox-marked" color="success" />
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
      <div>
        <p class="text-h5 text-center">Exemplo</p>
        <Prism class="bg-white" language="javascript">
          {{ propsExample }}
        </Prism>
      </div>
    </div>
    <div class="w-100">
      <div
        class="d-flex align-center justify-space-between w-100 px-3 bg-gray-100 rounded-t"
      >
        <alex-custom-tabs
          v-model="firstExampleActivePage"
          :tabs="exampleTabs"
          color="black"
        ></alex-custom-tabs>
        <v-icon icon=" mdi-code-tags" color="gray-600" />
      </div>
      <v-window v-model="firstExampleActivePage" class="w-100">
        <v-window-item value="1">
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
        </v-window-item>
        <v-window-item value="2">
          <div class="bg-grey-lighten-5 pa-3" style="position: relative">
            <prism class="bg-grey-lighten-5">
              {{
                ` 
      &lt;script setup&gt;
      ${firstExampleScript}
      &lt;/script&gt;
                  `
              }}
            </prism>
            <v-btn
              class="copy-icon"
              variant="text"
              color="gray-400"
              @click="copyToClipboard(firstExampleScript, 'firstScript')"
            >
              <v-icon
                v-if="copiedValue == 'firstScript'"
                size="x-large"
                icon="mdi-clipboard-check-multiple-outline"
                color="green-lighten-1"
              />
              <v-icon v-else size="x-large" icon="mdi-content-copy" />
            </v-btn>
          </div>
        </v-window-item>
      </v-window>
    </div>
    <h2 class="text-h3 text-gray-800">
      :data-tour, active-step e isTourActive
    </h2>
    <p class="text-subtitle-2 text-gray-500">
      A propriedade <strong>data-tour</strong> vincula o step do onBoarding a um
      ponto do html, para que o onBoarding saiba onde deve ser exibido. <br />
      A classe <strong>active-step</strong> é adicionada quando o passo está
      ativo, é vinculada a <strong>isTourActive</strong> e é utilizada para
      acrescentar highlights no elemento vinculado ao passo.
      <br />
    </p>
    <h2 class="text-h3 text-gray-800">Iniciando o on Boarding</h2>
    <p class="text-subtitle-2 text-gray-500">
      O método para iniciar o onBoarding está definido no composable. Ele pode
      ser chamado ao definir a constante tour, como no exemplo abaixo.
      <br />
    </p>

    <p>
      <Prism inline class="bg-white pa-0">{{
        `const { tour, isTourActive } = useOnBoarding(steps);`
      }}</Prism>
      <br />
    </p>
    <h2 class="text-h3 text-gray-800">Messages para o i18n</h2>
    <p class="text-subtitle-2 text-gray-500">
      Abaixo estão exemplos das <em>messages</em> para o i18n, onde você define
      os textos a serem exibidos. Para cada idioma é necessário criar um arquivo
      json com as mensagens correspondentes. Caso já exista um arquivo json para
      o idioma desejado e página onde será inserido o onBoarding, basta
      adicionar as mensagens como no exemplo abaixo.
    </p>
    <div class="w-100">
      <div
        class="d-flex align-center justify-space-between w-100 px-3 bg-gray-100 rounded-t"
      >
        <alex-custom-tabs
          v-model="thirdExampleActivePage"
          :tabs="exampleTabs"
          color="black"
        ></alex-custom-tabs>
        <v-icon icon=" mdi-code-tags" color="gray-600" />
      </div>
      <v-window v-model="thirdExampleActivePage" class="w-100">
        <v-window-item value="1">
          <div class="bg-grey-lighten-5 pa-3" style="position: relative">
            <prism class="bg-grey-lighten-5">
              {{ thirdExampleTemplate }}
            </prism>
            <v-btn
              class="copy-icon"
              variant="text"
              color="gray-400"
              @click="copyToClipboard(thirdExampleTemplate, 'thirdTemplate')"
            >
              <v-icon
                v-if="copiedValue == 'thirdTemplate'"
                size="x-large"
                icon="mdi-clipboard-check-multiple-outline"
                color="green-lighten-1"
              />
              <v-icon v-else size="x-large" icon="mdi-content-copy" />
            </v-btn>
          </div>
        </v-window-item>
        <v-window-item value="2">
          <div class="bg-grey-lighten-5 pa-3" style="position: relative">
            <prism class="bg-grey-lighten-5">
              {{
                ` 
      &lt;script setup&gt;
      ${thirdExampleScript}
      &lt;/script&gt;
                  `
              }}
            </prism>
            <v-btn
              class="copy-icon"
              variant="text"
              color="gray-400"
              @click="copyToClipboard(thirdExampleScript, 'thirdScript')"
            >
              <v-icon
                v-if="copiedValue == 'thirdScript'"
                size="x-large"
                icon="mdi-clipboard-check-multiple-outline"
                color="green-lighten-1"
              />
              <v-icon v-else size="x-large" icon="mdi-content-copy" />
            </v-btn>
          </div>
        </v-window-item>
      </v-window>
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
const firstExampleActivePage = ref('1');
const thirdExampleActivePage = ref('1');

const propsExample = `
    
const steps = [
  {
    id: 'step1',
    title: i18n.t('layouts.default.step1.title'),
    text: i18n.t('layouts.default.step1.text'),
    attachTo: {
      element: '[data-tour="step-dashboard"]',
      on: 'bottom',
    },
    buttons: [
      {
        text: i18n.t('layouts.default.step1.nextButton'),
        action: 'next',
      },
    ],
  },`;

const firstExampleTemplate = `<div v-for="(menu, i) in menus" :key="menu.key">
        <div
          :data-tour="menu.dataTour"
          :class="{ 'active-step': menu.dataTour !== '' && isTourActive }"
        > `;

const thirdExampleTemplate = `

    /assets/locales/en.json

    {
    "step1": {
        "title": "Welcome to Project ALEX, be ready to learn and teach!",
        "text": "We start with the Dashboard, it centralizes information and shortcuts to system features",
        "nextButton": "Next"
    },
    "step2": {
        "title": "Access Courses and Projects",
        "text": "Here you can access the courses and projects created by the entire community",
        "backButton": "Back",
        "nextButton": "Next"
    },
    ...
    }

    /assets/locales/pt.json

    "step1": {
    "title": "Bem vindo ao Alex, esteja pronto para aprender e ensinar!",
    "text": "Começamos com um tour da Dashboard, ela centraliza informações e atalhos para as principais funcionalidades do Alex.",
    "nextButton": "Avançar"
  },
  "step2": {
    "title": "Acesse Cursos e Projetos",
    "text": "Aqui você encontra todos os cursos e projetos criados por toda a comunidade.",
    "backButton": "Voltar",
    "nextButton": "Avançar"
  },
    ...
    }
`;

const exampleTabs = [
  {
    label: 'Template',
    value: '1',
  },
];

const copyToClipboard = async (message, item) => {
  await navigator.clipboard.writeText(message);
  copiedValue.value = item;
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
