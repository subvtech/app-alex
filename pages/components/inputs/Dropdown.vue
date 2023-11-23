<template>
  <v-container
    class="page rounded-lg bg-white pa-8 d-flex flex-column align-start pb-15"
  >
    <h1 class="text-h2 text-gray-800">Dropdown</h1>
    <p class="text-subtitle-2 text-gray-500">
      O
      <strong class="bg-accent pa-1 rounded">alex-inputs-dropdown</strong>
      é útil ao lidar com informações em espaços reduzidos, permitindo que
      usuário visualize as informações apenas quando desejar, evitando poluição
      visual. O componente é composto por um ativador, que pode ser um botão ou
      texto. Quando ativado, exibe a lista de opções. Além disso, componente
      oferece a flexibilidade de escolher a localização de exibição, podendo ser
      à esquerda, à direita ou abaixo do botão
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
          href="https://v2.vuetifyjs.com/en/components/menus/#usage"
          target="_blank"
          >vuetifyjs.com</a
        >
      </div>
    </div>
    <h2 class="text-h3 text-gray-800">Uso do Componente</h2>
    <p class="text-subtitle-2 text-gray-500">
      Para utilizar o componente, basta importá-lo e adicioná-lo ao template.
      <br />
      <Prism inline class="bg-white pa-0">{{
        `import Dropdown from '@/components/alex/inputs/Dropdown.vue';`
      }}</Prism>
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
              <td>options</td>
              <td>Object</td>
              <td class="text-center">
                <v-icon icon="mdi-checkbox-marked" color="success" />
              </td>
            </tr>
            <tr>
              <td>options.openOnClick</td>
              <td>Boolean</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>options.openOnHover</td>
              <td>Boolean</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>options.closeOnContentClick</td>
              <td>Boolean</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>options.location</td>
              <td>String</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>options.isDarkMode</td>
              <td>Boolean</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>items</td>
              <td>Array</td>
              <td class="text-center">
                <v-icon icon="mdi-checkbox-marked" color="success" />
              </td>
            </tr>
            <tr>
              <td>items.id</td>
              <td>Number</td>
              <td class="text-center">
                <v-icon icon="mdi-checkbox-marked" color="success" />
              </td>
            </tr>
            <tr>
              <td>items.type</td>
              <td>String</td>
              <td class="text-center">
                <v-icon icon="mdi-checkbox-marked" color="success" />
              </td>
            </tr>
            <tr>
              <td>items.icon</td>
              <td>String</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>items.text</td>
              <td>String</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>items.class</td>
              <td>String</td>
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
    <div class="w-100"></div>
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
    <div class="w-100"></div>
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
    <h2 class="text-h3 text-gray-800">Uso de Props</h2>
    <p class="text-subtitle-2 text-gray-500">
      O conteúdo de cada item é inserido através das props options e items:<br />
      <Prism inline class="bg-white pa-0">{{
        `
        const options1 = ref({
        openOnClick: true,
        openOnHover: true,
        closeOnContentClick: true,
        location: 'end',
        isDarkMode: false,
        &#x7d);`
      }}</Prism>
    </p>
    <p class="text-subtitle-2 text-gray-500">
      Existe uma opção de estilo complementar ao utilizar
      <strong>class: 'warning'</strong>. por exemplo:<br />
      <Prism inline class="bg-white">{{
        `
          {
        id: 4,
        type: 'icon',
        icon: 'mdi-delete',
        text: 'Excluir',
        class: 'warning',
    },
        `
      }}</Prism>
      <br />
    </p>

    <div class="w-100">
      <Dropdown :items="itens1" :options="opcoes1" />
    </div>
    <div class="w-100">
      <AlexCustomAccordion v-model:data="listSlots">
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
    <div class="w-100">
      <alex-inputs-dropdown
        v-model="selectedItems"
        :items="itemsDropCheckbox"
        :options="optionsDropCheckbox"
      />
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import 'prismjs';
import 'prismjs/themes/prism.css';
import Prism from 'vue-prism-component';
import Dropdown from '@/components/alex/inputs/Dropdown.vue';

const copiedValue = ref('');
const firstExampleActivePage = ref('1');
const secondExampleActivePage = ref('1');
const thirdExampleActivePage = ref('1');

const itens1 = ref([
  {
    id: 1,
    type: 'icon',
    icon: 'mdi-home',
    text: 'Início',
  },
  {
    id: 2,
    type: 'icon',
    icon: 'mdi-account-circle',
    text: 'Perfil',
  },
  {
    id: 3,
    type: 'icon',
    icon: 'mdi-account',
    text: 'Configurações',
    class: 'warning',
  },
]);
const opcoes1 = ref({
  openOnClick: true,
  openOnHover: false,
  closeOnContentClick: true,
  location: 'end',
  isDarkMode: false,
});

const itemsDropCheckbox = ref([
  {
    id: 1,
    type: 'checkbox',
    text: 'Opção 1',
  },
  {
    id: 2,
    type: 'checkbox',
    text: 'Opção 2',
  },
  {
    id: 3,
    type: 'checkbox',
    text: 'Opção 3',
  },
]);

const optionsDropCheckbox = ref({
  openOnClick: true,
  openOnHover: false,
  closeOnContentClick: false,
  location: 'start',
  isDarkMode: true,
});

const propsExample = `
<Dropdown 
  :items="dropdownItems" 
  :options="dropdownOptions" 
/>
  
const dropdownItems = ref([
  {
    id: 1,
    ...
  },
  {
    id: 2,
    ...
  },
  {
    id: 3,
    ...
  },
])

const dropdownOptions = ref({
  ...
})
  `;

const firstExampleTemplate = `<Dropdown :items="items1" :options="options1" />
`;

const firstExampleScript = `
    import { ref } from 'vue';
    const items1 = ref([
    {
        id: 1,
        type: 'icon',
        icon: 'mdi-home',
        text: 'Início',
    },
    {
        id: 2,
        type: 'icon',
        icon: 'mdi-account-circle',
        text: 'Perfil',
    },
    {
        id: 3,
        type: 'icon',
        icon: 'mdi-account',
        text: 'Configurações',
    },
    ]);

    const options1 = ref({
    openOnClick: true,
    openOnHover: true,
    closeOnContentClick: true,
    location: 'end',
    isDarkMode: false,
    });
`;

const secondExampleTemplate = `
<Dropdown :items="items2" :options="options1" />`;

const secondExampleScript = `
    const items2 = ref([
    {
        id: 1,
        type: 'icon',
        icon: 'mdi-lock',
        text: 'Bloquear',
    },
    {
        id: 2,
        type: 'icon',
        icon: 'mdi-pencil',
        text: 'Editar',
    },
    {
        id: 3,
        type: 'icon',
        icon: 'mdi-check-decagram-outline',
        text: 'Verificar',
    },
    {
        id: 4,
        type: 'icon',
        icon: 'mdi-delete',
        text: 'Excluir',
        class: 'warning',
    },
    ]);

    const options1 = ref({
    openOnClick: true,
    openOnHover: true,
    closeOnContentClick: true,
    location: 'end',
    isDarkMode: false,
    });
  `;

const thirdExampleTemplate = `
<Dropdown :items="items3" :options="options2" />`;

const thirdExampleScript = `
    const items3 = ref([
    {
        id: 1,
        type: 'checkbox',
        text: 'Opção 1',
    },
    {
        id: 2,
        type: 'checkbox',
        text: 'Opção 2',
    },
    {
        id: 3,
        type: 'checkbox',
        text: 'Opção 3',
    },
    ]);

    const options2 = ref({
    openOnClick: true,
    openOnHover: false,
    closeOnContentClick: true,
    location: 'start',
    isDarkMode: true,
    });`;

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
