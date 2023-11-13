<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column align-start pb-15"
  >
    <h1 class="text-h2 text-gray-800">Tabs</h1>
    <p class="text-subtitle-2 text-gray-500">
      O
      <strong class="bg-accent pa-1 rounded">alex-custom-tabs</strong>
      é um componente usado para ocultar conteúdo por trás de um item
      selecionável. Isso também pode ser usado como uma pseudo-navegação para
      uma página, onde as abas são links e os itens de aba são o conteúdo.
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
          href="https://vuetifyjs.com/en/components/tabs/"
          target="_blank"
          >vuetifyjs.com</a
        >
      </div>
    </div>
    <h2 class="text-h3 text-gray-800">Uso do Componente</h2>
    <p class="text-subtitle-2 text-gray-500">
      O componente recebe obrigatoriamente um array de objetos, onde cada objeto
      deve conter um <strong>label</strong> e um <strong>value</strong>, sendo
      label o nome a ser exibido na aba e value o valor que será usado para
      identificar a aba. Também é necessário passar um
      <strong>v-model</strong> para o componente, para que ele possa controlar
      qual aba está ativa.
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
              <td>tabs</td>
              <td>Object</td>
              <td class="text-center">
                <v-icon icon="mdi-checkbox-marked" color="success" />
              </td>
            </tr>
            <tr>
              <td>tabs.label</td>
              <td>String</td>
              <td class="text-center">
                <v-icon icon="mdi-checkbox-marked" color="success" />
              </td>
            </tr>
            <tr>
              <td>tabs.value</td>
              <td>String</td>
              <td class="text-center">
                <v-icon icon="mdi-checkbox-marked" color="success" />
              </td>
            </tr>
            <tr>
              <td>tabs.notification</td>
              <td>Boolean</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>vertical</td>
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
        <Prism class="bg-white pa-0" language="javascript">
          {{ propsExample }}
        </Prism>
      </div>
    </div>
    <div>
      <alex-custom-tabs
        v-model="usageActivePage"
        :tabs="usageTabs"
      ></alex-custom-tabs>
      <v-window v-model="usageActivePage" class="mt-2">
        <v-window-item value="1"> Primeira pagina </v-window-item>

        <v-window-item value="2"> Segunda Pagina </v-window-item>

        <v-window-item value="3"> Terceira Pagina </v-window-item>
      </v-window>
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
    <h2 class="text-h3 text-gray-800">Variante: Alternado a cor</h2>
    <p class="text-subtitle-2 text-gray-500">
      Por padrão, o componente usa a cor
      <strong class="bg-accent pa-1 rounded">#00b7cc</strong>, mas você pode
      alterar essa cor, passando uma props com a cor desejada.
    </p>
    <div class="d-flex w-100 flex-column flex-sm-row">
      <div class="w-100 w-sm-25">
        <alex-custom-tabs
          v-model="usageVariantActivePage"
          :tabs="usageTabs"
          :color="customColor"
        ></alex-custom-tabs>
        <v-window v-model="usageVariantActivePage" class="mt-2">
          <v-window-item value="1"> Primeira pagina </v-window-item>

          <v-window-item value="2"> Segunda Pagina </v-window-item>

          <v-window-item value="3"> Terceira Pagina </v-window-item>
        </v-window>
      </div>
      <v-color-picker v-model="customColor"></v-color-picker>
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
${firstExampleScript}
&lt;/script&gt;
            `
              }}
            </prism>
            <v-btn
              class="copy-icon"
              variant="text"
              color="gray-400"
              @click="copyToClipboard(firstExampleScript, 'secondScript')"
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
    <h2 class="text-h3 text-gray-800">Variante: Notificações</h2>
    <p class="text-subtitle-2 text-gray-500">
      Você pode adicionar uma notificação em uma aba, passando o valor
      <strong>notification </strong>, dentro do objeto que representa aquela
      aba.
    </p>
    <div class="w-100 d-flex">
      <div class="w-100">
        <alex-custom-tabs
          v-model="usageVariantActivePage"
          :tabs="usageTabsNotifications"
          center-active
        ></alex-custom-tabs>
        <v-window v-model="usageVariantActivePage" class="mt-2">
          <v-window-item value="1"> Primeira pagina </v-window-item>
          <v-window-item value="2"> Segunda Pagina </v-window-item>
          <v-window-item value="3"> Terceira Pagina </v-window-item>
          <v-window-item value="4"> Quarta Pagina </v-window-item>
        </v-window>
      </div>
      <v-btn icon="mdi-refresh" @click="resetNotifications()"></v-btn>
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
    <h2 class="text-h3 text-gray-800">Variante: Tabs na vertical</h2>
    <p class="text-subtitle-2 text-gray-500">
      Você pode alterar a orientação das abas, basta adicionar a props
      <strong>vertical</strong>.
    </p>
    <div>
      <div class="w-100">
        <alex-custom-tabs
          v-model="usageVariantActivePage"
          :tabs="usageTabs"
          vertical
        ></alex-custom-tabs>
        <v-window v-model="usageVariantActivePage" class="mt-2">
          <v-window-item value="1"> Primeira pagina </v-window-item>
          <v-window-item value="2"> Segunda Pagina </v-window-item>
          <v-window-item value="3"> Terceira Pagina </v-window-item>
        </v-window>
      </div>
    </div>
    <div class="w-100">
      <div
        class="d-flex align-center justify-space-between w-100 px-3 bg-gray-100 rounded-t"
      >
        <alex-custom-tabs
          v-model="fourthExampleActivePage"
          :tabs="exampleTabs"
          color="black"
        ></alex-custom-tabs>
        <v-icon icon=" mdi-code-tags" color="gray-600" />
      </div>
      <v-window v-model="fourthExampleActivePage" class="w-100">
        <v-window-item value="1">
          <div class="bg-grey-lighten-5 pa-3" style="position: relative">
            <prism class="bg-grey-lighten-5">
              {{ fourthExampleTemplate }}
            </prism>
            <v-btn
              class="copy-icon"
              variant="text"
              color="gray-400"
              @click="copyToClipboard(fourthExampleTemplate, 'fourthTemplate')"
            >
              <v-icon
                v-if="copiedValue == 'fourthTemplate'"
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
              @click="copyToClipboard(firstExampleScript, 'fourthScript')"
            >
              <v-icon
                v-if="copiedValue == 'fourthScript'"
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
const customColor = ref('accent');
const copiedValue = ref('');
const firstExampleActivePage = ref('1');
const secondExampleActivePage = ref('1');
const thirdExampleActivePage = ref('1');
const fourthExampleActivePage = ref('1');
const usageActivePage = ref('1');
const usageVariantActivePage = ref('1');

const usageTabs = [
  {
    label: 'Home',
    value: '1',
  },
  {
    label: 'Profile',
    value: '2',
  },
  {
    label: 'Login',
    value: '3',
  },
];

const usageTabsNotifications = [
  {
    label: 'Home',
    value: '1',
  },
  {
    label: 'Profile',
    value: '2',
    notification: true,
  },
  {
    label: 'Login',
    value: '3',
  },
  {
    label: 'About',
    value: '4',
    notification: true,
  },
];

const resetNotifications = () => {
  usageTabsNotifications[1].notification = true;
  usageTabsNotifications[3].notification = true;
  usageVariantActivePage.value = '0';
};
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
const tabs = [
  { 
    label: 'Home',
    value: '1',
    notification: true, },
  { 
    label: 'Profile',
    value: '2', },
  { 
    label: 'Login',
    value: '3',
    notification: true, },
]`;
const firstExampleTemplate = ref(`
<alex-custom-tabs v-model="activePage" :tabs="tabs" ></alex-custom-tabs> 
<v-window v-model="activePage"> 
    <v-window-item value="1"> Primeira pagina </v-window-item> 
    <v-window-item value="2"> Segunda Pagina </v-window-item> 
    <v-window-item value="3"> Terceira Pagina </v-window-item> 
</v-window>
`);
const firstExampleScript = ref(`  
const activePage = ref('1'); 
const tabs = [ 
        { label: 'Home', value: '1', }, 
        { label: 'Profile', value: '2', }, 
        { label: 'Login', value: '3', }, 
        ];
       `);
const secondExampleTemplate = ref(
  `
    <alex-custom-tabs v-model="activePage" :tabs="tabs" color="${customColor.value}">
      <v-window v-model="activePage">
        <v-window-item value="1">Primeira pagina</v-window-item>
        <v-window-item value="2">Segunda Pagina</v-window-item>
        <v-window-item value="3">Terceira Pagina</v-window-item>
      </v-window>
    </alex-custom-tabs>
  `,
);
const thirdExampleTemplate = ref(`
<alex-custom-tabs v-model="activePage" :tabs="tabs" ></alex-custom-tabs> 
<v-window v-model="activePage"> 
    <v-window-item value="1"> Primeira pagina </v-window-item> 
    <v-window-item value="2"> Segunda Pagina </v-window-item> 
    <v-window-item value="3"> Terceira Pagina </v-window-item> 
    <v-window-item value="4"> Quarta Pagina </v-window-item>
</v-window>
`);

const thirdExampleScript = ref(`  
const activePage = ref('1'); 
const tabs = [ 
{
    label: 'Home',
    value: '1',
  },
  {
    label: 'Profile',
    value: '2',
    notification: true,
  },
  {
    label: 'Login',
    value: '3',
  },
  {
    label: 'About',
    value: '4',
    notification: true,
  },
        ];
       `);

const fourthExampleTemplate = ref(`
<alex-custom-tabs v-model="activePage" :tabs="tabs" vertical ></alex-custom-tabs> 
<v-window v-model="activePage"> 
    <v-window-item value="1"> Primeira pagina </v-window-item> 
    <v-window-item value="2"> Segunda Pagina </v-window-item> 
    <v-window-item value="3"> Terceira Pagina </v-window-item> 
</v-window>
`);
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
