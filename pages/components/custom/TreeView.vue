<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column align-start pb-15"
  >
    <h1 class="text-h2 text-gray-800">Treeview</h1>
    <p class="text-subtitle-2 text-gray-500">
      O
      <strong class="bg-accent pa-1 rounded">alex-custom-treeview</strong>
      é um componente para exibir uma árvore de itens, separados por nós e
      folhas.
    </p>
    <h2 class="text-h3 text-gray-800">Uso do Componente</h2>
    <p class="text-subtitle-2 text-gray-500">
      O componente recebe obrigatoriamente um <strong>array de objetos</strong>,
      enquanto naquele nível de objeto possuir qualquer array, ele sera
      considerado um nó, caso você tenha mais de um array naquele nivel, o
      componente irá considerar que aquele nível você deverá obrigatoriamente
      passar um array com o nome <strong>children</strong>, que sera utilizado
      como array de filhos desse nó, ao chegar em um nível onde não exista mais
      arrays, o componente irá considerar que aquele nível é uma folha.
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
              <th>Default</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Items</td>
              <td>Array</td>
              <td class="text-center">
                <v-icon icon="mdi-checkbox-marked" color="success" />
              </td>
              <td>none</td>
            </tr>
            <tr>
              <td>customSlot</td>
              <td>Boolean</td>
              <td class="text-center">
                <v-icon icon="mdi-checkbox-marked" color="error" />
              </td>
              <td>false</td>
            </tr>
            <tr>
              <td>closeIcon</td>
              <td>String</td>
              <td class="text-center">
                <v-icon icon="mdi-checkbox-marked" color="error" />
              </td>
              <td>mdi-chevron-down</td>
            </tr>
            <tr>
              <td>openIcon</td>
              <td>String</td>
              <td class="text-center">
                <v-icon icon="mdi-checkbox-marked" color="error" />
              </td>
              <td>mdi-chevron-right</td>
            </tr>
            <tr>
              <td>leafClasses</td>
              <td>String</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
              <td>none</td>
            </tr>
            <tr>
              <td>nodeClasses</td>
              <td>String</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
              <td>none</td>
            </tr>
            <tr>
              <td>defaultExpand</td>
              <td>Boolean</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
              <td>false</td>
            </tr>
            <tr>
              <td>transition</td>
              <td>String</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
              <td>
                <NuxtLink
                  class="link"
                  to="https://vuetifyjs.com/en/styles/transitions/#api"
                >
                  v-slide-x-transition
                </NuxtLink>
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
      <alex-custom-treeview :default-expand="true" :items="usageItems" />
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
      Customização: Alterando ícones, classes e transições
    </h2>
    <p class="text-subtitle-2 text-gray-500">
      Todo o componente é customizável, você pode alterar o ícone de um nó
      aberto ou de um nó fechado utilizando os icones
      <strong>openIcon</strong> e <strong>closeIcon</strong> passando uma string
      com os
      <NuxtLink class="link" to="https://pictogrammers.com/library/mdi/">
        icones do vuetify </NuxtLink
      >, as classes de um nó e de uma folha utilizando as props
      <strong>nodeClasses</strong> e <strong>leafClasses</strong>, e também a
      transição que ocorre ao abrir e fechar um nó utilizando a props
      <strong>transition</strong> utilizando as
      <NuxtLink
        class="link"
        to="https://vuetifyjs.com/en/styles/transitions/#api"
      >
        transições do vuetify
      </NuxtLink>
    </p>
    <alex-custom-treeview
      class="w-100"
      open-icon="mdi-plus"
      close-icon="mdi-close"
      leaf-classes="font-weight-bold bg-blue pa-2 rounded"
      node-classes="text-gray-500 font-weight-medium bg-info--2 pa-2 "
      transition="v-fab-transition"
      :items="itemsExemplo2"
    />
    <div class="d-flex w-100 flex-column flex-sm-row"></div>
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
    <h2 class="text-h3 text-gray-800">Slots: default</h2>
    <p class="text-subtitle-2 text-gray-500">
      Você pode alterar o conteúdo de um item (folha) utilizando o slot
      <strong>default</strong>
    </p>
    <div class="w-100 d-flex">
      <alex-custom-treeview
        class="w-100"
        custom-slot="true"
        :items="usageItems"
      >
        <template #default="{ item }">
          <div
            class="pa-2 rounded font-weight-bold"
            :class="`bg-${item.background} text-${item.color} `"
          >
            {{
              `Name: ${item.name} - Color: ${item.color} - Background: ${item.background}`
            }}
          </div>
        </template>
      </alex-custom-treeview>
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

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const copiedValue = ref('');
const firstExampleActivePage = ref('1');
const secondExampleActivePage = ref('1');
const thirdExampleActivePage = ref('1');

const usageItems = [
  {
    id: 1,
    name: 'Item 1',
    children: [
      {
        id: 2,
        name: 'Item 2',
        color: 'black',
        background: 'red',
      },
    ],
  },
  {
    id: 3,
    name: 'Item 3',
    color: 'green',
    background: 'purple',
  },
  {
    id: 4,
    name: 'Item 4',
    someArray: [
      {
        id: 5,
        name: 'Item 5',
        anotherArray: [
          {
            id: 6,
            name: 'Item 6',
            color: 'purple',
            background: 'yellow',
          },
        ],
      },
    ],
  },
  {
    id: 7,
    name: 'Item 7',
    arrayAleatorio: [
      {
        id: 8,
        name: 'Item 8',
        maisUmaArray: [
          {
            id: 9,
            name: 'Item 9',
            maisUmaArray: [
              {
                id: 10,
                name: 'Item 10',
              },
            ],
            children: [
              {
                id: 11,
                name: 'Item 11',
                color: 'white',
                background: 'blue',
              },
            ],
          },
        ],
      },
    ],
  },
];

const itemsExemplo2 = [
  {
    id: 1,
    name: 'Item 1',
  },
  {
    id: 2,
    name: 'Item 2',
    nossaQueArrayLegal: [
      {
        id: 3,
        name: 'Item 3',
        children: [
          {
            id: 4,
            name: 'Item 4',
          },
        ],
      },
    ],
  },
  {
    id: 7,
    name: 'Item 4',
    children: [
      {
        id: 4,
        name: 'Item 5',
      },
    ],
  },
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
const items = [
  {
    id: 3,
    name: 'Item 3',
  },
  {
    id: 7,
    name: 'Item 7',
    arrayAleatorio: [
      {
        id: 8,
        name: 'Item 8',
        maisUmaArray: [
          {
            id: 9,
            name: 'Item 9',
            maisUmaArray: [
              {
                id: 10,
                name: 'Item 10',
              },
            ],
            children: [
              {
                id: 11,
                name: 'Item 11',
              },
            ],
          },
        ],
      },
    ],
  },
];
`;
const firstExampleTemplate = ref(`
     <alex-custom-treeview :items="usageItems" :default-expand="true"  />
     
`);
const firstExampleScript = ref(`
const usageItems = [
  {
    id: 1,
    name: 'Item 1',
    children: [
      {
        id: 2,
        name: 'Item 2',
      },
    ],
  },
  {
    id: 3,
    name: 'Item 3',
  },
  {
    id: 4,
    name: 'Item 4',
    someArray: [
      {
        id: 5,
        name: 'Item 5',
        anotherArray: [
          {
            id: 6,
            name: 'Item 6',
          },
        ],
      },
    ],
  },
  {
    id: 7,
    name: 'Item 7',
    arrayAleatorio: [
      {
        id: 8,
        name: 'Item 8',
        maisUmaArray: [
          {
            id: 9,
            name: 'Item 9',
            maisUmaArray: [
              {
                id: 10,
                name: 'Item 10',
              },
            ],
            children: [
              {
                id: 11,
                name: 'Item 11',
              },
            ],
          },
        ],
      },
    ],
  },
];
       `);
const secondExampleTemplate = ref(
  `
    <alex-custom-treeview
      class="w-100"
      open-icon="mdi-plus"
      close-icon="mdi-close"
      leaf-classes="font-weight-bold bg-blue pa-2 rounded"
      node-classes="text-gray-500 font-weight-medium bg-info--2 pa-2 "
      transition="v-fab-transition"
      :items="items"
    />
  `,
);
const thirdExampleTemplate = ref(`
      <alex-custom-treeview
        class="w-100"
        custom-slot="true"
        :items="usageItems"
      >
        <template #default="{ item }">
          <div
            class="pa-2 rounded font-weight-bold"
            :class="bg-item{{ item.background }} text-item{{ item.color }}"
          >
             Name: {{ item.name }} - Color: {{ item.color }} - Background: {{ item.background }}
          </div>
        </template>
      </alex-custom-treeview>
    `);

const thirdExampleScript = ref(`
 const items = [
  {
    id: 1,
    name: 'Item 1',
    children: [
      {
        id: 2,
        name: 'Item 2',
        color: 'black',
        background: 'red',
      },
    ],
  },
  {
    id: 3,
    name: 'Item 3',
    color: 'green',
    background: 'purple',
  },
  {
    id: 4,
    name: 'Item 4',
    someArray: [
      {
        id: 5,
        name: 'Item 5',
        anotherArray: [
          {
            id: 6,
            name: 'Item 6',
            color: 'purple',
            background: 'yellow',
          },
        ],
      },
    ],
  },
  {
    id: 7,
    name: 'Item 7',
    arrayAleatorio: [
      {
        id: 8,
        name: 'Item 8',
        maisUmaArray: [
          {
            id: 9,
            name: 'Item 9',
            maisUmaArray: [
              {
                id: 10,
                name: 'Item 10',
              },
            ],
            children: [
              {
                id: 11,
                name: 'Item 11',
                color: 'white',
                background: 'blue',
              },
            ],
          },
        ],
      },
    ],
  },
];
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

.link {
  color: #99c3ff;
  cursor: pointer;

  &:visited {
    color: #c58af9;
  }
  &:hover {
    text-decoration: underline;
  }
}
</style>
