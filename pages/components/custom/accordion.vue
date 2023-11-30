<template>
  <v-container
    class="page rounded-lg bg-white pa-8 d-flex flex-column align-start pb-15"
  >
    <h1 class="text-h2 text-gray-800">Accordion</h1>
    <p class="text-subtitle-2 text-gray-500">
      O
      <strong class="bg-accent pa-1 rounded">alex-custom-accordion</strong>
      é útil para reduzir o espaço vertical ao lidar com grandes quantidades de
      informações, ele possui um sistema de drag and drop para reordenar os
      itens e
      <a
        class="text-decoration-underline text-blue"
        href="https://vuejs.org/guide/components/slots.html"
        target="_blank"
        >slots</a
      >
      para inserir o conteúdo de cada item, tornando o componente completamente
      personalizável.
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
          href="https://vuetifyjs.com/en/components/expansion-panels"
          target="_blank"
          >vuetifyjs.com</a
        >
      </div>
    </div>
    <h2 class="text-h3 text-gray-800">Uso do Componente</h2>
    <p class="text-subtitle-2 text-gray-500">
      O componente recebe obrigatoriamente um array de objetos, onde cada objeto
      pode conter as propriedades <strong>keyWord</strong>,
      <strong>title</strong>, <strong>icon</strong> e
      <strong>contentData</strong>, o uso de cada uma delas vai depender do
      intuito do componente. Esse array deve ser passado para o componente
      através de um v-model.
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
              <td>show-positions</td>
              <td>Boolean</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>data</td>
              <td>Object</td>
              <td class="text-center">
                <v-icon icon="mdi-checkbox-marked" color="success" />
              </td>
            </tr>
            <tr>
              <td>data.title</td>
              <td>String</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>data.keyWord</td>
              <td>String</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>data.icon</td>
              <td>String</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>data.contentData</td>
              <td>Object</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>data.positions</td>
              <td>Boolean</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
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
      <AlexCustomAccordion v-model:data="list">
        <template #content="{ text, image }">
          <p class="text-h3">{{ text }}</p>
          <img class="rounded-lg w-25" :src="image" />
        </template>
      </AlexCustomAccordion>
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
    <h2 class="text-h3 text-gray-800">Variante: Numeração e KeyWord</h2>
    <p class="text-subtitle-2 text-gray-500">
      Caso deseje, você pode fazer uma lista enumerada e adicionar palavra
      chaves para cada um dos itens, para isso basta adicionar as propriedades
      <strong>keyWord</strong> e caso deseje exibir a numeração todos os itens,
      basta adicionar a propriedade <strong> show-positions </strong> ao
      componente ou caso deseje exibir ou ocultar a numeração itens epecificos,
      basta passar a propriedade <strong>position</strong> como true ou false no
      item desejado.
    </p>
    <div class="w-100">
      <AlexCustomAccordion v-model:data="listVariant" show-positions>
        <template #content="{ text }">
          <p class="text-h5">{{ text }}</p>
        </template>
      </AlexCustomAccordion>
    </div>
    <div class="w-100">
      <div
        class="d-flex align-center justify-space-between w-100 px-3 bg-gray-100 rounded-t"
      >
        <alex-custom-tabs
          v-model="secondExampleActivePage"
          :tabs="exampleTabs"
          color="black"
        ></alex-custom-tabs>
        <v-icon icon=" mdi-code-tags" color="gray-600" />
      </div>
      <v-window v-model="secondExampleActivePage" class="w-100">
        <v-window-item value="1">
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
        </v-window-item>
        <v-window-item value="2">
          <div class="bg-grey-lighten-5 pa-3" style="position: relative">
            <prism class="bg-grey-lighten-5">
              {{
                ` 
  &lt;script setup&gt;
  ${secondExampleScript}
  &lt;/script&gt;
              `
              }}
            </prism>
            <v-btn
              class="copy-icon"
              variant="text"
              color="gray-400"
              @click="copyToClipboard(secondExampleScript, 'secondScript')"
            >
              <v-icon
                v-if="copiedValue == 'secondScript'"
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
    <h2 class="text-h3 text-gray-800">Uso dos Slots</h2>
    <p class="text-subtitle-2 text-gray-500">
      O conteúdo de cada item é inserido através de slots, o formato do
      conteúdo(html) é o mesmo para todos os itens, o componente apenas injeta
      os dados definidos no contentData de cada item no slot. Para acessar os
      dados do item, basta passar o nome da propriedade que deseja acessar como
      parâmetro do slot, por exemplo:<br />
      <Prism inline class="bg-white pa-0"
        >{{ `
        <template #content="{ text }">
          <p>&#x7b;&#x7b; text &#x7d;&#x7d;</p> </template
        >` }}</Prism
      >
    </p>
    <p class="text-subtitle-2 text-gray-500">
      Caso deseje acessar os dados do item de fora de contentData, você deve
      usar o parametro de index do slot, e acessar seu item através do array de
      dados passado para o componente, por exemplo:<br />
      <Prism inline class="bg-white"
        >{{ `
        <template #content="{ index }">
          <p>&#x7b;&#x7b; list[index].title &#x7d;&#x7d;</p> </template
        >` }}</Prism
      >
      <br />
    </p>

    <div class="w-100">
      <AlexCustomAccordion v-model:data="listSlots" show-positions>
        <template #content="{ index, text, image }">
          <v-text-field
            v-model="listSlots[index].title"
            label="Titulo"
            placeholder="Insira um Titulo"
          />
          <v-text-field
            v-model="listSlots[index].keyWord"
            label="KeyWord"
            placeholder="Insira uma keyWord"
          />
          <v-text-field
            v-model="listSlots[index].icon"
            label="Ícone"
            placeholder="Insira um Ícone"
          />
          <p v-if="text">{{ text }}</p>
          <img v-if="image" class="w-25 rounded-lg" :src="image" />
        </template>
      </AlexCustomAccordion>
    </div>
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

const copiedValue = ref('');
const firstExampleActivePage = ref('1');
const secondExampleActivePage = ref('1');
const thirdExampleActivePage = ref('1');

const list = ref([
  {
    title: 'Image 1',
    icon: 'mdi-image',
    contentData: {
      text: 'Texto 1',
      image: 'https://picsum.photos/400/300',
    },
  },
  {
    title: 'Image 2',
    icon: 'mdi-image',
    contentData: {
      text: 'Texto 2',
      image: 'https://picsum.photos/500/300',
    },
  },
  {
    title: 'Image 3 ',
    icon: 'mdi-image',
    contentData: {
      text: 'Texto 3',
      image: 'https://picsum.photos/400/400',
    },
  },
]);

const listVariant = ref([
  {
    keyWord: 'Melhorar',
    title: 'o aprendizado do aluno por meio de metodologias funcionais',
    ordered: true,
    contentData: {
      text: 'O objetivo do projeto é melhorar o aprendizado do aluno por meio de metodologias funcionais.',
    },
  },
  {
    keyWord: 'Pesquisar',
    title:
      'o aprendizado do aluno por meio de metodologias funcionais. para assim melhorar o aprendizado do aluno por meio de metodologias funcionais.',
    contentData: {
      text: 'Devemos pesquisar o aprendizado do aluno por meio de metodologias funcionais.',
    },
  },
  {
    keyWord: 'Criar',
    title: 'o aprendizado do aluno por meio de metodologias funcionais. ',
    contentData: {
      text: 'E por fim, criar o aprendizado do aluno por meio de metodologias funcionais.',
    },
  },
]);

const listSlots = ref([
  {
    keyWord: 'Melhorar',
    title: 'o aprendizado do aluno por meio de metodologias funcionais',
  },
  {
    keyWord: 'Pesquisar',
    title: 'o aprendizado do aluno por meio de metodologias funcionais.',
    contentData: {
      text: 'Devemos pesquisar o aprendizado do aluno por meio de metodologias funcionais.',
    },
  },
  {
    keyWord: 'Criar',
    title: 'o aprendizado do aluno por meio de metodologias funcionais. ',
  },
  {
    title: 'Image',
    icon: 'mdi-image',
    position: false,
    contentData: {
      image: 'https://picsum.photos/400/400',
    },
  },
  {
    title: 'Video',
    position: false,
    icon: 'mdi-video',
  },
]);

const propsExample = `
const data = ref([
  {
    title: 'Logo Projeto Alex',
    icon: 'mdi-image',
    contentData: {
      text: 'Imagem do logo do projeto Alex'
      image: 'alex-logo.png'
    }
  },
])

`;

const firstExampleTemplate = `
<AlexCustomAccordion v-model:data="list">
  <template #content="{ text, image }">
      <h1>{{ text }}</h1>
      <img class="w-25 rounded-lg" :src="image" />
  </template>
</AlexCustomAccordion>`;

const firstExampleScript = `
import { ref } from 'vue';
const list = ref([
  {
    title: 'Image 1',
    icon: 'mdi-image',
    contentData: {
      text: 'Texto 1',
      image: 'https://picsum.photos/400/300',
    },
  },
  {
    title: 'Image 2',
    icon: 'mdi-image',
    contentData: {
      text: 'Texto 2',
      image: 'https://picsum.photos/500/300',
    },
  },
  {
    title: 'Image 3 ',
    icon: 'mdi-image',
    contentData: {
      text: 'Texto 3',
      image: 'https://picsum.photos/400/400',
    },
  },
]);
`;

const secondExampleTemplate = `
<AlexCustomAccordion v-model:data="list" show-positions>
    <template #content="{ text }">
      <p class="text-h5">{{ text }}</p>
    </template>
</AlexCustomAccordion>`;

const secondExampleScript = `
import { ref } from 'vue';
const list = ref([
  {
    keyWord: 'Melhorar',
    title: 'o aprendizado do aluno por meio de metodologias funcionais',
    contentData: {
      text: 'O objetivo do projeto é melhorar o aprendizado do aluno por meio de metodologias funcionais.',
    },
  },
  {
    keyWord: 'Pesquisar',
    title:
      'o aprendizado do aluno por meio de metodologias funcionais. para assim melhorar o aprendizado do aluno por meio de metodologias funcionais.',
    contentData: {
      text: 'Devemos pesquisar o aprendizado do aluno por meio de metodologias funcionais.',
    },
  },
  {
    keyWord: 'Criar',
    title: 'o aprendizado do aluno por meio de metodologias funcionais. ',
    contentData: {
      text: 'E por fim, criar o aprendizado do aluno por meio de metodologias funcionais.',
    },
  },
]);
`;

const thirdExampleTemplate = `
<AlexCustomAccordion v-model:data="list" show-positions>
<template #content="{ index, text, image }">
  <v-text-field
    v-model="list[index].title"
    label="Titulo"
    placeholder="Insira um Titulo"
  />
  <v-text-field
    v-model="list[index].keyWord"
    label="KeyWord"
    placeholder="Insira uma keyWord"
  />
  <v-text-field
    v-model="list[index].icon"
    label="Ícone"
    placeholder="Insira um Ícone"
  />
  <p v-if="text">{{ text }}</p>
  <img v-if="image" class="w-25 rounded-lg" :src="image" />
</template>
</AlexCustomAccordion>`;

const thirdExampleScript = `
import { ref } from 'vue';
const list = ref([
{
    keyWord: 'Melhorar',
    title: 'o aprendizado do aluno por meio de metodologias funcionais',
  },
  {
    keyWord: 'Pesquisar',
    title: 'o aprendizado do aluno por meio de metodologias funcionais.',
    contentData: {
      text: 'Devemos pesquisar o aprendizado do aluno por meio de metodologias funcionais.',
    },
  },
  {
    keyWord: 'Criar',
    title: 'o aprendizado do aluno por meio de metodologias funcionais. ',
  },
  {
    title: 'Image',
    icon: 'mdi-image',
    position: false,
    contentData: {
      image: 'https://picsum.photos/400/400',
    },
  },
  {
    title: 'Video',
    position: false,
    icon: 'mdi-video',
  },
])
`;

const exampleTabs = [
  {
    label: 'Template',
    value: '1',
  },
  {
    label: 'Script',
    value: '2',
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
