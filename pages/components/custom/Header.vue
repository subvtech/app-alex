<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column align-start pb-15"
  >
    <h1 class="text-h2 text-gray-800">Header</h1>
    <p class="text-subtitle-2 text-gray-500">
      O componente
      <strong class="bg-accent pa-1 rounded">alex-custom-header</strong> é
      projetado para criar um cabeçalho de página personalizado, oferecendo
      navegação e botões opcionais. Ele inclui um título, um possível botão de
      retorno (back arrow), e um botão opcional.
    </p>

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
              <th>Padrão</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>isTerciary</td>
              <td>Boolean</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
              <td>false</td>
            </tr>
            <tr>
              <td>text</td>
              <td>String</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
              <td>'Botão'</td>
            </tr>
            <tr>
              <td>btnIcon</td>
              <td>String</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
              <td>'mdi-plus'</td>
            </tr>
            <tr>
              <td>title</td>
              <td>String</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
              <td>'Título da página'</td>
            </tr>
            <tr>
              <td>noBackArrow</td>
              <td>Boolean</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
              <td>false</td>
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
      <alex-custom-header />
    </div>
    <p class="text-subtitle-2 text-gray-500">
      <Prism inline class="bg-white pa-0">{{ `<alex-custom-header />` }}</Prism>
    </p>
    <h2 class="text-h3 text-gray-800">Variante: No Back Arrow</h2>
    <p class="text-subtitle-2 text-gray-500">
      Caso deseje, você pode criar header sem o botão de retorno, para isso
      basta adicionar a propriedade <strong>noBackArrow</strong> ao componente.
    </p>
    <div class="w-100">
      <alex-custom-header noBackArrow />
    </div>
    <p class="text-subtitle-2 text-gray-500">
      <Prism inline class="bg-white pa-0"
        >{{ `<alex-custom-header noBackArrow />` }}</Prism
      >
    </p>
    <h2 class="text-h3 text-gray-800">
      Uso das propriedades para personalização da header
    </h2>
    <p class="text-subtitle-2 text-gray-500">
      O componente aceita várias propriedades que permitem personalizar o
      cabeçalho de acordo com as necessidades da sua aplicação. Seguem exemplos abaixo:<br />
    </p>

    <div class="w-100">
      <alex-custom-header
        title="Exemplo header 01"
        :items="[
          { title: 'Início', disabled: false, href: '/inicio' },
          { title: 'Página', disabled: false, href: '/pagina' },
        ]"
        text="Botão"
        btnIcon="mdi-star"
      />
    </div>
    <div class="w-100">
      <alex-custom-header
        title="Exemplo header 02"
        :items="[
          { title: 'Início', disabled: false, href: '/inicio' },
          { title: 'Página', disabled: false, href: '/pagina' },
        ]"
        text="Botão"
        btnIcon="mdi-heart"
        isTerciary
      />
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
const thirdExampleActivePage = ref('1');

const propsExample = `
    <alex-custom-header />
  `;

const thirdExampleTemplate = `

      <alex-custom-header
        title="Exemplo header 01"
        :items="[
          { title: 'Início', disabled: false, href: '/inicio' },
          { title: 'Página', disabled: false, href: '/pagina' },
        ]"
        text="Botão"
        btnIcon="mdi-star"
      />
      

      <alex-custom-header
        title="Exemplo header 02"
        :items="[
          { title: 'Início', disabled: false, href: '/inicio' },
          { title: 'Página', disabled: false, href: '/pagina' },
        ]"
        text="Botão"
        btnIcon="mdi-heart"
        isTerciary
      />`;

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
