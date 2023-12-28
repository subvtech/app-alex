<template>
  <v-container
    class="page rounded-lg bg-white pa-8 d-flex flex-column align-start pb-15"
  >
    <h1 class="text-h2 text-gray-800">List Item User</h1>
    <p class="text-subtitle-2 text-gray-500">
      O
      <strong class="bg-accent pa-1 rounded">alex-custom-list-item</strong>
      É utilizado como item no
      <strong class="bg-accent pa-1 rounded">alex-custom-dropdown</strong> e no
      <strong class="bg-accent pa-1 rounded">alex-inputs-select</strong>.
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
              <td>user</td>
              <td>{ email: string; name?: string; image?: string; }</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>noSelect</td>
              <td>boolean</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>status</td>
              <td>'readyToSend' | 'pending' | 'participating'</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr></tbody
        ></v-table>
      </div>
    </div>

    <div class="w-100 d-flex flex-column gap-4">
      <p class="text-h5 text-center">Items fora do select</p>
      <alex-custom-list-item-user
        no-select
        status="readyToSend"
        :user="{ email: 'zignago@gmail.com', name: 'João Victor Zignago' }"
      />
      <alex-custom-list-item-user
        no-select
        status="participating"
        :user="{ email: 'zignago@gmail.com', name: 'João Victor Zignago' }"
      />

      <alex-custom-list-item-user
        :user="{ email: 'zignago@gmail.com', name: 'João Victor Zignago' }"
        status="pending"
        no-select
      />
      <alex-custom-list-item-user
        :user="{ email: 'zignago@gmail.com' }"
        status="pending"
        no-select
      />
      <alex-custom-list-item-user
        :user="{ email: 'zignago@gmail.com' }"
        no-select
      />

      <p class="text-h5 text-center">Items dentro do select</p>
      <alex-inputs-autocomplete
        v-model="peapleSelected"
        :items="pearson"
        :item-title="getItemTitle"
        name="aaa"
        class="w-100"
        label="Quem participará?"
        placeholder="Buscar Integrante"
        return-object
      >
        <template #item="{ props, item, index }">
          <alex-custom-list-item-user
            v-bind="props"
            :key="index"
            :user="{
              email: item.raw.email,
              name: item.raw.name,
              image: item.raw.image,
            }"
            :status="item.raw.status"
            no-delete
          />
        </template>
      </alex-inputs-autocomplete>
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
        <v-icon icon="mdi-code-tags" color="gray-600" />
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
      </v-window>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import 'prismjs';
import 'prismjs/themes/prism.css';
import Prism from 'vue-prism-component';
definePageMeta({ layout: 'components' });

const copiedValue = ref('');
const pearson = ref([
  {
    email: 'zignago@gmail.com',
    name: 'João Victor Zignago',
    image:
      'https://www.ohchr.org/sites/default/files/styles/hero_5_image_desktop/public/2022-11/women-rights-main-image.jpg?itok=RRGl2PFb',
    status: 'participating',
  },
  {
    email: 'roselino@gmail.com',
    name: 'roselino asd',
    image:
      'https://www.ohchr.org/sites/default/files/styles/hero_5_image_desktop/public/2022-11/women-rights-main-image.jpg?itok=RRGl2PFb',
  },
  {
    email: 'edvaldo@gmail.com',
    name: 'edvaldo asd',
    image:
      'https://www.ohchr.org/sites/default/files/styles/hero_5_image_desktop/public/2022-11/women-rights-main-image.jpg?itok=RRGl2PFb',
  },
]);
const propsExampleActivePage = ref('1');
const peapleSelected = ref<{ email: string; name: string }[]>([]);
const firstExampleTemplate = `
<alex-custom-list-item-user
        no-select
        status="readyToSend"
        :user="{ email: 'zignago@gmail.com', name: 'João Victor Zignago' }"
      />
      <alex-custom-list-item-user
        no-select
        status="participating"
        :user="{ email: 'zignago@gmail.com', name: 'João Victor Zignago' }"
      />

      <alex-custom-list-item-user
        :user="{ email: 'zignago@gmail.com', name: 'João Victor Zignago' }"
        status="pending"
        no-select
      />
      <alex-custom-list-item-user
        :user="{ email: 'zignago@gmail.com' }"
        status="pending"
        no-select
      />
      <alex-custom-list-item-user
        :user="{ email: 'zignago@gmail.com' }"
        no-select
      />
  `;

const exampleTabs = [
  {
    label: 'Template',
    value: '1',
  },
];

const getItemTitle = (item: { name: string; email: string }) => {
  return `${item.name} - ${item.email}`;
};

const copyToClipboard = async (message: string, item: string) => {
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
