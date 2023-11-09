<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column align-start pb-15"
  >
    <h1 class="text-h2 text-gray-800">Drawable</h1>
    <p class="text-subtitle-2 text-gray-500">
      O
      <strong class="bg-accent pa-1 rounded">alex-custom-drawable</strong>
      para facilitar o acesso a páginas importantes na lateral da tela.
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
    <h2 class="text-h2 text-gray-800">Uso Básico</h2>
    <p class="text-subtitle-2 text-gray-500">
      Todas as propriedades são opcionais. Ela herda todas as propriedades de
      <strong>v-navigation-drawer</strong>
    </p>
    <div class="pa-4">
      <p class="text-subtitle-2 text-gray-500">
        Esse é o modelo mais simples, passado nenhuma propriedade ele exibe o
        menu sem nenhum botão, apenas o ícone principal funciona.
      </p>
    </div>
    <div class="w-100 d-flex">
      <div class="px-3 w-100" style="position: relative">
        <prism> {{ examples[0] }}</prism>
        <v-btn
          class="copy-icon"
          variant="text"
          color="gray-400"
          @click="copyToClipboard(0)"
        >
          <v-icon
            v-if="copiedIndex === 0"
            size="x-large"
            icon="mdi-clipboard-check-multiple-outline"
            color="green-lighten-1"
          />
          <v-icon v-else size="x-large" icon="mdi-content-copy" />
        </v-btn>
      </div>
    </div>

    <h2 class="text-h3 text-gray-800">Adicionando propriedades básicas</h2>

    <p class="text-subtitle-2 text-gray-500">
      Cada item do menu requer um icon, um título e um caminho.
    </p>

    <div class="w-100">
      <prism>{{ examples[1] }}</prism>
      <v-btn
        class="copy-icon"
        variant="text"
        color="gray-400"
        @click="copyToClipboard(1)"
      >
        <v-icon
          v-if="copiedIndex === 1"
          size="x-large"
          icon="mdi-clipboard-check-multiple-outline"
          color="green-lighten-1"
        />
        <v-icon v-else size="x-large" icon="mdi-content-copy" />
      </v-btn>
    </div>

    <p class="text-subtitle-2 text-gray-500">
      É necessária usar um wrapper acima do componente para pegar cliques fora
      do menu.
    </p>

    <div class="w-100">
      <div class="px-3" style="position: relative">
        <prism>{{ examples[2] }}</prism>
        <v-btn
          class="copy-icon"
          variant="text"
          color="gray-400"
          @click="copyToClipboard(2)"
        >
          <v-icon
            v-if="copiedIndex === 2"
            size="x-large"
            icon="mdi-clipboard-check-multiple-outline"
            color="green-lighten-1"
          />
          <v-icon v-else size="x-large" icon="mdi-content-copy" />
        </v-btn>
      </div>
    </div>

    <p class="text-subtitle-2 text-gray-500">
      Existe o slot <strong>header</strong> que é posicionado acima dos items.
    </p>

    <div class="w-100">
      <div class="px-3" style="position: relative">
        <prism>{{ examples[3] }}</prism>
        <v-btn
          class="copy-icon"
          variant="text"
          color="gray-400"
          @click="copyToClipboard(3)"
        >
          <v-icon
            v-if="copiedIndex === 3"
            size="x-large"
            icon="mdi-clipboard-check-multiple-outline"
            color="green-lighten-1"
          />
          <v-icon v-else size="x-large" icon="mdi-content-copy" />
        </v-btn>
      </div>
    </div>
    <h2 class="text-h3 text-gray-800">Variação</h2>

    <p class="text-subtitle-2 text-gray-500">
      A propriedade clip controla se o menu é exibido em sua forma reduzida.
    </p>
    <div class="w-100">
      <div class="px-3" style="position: relative">
        <prism>{{ examples[4] }}</prism>
        <v-btn
          class="copy-icon"
          variant="text"
          color="gray-400"
          @click="copyToClipboard(4)"
        >
          <v-icon
            v-if="copiedIndex === 4"
            size="x-large"
            icon="mdi-clipboard-check-multiple-outline"
            color="green-lighten-1"
          />
          <v-icon v-else size="x-large" icon="mdi-content-copy" />
        </v-btn>
      </div>
    </div>
    <h2 class="text-h2 text-gray-800">Uso Completo</h2>
    <div class="px-4 py-2 w-100 d-flex">
      <div class="w-100 bg-gray-100">
        <div class="px-3" style="position: relative">
          <prism>{{ examples[5] }}</prism>
          <v-btn
            class="copy-icon"
            variant="text"
            color="gray-400"
            @click="copyToClipboard(4)"
          >
            <v-icon
              v-if="copiedIndex === 4"
              size="x-large"
              icon="mdi-clipboard-check-multiple-outline"
              color="green-lighten-1"
            />
            <v-icon v-else size="x-large" icon="mdi-content-copy" />
          </v-btn>
        </div>
      </div>
    </div>
    <h2 class="text-h3 text-gray-800">Propriedades disponíveis</h2>
    <div class="d-flex flex-column" style="gap: 8px">
      <div
        class="pa-6 d-flex flex-column rounded-lg align-baseline"
        v-for="(item, index) in propsDocumentation"
        :style="
          index % 2 === 0
            ? 'background-color: #EBEDEF'
            : 'background-color: #D1F6FA'
        "
      >
        <p class="text-subtitle-2 text-gray-500">{{ item.name }}</p>

        <p class="text-body-1 text-gray-800 ml-2 font-weight-bold">
          Descrição:
          <span class="font-weight-regular">{{ item.description }}</span>
        </p>
        <p class="text-body-1 text-gray-800 ml-2 font-weight-bold">
          Type:
          <span class="text-red-darken-2 font-weight-regular">{{
            item.type
          }}</span>
        </p>
        <p class="text-body-1 text-gray-800 ml-2 font-weight-bold">
          Default:
          <span class="text-purple-darken-2 font-weight-regular">{{
            item.default
          }}</span>
        </p>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import 'prismjs';
import 'prismjs/themes/prism.css';
import Prism from 'vue-prism-component';

definePageMeta({
  middleware: 'auth',
});

const copiedValue = ref('');
const copiedIndex = ref(-1);
const examples = [
  `<alex-custom-drawable />`,
  ` <alex-custom-drawable
        :blocks="menus"
        :clipped="clipped"
        :show="drawer"
        :permanent="isPermanent"
    />
    const menus = [
  {
    title: i18n.t('layouts.default.userArea'),
    items: [
      {
        icon: 'mdi-view-dashboard-outline',
        title: i18n.t('layouts.default.dashboard'),
        to: '/dashboard',
      },
      {
        icon: 'mdi-book-cog-outline',
        title: i18n.t('layouts.default.myClasses'),
        to: '/classes',
      },
      {
        icon: 'mdi-clipboard-multiple-outline',
        title: i18n.t('layouts.default.myProjects'),
        to: '/classes/active-links',
      },
      {
        icon: 'mdi-heart-outline',
        title: i18n.t('layouts.default.favourites'),
        to: '/classes/active-links',
      },
    ],
  },
];`,
  ` <div
      @click.stop="
        (e: any) => {
          drawer = !drawer;
        }
      "
    >
      <alex-custom-drawable
        :blocks="menus"
        :clipped="clipped"
        :show="drawer"
        :permanent="isPermanent"
      >
       ...
      </alex-custom-drawable>
    </div>
     `,
  `   <div
      @click.stop="
        (e: any) => {
          drawer = !drawer;
        }
      "
    >
      <alex-custom-drawable
        :blocks="menus"
        :clipped="clipped"
        :show="drawer"
        :permanent="isPermanent"
      >
        <template v-slot:header>
          <div
            class="my-4 w-100 d-flex"
            :class="clipped ? '' : 'justify-center'"
            style="max-height: 28px"
          >
            <div>
              <NuxtLink to="/">
                <img
                  v-if="clipped"
                  src="/images/alex-mini.svg"
                  height="28"
                  width="43"
                />
                <img v-else src="/images/alex.svg" height="28" width="84" />
              </NuxtLink>
            </div>
          </div>
        </template>
      </alex-custom-drawable>
    </div>`,
  ` <alex-custom-drawable
        :blocks="menus"
        :clipped="true"
        :show="drawer"
        :permanent="isPermanent"
    />`,
  ` <alex-custom-drawable
        :blocks="menus"
        :clipped="clipped"
        :show="drawer"
        :permanent="isPermanent"
      >
        <template v-slot:header>
          <div
            class="my-4 w-100 d-flex"
            :class="clipped ? '' : 'justify-center'"
            style="max-height: 28px"
          >
            <div>
              <NuxtLink to="/">
                <img
                  v-if="clipped"
                  src="/images/alex-mini.svg"
                  height="28"
                  width="43"
                />
                <img v-else src="/images/alex.svg" height="28" width="84" />
              </NuxtLink>
            </div>
          </div>
        </template>
      </alex-custom-drawable>`,
];

const propsDocumentation = [
  {
    name: 'blocks',
    type: '{ title: string; items: { icon: string; title: string; to: string }[]}[]',
    default: '[]',
    description: 'O array de items a ser exibido no dropdown-menu.',
  },

  {
    name: 'show',
    type: 'Boolean',
    default: 'false',
    description: 'Define se o menu é exibido',
  },

  {
    name: 'clipped',
    type: 'Boolean',
    default: 'false',
    description:
      'Define se o menu é exibido em sua forma reduzida. Equivalente a usar rail=true',
  },
];

const copyToClipboard = async (index) => {
  try {
    await navigator.clipboard.writeText(examples[index]);
    copiedValue.value = examples[index];
  } catch (err) {
    copiedValue.value = examples[index];
  }
  copiedIndex.value = index;
};
</script>

<style>
.language-markup {
  overflow-x: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none;
  }
  border-radius: 8px;
}
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
  right: 10px;
  top: 10px;
  color: #a0a8b1;
}
</style>
