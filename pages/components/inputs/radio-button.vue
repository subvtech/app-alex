<template>
  <v-container
    class="page rounded-lg bg-white pa-8 d-flex flex-column align-start pb-15"
  >
    <h1 class="text-h2 text-gray-800">Radio Button</h1>
    <p class="text-subtitle-2 text-gray-500">
      O
      <strong class="bg-accent pa-1 rounded">alex-inputs-radio-button</strong>
      é um simples radio-button.Com a funcionalidade de agrupamento para
      permitir que os usuários escolham uma opção entre um conjunto predefinido
      de opções.
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
          href="https://vuetifyjs.com/en/components/radio-buttons/"
          target="_blank"
          >vuetifyjs.com</a
        >
      </div>
    </div>
    <h2 class="text-h3 text-gray-800">Uso do Componente</h2>
    <div>
      <p class="text-subtitle-2 text-gray-500">
        O componente requer obrigatoriamente um array de objetos. Cada objeto
        deve conter um <strong>label</strong> e um <strong>value</strong>. O
        <strong>label</strong> representa o nome a ser exibido no botão,
        enquanto o <strong>value</strong> é o valor utilizado para identificar o
        botão ativo. Além das propriedades descritas na tabela abaixo, é
        possível passar <strong>qualquer propriedade</strong> padrão do
        componente Vuetify.
      </p>
      <ul class="ml-6 mt-2 text-subtitle-2 text-gray-500">
        <li>
          Ao utilizar o propriedades do
          <a
            class="text-decoration-underline text-blue"
            href="https://vuetifyjs.com/en/api/v-radio-group/#links"
            target="_blank"
            >v-radio-group</a
          >, basta incluí-lo no próprio componente.
        </li>
        <li>
          No caso de propriedades do
          <a
            class="text-decoration-underline text-blue"
            href="https://vuetifyjs.com/en/api/v-radio/"
            target="_blank"
            >v-radio</a
          >, você deve adicioná-lo como uma propriedade no objeto do botão.
        </li>
      </ul>
    </div>

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
              <td>buttons</td>
              <td>Object</td>
              <td class="text-center">
                <v-icon icon="mdi-checkbox-marked" color="success" />
              </td>
            </tr>
            <tr>
              <td>buttons.label</td>
              <td>String</td>
              <td class="text-center">
                <v-icon icon="mdi-checkbox-marked" color="success" />
              </td>
            </tr>
            <tr>
              <td>buttons.value</td>
              <td>String</td>
              <td class="text-center">
                <v-icon icon="mdi-checkbox-marked" color="success" />
              </td>
            </tr>
            <tr>
              <td>buttons.hint</td>
              <td>String</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>buttons.props</td>
              <td>Object</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>buttons.disabled</td>
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
    <div>
      <alex-inputs-radio-button
        v-model="usageButtonsModel[0]"
        :buttons="usageButtons[0]"
      ></alex-inputs-radio-button>
    </div>
    <div class="w-100">
      <div
        class="d-flex align-center justify-space-between w-100 px-3 bg-gray-100 rounded-t"
      >
        <alex-custom-tabs
          v-model="activeExampleTabs[0]"
          :tabs="exampleTabs"
          color="black"
        ></alex-custom-tabs>
        <v-icon icon=" mdi-code-tags" color="gray-600" />
      </div>
      <v-window v-model="activeExampleTabs[0]" class="w-100">
        <v-window-item value="1">
          <div class="bg-grey-lighten-5 pa-3" style="position: relative">
            <prism class="bg-grey-lighten-5">
              {{ exampleTemplates[0] }}
            </prism>
            <v-btn
              class="copy-icon"
              variant="text"
              color="gray-400"
              @click="copyToClipboard(exampleTemplates[0], 'firstTemplate')"
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
${exampleScript[0]}
&lt;/script&gt;
            `
              }}
            </prism>
            <v-btn
              class="copy-icon"
              variant="text"
              color="gray-400"
              @click="copyToClipboard(exampleScript[0], 'firstScript')"
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
    <h2 class="text-h3 text-gray-800">Variante: Props do vuetify</h2>
    <p class="text-subtitle-2 text-gray-500">
      Aqui veremos alguns exemplos de como utilizar as propriedades do vuetify
      no componente.
    </p>
    <div>
      <alex-inputs-radio-button
        v-model="usageButtonsModel[1]"
        inline
        color="orange"
        :buttons="usageButtons[1]"
      ></alex-inputs-radio-button>
    </div>
    <div class="w-100">
      <div
        class="d-flex align-center justify-space-between w-100 px-3 bg-gray-100 rounded-t"
      >
        <alex-custom-tabs
          v-model="activeExampleTabs[1]"
          :tabs="exampleTabs"
          color="black"
        ></alex-custom-tabs>
        <v-icon icon=" mdi-code-tags" color="gray-600" />
      </div>
      <v-window v-model="activeExampleTabs[1]" class="w-100">
        <v-window-item value="1">
          <div class="bg-grey-lighten-5 pa-3" style="position: relative">
            <prism class="bg-grey-lighten-5">
              {{ exampleTemplates[1] }}
            </prism>
            <v-btn
              class="copy-icon"
              variant="text"
              color="gray-400"
              @click="copyToClipboard(exampleTemplates[1], 'secondTemplate')"
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
${exampleScript[1]}
&lt;/script&gt;
            `
              }}
            </prism>
            <v-btn
              class="copy-icon"
              variant="text"
              color="gray-400"
              @click="copyToClipboard(exampleScript[1], 'secondScript')"
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
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import 'prismjs';
import 'prismjs/themes/prism.css';
import Prism from 'vue-prism-component';
const copiedValue = ref('');
const activeExampleTabs = ref(['1', '1']);
const usageButtonsModel = ref(['1', '1']);

const usageButtons = [
  [
    {
      label: 'Opção 1',
      value: '1',
      hint: 'hint opção 1',
    },
    {
      label: 'Opção 2',
      value: '2',
      hint: 'hint opção 2',
    },
    {
      label: 'Opção 3',
      value: '3',
      disabled: true,
      hint: 'hint opção 3',
    },
    {
      label: 'Opção 4',
      value: '4',
      hint: 'hint opção 4',
    },
  ],
  [
    {
      label: 'Opção 1',
      value: '1',
    },
    {
      label: 'Opção 2',
      value: '2',
      props: { color: 'green' },
    },
    {
      label: 'Opção 3',
      value: '3',
      props: { density: 'comfortable', color: 'blue' },
    },
    {
      label: 'Opção 4',
      value: '4',
      hint: 'hint opção 4',
      props: { color: 'accent' },
    },
  ],
];

const exampleTemplates = [
  `   <alex-inputs-radio-button :buttons="buttons"  v-model="activeButton"/>`,
  `   <alex-inputs-radio-button
    v-model="usageButtonsModel[1]"
    :buttons="usageButtons[1]"
    inline
    color="orange">
   </alex-inputs-radio-button>`,
];

const exampleScript = [
  `
const activeButton = ref('1');
const tabs = [
        { label: 'Opção 1', value: '1', },
        { label: 'Opção 2', value: '2', },
        { label: 'Opção 3', value: '3', disabled: true },
        { label: 'Opção 4', value: '4',}
        ];
`,
  `const activeButton = ref('1');
const tabs = {
        { label: 'Opção 1', value: '1'},
        { label: 'Opção 2', value: '2', props: { color: 'green' } },
        { label: 'Opção 3', value: '3' ,props: { density: 'comfortable' , color: 'blue' } },
        { label: 'Opção 4', value: '4', hint: 'hint opção 3' props: { color: 'accent' } },
        };
}
`,
];

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

const propsExample = `
const buttons = [
  {
    label: 'Opção 1',
    value: '1',
    hint: 'hint'
  },
  {
    label: 'Opção 2',
    value: '2',
    props:{color: 'primary'}
  },
  {
    label: 'Opção 3',
    value: '3',
    disabled: true,
  },
];
`;

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
