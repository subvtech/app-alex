<template>
  <v-container
    class="page rounded-lg bg-white pa-8 d-flex flex-column align-start pb-15"
  >
    <h1 class="text-h2 text-gray-800">Dropdown</h1>
    <p class="text-subtitle-2 text-gray-500">
      O
      <strong class="bg-accent pa-1 rounded">alex-custom-dropdown</strong>
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
          href="https://vuetifyjs.com/en/components/menus/#usage"
          target="_blank"
          >vuetifyjs.com</a
        >
      </div>
    </div>
    <div class="d-flex w-100 justify-space-evenly flex-column flex-sm-row">
      <div class="w-100">
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
              <td>items</td>
              <td>AlexDropdownItem[]</td>
              <td class="text-center">
                <v-icon icon="mdi-checkbox-marked" color="success" />
              </td>
            </tr>
            <tr>
              <td>theme</td>
              <td>'light' | 'dark'</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>variant</td>
              <td>string</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>size</td>
              <td>string</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr></tbody
        ></v-table>
      </div>
      <div>
        <p class="text-h5 text-center">Exemplo</p>
        <Prism class="bg-white" language="javascript">
          {{ propsExampleScript }}
        </Prism>
      </div>
    </div>

    <div class="w-100">
      <alex-custom-dropdown :items="itemsComponentePropsExample" />
    </div>
    <div class="w-100">
      <div
        class="d-flex align-center justify-space-between w-100 px-3 bg-gray-100 rounded-t"
      >
        <alex-custom-tabs
          v-model="propsExampleActivePage"
          :tabs="exampleTabs"
          color="black"
        ></alex-custom-tabs>
        <v-icon icon=" mdi-code-tags" color="gray-600" />
      </div>
      <v-window v-model="propsExampleActivePage" class="w-100">
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

    <h2 class="text-h3 text-gray-800">Uso sem ícone</h2>
    <p class="text-subtitle-2 text-gray-500">
      É possível usar os menus sem ícones, basta apenas não passar a propriedade
      ícone na lista de items.
    </p>

    <div class="w-100">
      <alex-custom-dropdown :items="itemsComponenteNoIcon" />
    </div>
    <div class="w-100">
      <div
        class="d-flex align-center justify-space-between w-100 px-3 bg-gray-100 rounded-t"
      >
        <alex-custom-tabs
          v-model="noIconExampleActivePage"
          :tabs="exampleTabs"
          color="black"
        ></alex-custom-tabs>
        <v-icon icon=" mdi-code-tags" color="gray-600" />
      </div>
      <v-window v-model="noIconExampleActivePage" class="w-100">
        <v-window-item value="1">
          <div class="bg-grey-lighten-5 pa-3" style="position: relative">
            <prism class="bg-grey-lighten-5">
              {{ noIconExampleTemplate }}
            </prism>
            <v-btn
              class="copy-icon"
              variant="text"
              color="gray-400"
              @click="copyToClipboard(noIconExampleTemplate, 'firstTemplate')"
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
    ${noIconExampleScript}
    &lt;/script&gt;
                `
              }}
            </prism>
            <v-btn
              class="copy-icon"
              variant="text"
              color="gray-400"
              @click="copyToClipboard(noIconExampleScript, 'firstScript')"
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

    <h2 class="text-h3 text-gray-800">Customização do botão: Slot activator</h2>
    <p class="text-subtitle-2 text-gray-500">
      É possível alterar o componente de ativação do menu, através do slot
      activator, que poderá ser passado qualquer componente. Deverá ser passado
      a propriedade props vinda do slot para funcionar corretamente
    </p>
    <div class="w-100">
      <alex-custom-dropdown :items="itemsComponentePropsExample">
        <template #activator="{ props }">
          <alex-custom-button v-bind="props"> Abrir Menu </alex-custom-button>
        </template>
      </alex-custom-dropdown>
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
              {{ slotExampleTemplate }}
            </prism>
            <v-btn
              class="copy-icon"
              variant="text"
              color="gray-400"
              @click="copyToClipboard(slotExampleTemplate, 'secondTemplate')"
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
    ${propsExampleScript}
    &lt;/script&gt;
                `
              }}
            </prism>
            <v-btn
              class="copy-icon"
              variant="text"
              color="gray-400"
              @click="copyToClipboard(propsExampleScript, 'secondScript')"
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
    <h2 class="text-h3 text-gray-800">Props dos Itens</h2>
    <p class="text-subtitle-2 text-gray-500">
      O conteúdo de cada item é inserido através das props items:<br />
    </p>

    <div class="w-100">
      <h5 class="text-h5 text-center">Item</h5>
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
            <td>text</td>
            <td>string</td>
            <td class="text-center">
              <v-icon icon="mdi-close-box" color="error" />
            </td>
          </tr>
          <tr>
            <td>link</td>
            <td>string</td>
            <td class="text-center">
              <v-icon icon="mdi-close-box" color="error" />
            </td>
          </tr>
          <tr>
            <td>icon</td>
            <td>string</td>
            <td class="text-center">
              <v-icon icon="mdi-close-box" color="error" />
            </td>
          </tr>
          <tr>
            <td>warning</td>
            <td>boolean</td>
            <td class="text-center">
              <v-icon icon="mdi-close-box" color="error" />
            </td>
          </tr>
          <tr>
            <td>onClick</td>
            <td>() => unknown</td>
            <td class="text-center">
              <v-icon icon="mdi-close-box" color="error" />
            </td>
          </tr></tbody
      ></v-table>
    </div>
    <div class="d-flex w-100 gap-2 flex-column">
      <p class="text-subtitle-2 text-gray-500">
        Existe uma opção de estilo complementar:
        <strong>Warning</strong>.
      </p>
      <alex-custom-dropdown :items="itemsComponenteDarkWarning" />
      <p class="text-subtitle-2 text-gray-500">
        Além do DarkMode
        <strong>Dark</strong>.
      </p>
      <alex-custom-dropdown :items="itemsComponenteDarkWarning" theme="dark" />
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
    ${thirdExampleDarkWarning}
    &lt;/script&gt;
                `
              }}
            </prism>
            <v-btn
              class="copy-icon"
              variant="text"
              color="gray-400"
              @click="copyToClipboard(thirdExampleDarkWarning, 'thirdScript')"
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
import 'prismjs';
import 'prismjs/themes/prism.css';
import Prism from 'vue-prism-component';
import { AlexDropdownItem } from '@/components/alex/custom/Dropdown.vue';
definePageMeta({ layout: 'components' });

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const copiedValue = ref('');
const propsExampleActivePage = ref('1');
const noIconExampleActivePage = ref('1');
const secondExampleActivePage = ref('1');
const thirdExampleActivePage = ref('1');

const itemsComponentePropsExample = ref<AlexDropdownItem[]>([
  {
    link: '/',
    icon: 'mdi-home',
    text: 'Início',
  },
  {
    link: '/profile',
    icon: 'mdi-account-circle',
    text: 'Perfil',
  },
  {
    icon: 'mdi-account',
    link: '/users/settings',
    text: 'Configurações',
  },
]);
const itemsComponenteDarkWarning = ref<AlexDropdownItem[]>([
  {
    link: '/',
    icon: 'mdi-home',
    text: 'Início',
  },
  {
    link: '/profile',
    icon: 'mdi-account-circle',
    text: 'Perfil',
  },
  {
    icon: 'mdi-trash-can-outline',
    text: 'Excluir conta',
    warning: true,
  },
]);

const itemsComponenteNoIcon = ref<AlexDropdownItem[]>([
  {
    text: 'Verificar',
  },
  {
    text: 'Editar',
    link: '/profile',
  },
  {
    text: 'Excluir conta',
  },
]);

const propsExampleScript = `const itemsComponentePropsExample = ref<AlexDropdownItem[]>([
  {
    link: '/',
    icon: 'mdi-home',
    text: 'Início',
  },
  {
    link: '/profile',
    icon: 'mdi-account-circle',
    text: 'Perfil',
  },
  {
    icon: 'mdi-account',
    link: '/users/settings',
    text: 'Configurações',
  },
]);`;

const firstExampleTemplate = `
<alex-custom-dropdown :items="itemsComponente" />
`;

const firstExampleScript = `
    const itemsComponente = ref<AlexDropdownItem[]>([
      {
        
        link: '/',
        icon: 'mdi-home',
        text: 'Início',
      },
      {
        
        link: '/profile',
        icon: 'mdi-account-circle',
        text: 'Perfil',
      },
      {
        
        icon: 'mdi-account',
        link: '/users/settings',
        text: 'Configurações',
      },
    ]);

`;

const noIconExampleTemplate = `<alex-custom-dropdown :items="itemsComponenteNoIcon" />`;
const noIconExampleScript = `const itemsComponenteNoIcon = ref<AlexDropdownItem[]>([
  {
   
    text: 'Verificar',
  },
  {
   
    text: 'Editar',
    link: '/profile',
  },
  {
   
    text: 'Excluir conta',
    warning: true,
  },
]);`;

const slotExampleTemplate = `<alex-custom-dropdown :items="itemsComponenteExample2">
        <template #activator="{ props }">
          <alex-custom-button v-bind="props"> Abrir Menu </alex-custom-button>
        </template>
      </alex-custom-dropdown>`;

const thirdExampleTemplate = `<alex-custom-dropdown :items="itemsComponenteDarkWarning" />
      <alex-custom-dropdown :items="itemsComponenteDarkWarning" theme='dark' />`;

const thirdExampleDarkWarning = `const itemsComponenteDarkWarning = ref<AlexDropdownItem[]>([
  {
    
    link: '/',
    icon: 'mdi-home',
    text: 'Início',
  },
  {
    
    link: '/profile',
    icon: 'mdi-account-circle',
    text: 'Perfil',
  },
  {
    
    icon: 'mdi-trash-can-outline',
    text: 'Excluir conta',
    warning: true,
  },
]);`;

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
