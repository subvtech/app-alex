<template>
    <v-container
      class="page rounded-lg bg-white pa-8 d-flex flex-column align-start pb-15"
    >
      <h1 class="text-h2 text-gray-800">Checkbox</h1>
      <p class="text-subtitle-2 text-gray-500">
        O
        <strong class="bg-accent pa-1 rounded">alex-inputs-checkbox</strong>
        é útil para permitir aos usuários selecionar opções múltiplas dentre um
        conjunto de escolhas. Utiliza props para inserir características em cada
        item, tornando o componente completamente personalizável.
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
            href="https://vuetifyjs.com/en/components/checkboxes/#checkboxes"
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
                <td>checked</td>
                <td>Boolean</td>
                <td class="text-center">
                  <v-icon icon="mdi-close-box" color="error" />
                </td>
              </tr>
              <tr>
                <td>label</td>
                <td>String</td>
                <td class="text-center">
                  <v-icon icon="mdi-close-box" color="error" />
                </td>
              </tr>
              <tr>
                <td>hint</td>
                <td>String</td>
                <td class="text-center">
                  <v-icon icon="mdi-close-box" color="error" />
                </td>
              </tr>
              <tr>
                <td>disabled</td>
                <td>Boolean</td>
                <td class="text-center">
                  <v-icon icon="mdi-close-box" color="error" />
                </td>
              </tr>
              <tr>
                <td>indeterminate</td>
                <td>Boolean</td>
                <td class="text-center">
                  <v-icon icon="mdi-close-box" color="error" />
                </td>
              </tr>
              <tr>
                <td>Readonly</td>
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
      <div class="d-flex flex-wrap w-100">
        <alex-inputs-checkbox checked label="Checkbox 1" hint="Hint" />
        <alex-inputs-checkbox label="Checkbox 2" hint="Hint 2" />
        <alex-inputs-checkbox indeterminate label="Checkbox 3" hint="Hint 3" />
        <alex-inputs-checkbox checked disabled label="Checkbox 4" hint="Hint 4" />
        <alex-inputs-checkbox disabled label="Checkbox 5" hint="Hint 5" />
        <alex-inputs-checkbox checked readonly label="Checkbox 6" hint="Hint 6" />
        <alex-inputs-checkbox readonly label="Checkbox 7" hint="Hint 7" />
        <alex-inputs-checkbox indeterminate readonly label="Checkbox 8" hint="Hint 8" />
        <alex-inputs-checkbox checked label="Checkbox 9" readonly />
        <alex-inputs-checkbox checked label="" readonly />
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
      <h2 class="text-h3 text-gray-800">Checked</h2>
      <p class="text-subtitle-2 text-gray-500">
        A propriedade <strong>checked</strong> é um booleano que, quando
        informado, deixa o checkbox marcado. Para que o checkbox esteja
        inicialmente sem marcação, basta não informar a propriedade
        <strong>checked</strong>.
      </p>
      <h2 class="text-h3 text-gray-800">Variante: No Label, No Hint</h2>
      <p class="text-subtitle-2 text-gray-500">
        Caso deseje, você pode criar checkboxes sem label ou sem hint (ou ambos),
        para isso basta não adicionar as propriedades
        <strong>label</strong> ou <strong>hint</strong>.
      </p>
      <div class="w-100">
        <alex-inputs-checkbox checked />
        <alex-inputs-checkbox />
        <alex-inputs-checkbox indeterminate />
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
      <h2 class="text-h3 text-gray-800">Uso do Disabled e Readonly</h2>
      <p class="text-subtitle-2 text-gray-500">
        O checkbox pode ser modificado com as props disabled ou readonly, o
        disabled é um booleano que, quando verdadeiro, desativa o checkbox e seu
        estilo, já o readonly é um booleano que, quando verdadeiro, torna o
        checkbox somente leitura, mas sem desativar o seu estilo <br />
        <Prism inline class="bg-white pa-0"
          >{{ ` <alex-inputs-checkbox checked disabled />` }}</Prism
        >
        <br />
        <Prism inline class="bg-white"
          >{{ ` <alex-inputs-checkbox checked readonly />` }}</Prism
        >
      </p>
  
      <div class="w-100">
        <alex-inputs-checkbox
          checked
          disabled
          label="Disabled Checkbox"
          hint="You can't change its value"
        />
        <alex-inputs-checkbox
          checked
          readonly
          label="Readonly Checkbox"
          hint="You can still see it's style"
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
  const firstExampleActivePage = ref('1');
  const secondExampleActivePage = ref('1');
  const thirdExampleActivePage = ref('1');
  
  const propsExample = `
    <alex-inputs-checkbox 
    checked 
    label="Checkbox 1" 
    hint="Hint" />
    `;
  
  const firstExampleTemplate = `
  <alex-inputs-checkbox 
    checked 
    label="Checkbox 1" 
    hint="Hint" 
  /> `;
  
  const secondExampleTemplate = `
  <alex-inputs-checkbox checked />
  <alex-inputs-checkbox />
  <alex-inputs-checkbox indeterminate />
  `;
  
  const thirdExampleTemplate = `
  <template>
    <alex-inputs-checkbox 
      checked 
      label="Checkbox 1" 
      hint="Hint" 
    />
    <alex-inputs-checkbox
      label="Checkbox 2"
      hint="Hint 2" 
    />
    <alex-inputs-checkbox 
      indeterminate
      label="Checkbox 3"
      hint="Hint 3"
    />
    <alex-inputs-checkbox
      checked 
      disabled 
      label="Checkbox 4" 
      hint="Hint 4" 
    />
    <alex-inputs-checkbox 
      disabled 
      label="Checkbox 5" 
      hint="Hint 5" 
    />
    <alex-inputs-checkbox 
      checked 
      readonly 
      label="Checkbox 6" 
      hint="Hint 6" />
    <alex-inputs-checkbox 
      readonly 
      label="Checkbox 7" 
      hint="Hint 7" 
    />
    <alex-inputs-checkbox 
      indeterminate 
      readonly 
      label="Checkbox 8" 
      hint="Hint 8" 
    />
    <alex-inputs-checkbox 
      checked 
      label="Checkbox 9" 
      readonly 
    />
    <alex-inputs-checkbox 
      checked 
      label="" 
      readonly 
    />
  </template>`;
  
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