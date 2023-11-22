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
          href="https://vuetifyjs.com/en/components/navigation-drawers/#usage"
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
        Esse é o modelo mais simples, é necessário passar
        <strong>not-fixed</strong> para que ele se atenha ao parent e
        <strong>temporary</strong> para que ele não adicione um padding-left no
        componente principal e <strong>disappear</strong> para que ele suma
        quando não aberto. apenas o ícone principal funciona.
      </p>
    </div>
    <div
      class="w-100 d-flex flex-wrap"
      @click.stop="
        (e: any) => {
          drawer1 = !drawer1;
        }
      "
    >
      <alex-custom-drawable
        not-fixed
        disappear
        temporary
        :blocks="menuItems"
        :show="drawer1"
      />
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

    <div
      class="w-100 d-flex"
      @click.stop="
        (e: any) => {
          drawer2 = !drawer2;
        }
      "
      style="position: relative"
    >
      <alex-custom-drawable
        not-fixed
        disappear
        temporary
        :blocks="menuItems"
        :show="drawer2"
      />
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
      É sempre necessário usar um wrapper acima do componente para pegar cliques
      fora do menu.
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

    <div
      class="w-100"
      @click.stop="
        (e: any) => {
          drawer3 = !drawer3;
        }
      "
      style="position: relative"
    >
      <alex-custom-drawable
        :blocks="menuItems"
        :clipped="true"
        :show="drawer3"
        not-fixed
        temporary
        disappear
      >
        <template v-slot:header>
          <div
            class="my-4 w-100 d-flex"
            :class="true ? '' : 'justify-center'"
            style="max-height: 28px"
          >
            <div>
              <NuxtLink to="/">
                <img
                  v-if="true"
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
      A propriedade <strong>clipper</strong> controla se o menu é exibido em sua
      forma reduzida.
    </p>
    <div class="w-100">
      <div
        class="px-3"
        @click.stop="
          (e: any) => {
            drawer4 = !drawer4;
          }
        "
        style="position: relative"
      >
        <alex-custom-drawable
          :blocks="menuItems"
          :clipped="true"
          :show="drawer4"
          disappear
          temporary
          not-fixed
        />
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
        <div
          class="px-3"
          @click.stop="
            (e: any) => {
              drawer5 = !drawer5;
            }
          "
          style="position: relative"
        >
          <alex-custom-drawable
            :blocks="menuItems"
            :clipped="clipped"
            :show="drawer5"
            disappear
            not-fixed
            temporary
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
    <h2 class="text-h3 text-gray-800">Eventos disponíveis</h2>
    <div class="d-flex flex-column w-100" style="gap: 8px">
      <div
        class="pa-6 d-flex flex-column rounded-lg align-baseline w-100"
        v-for="(item, index) in eventsDocumentation"
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
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import 'prismjs';
import 'prismjs/themes/prism.css';
import Prism from 'vue-prism-component';

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const menuItems = [
  {
    title: 'something',
    items: [
      {
        icon: 'mdi-view-dashboard-outline',
        title: 'dashboard',
        to: '/dashboard',
      },
      {
        icon: 'mdi-book-cog-outline',
        title: 'classes',
        to: '/classes',
      },
      {
        icon: 'mdi-account-outline',
        title: 'users',
        to: '/users',
      },
    ],
  },
];

const drawer1 = ref(true);
const drawer2 = ref(true);
const drawer3 = ref(true);
const drawer4 = ref(true);
const drawer5 = ref(true);
const clipped = ref(true);
const isPermanent = ref(false);

const copiedValue = ref('');
const copiedIndex = ref(-1);
const examples = [
  `<alex-custom-drawable not-fixed temporary disappear :show="drawer" :blocks="menuItems" />`,
  `<alex-custom-drawable
        not-fixed
        disappear
        temporary
        :blocks="menuItems"
        :show="drawer1"
      />
    const menus = [
  {
    title: i18n.t('layouts.default.userArea'),
    items: [
      {
        icon: 'mdi-view-dashboard-outline',
        title: 'dashboard',
        to: '/dashboard',
      },
      {
        icon: 'mdi-book-cog-outline',
        title: 'classes',
        to: '/classes',
      },
      {
        icon: 'mdi-clipboard-multiple-outline',
        title:'links',
        to: '/classes/active-links',
      },
      {
        icon: 'mdi-heart-outline',
        title: 'favourites',
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
        temporary
      >
       ...
      </alex-custom-drawable>
    </div>
     `,
  `   <alex-custom-drawable
      :blocks="menus"
      :clipped="clipped"
      :show="drawer"
      temporary
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
   `,
  `<alex-custom-drawable
      :blocks="menuItems"
      :clipped="true"
      :show="drawer4"
      disappear
      temporary
      not-fixed
    />`,
  `<alex-custom-drawable
      :blocks="menus"
      :clipped="clipped"
      :show="drawer"
      disappear
      not-fixed
      temporary
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
  {
    name: 'notFixed',
    type: 'Boolean',
    default: 'false',
    description:
      'Define se o menu é exibido fixo na tela ou atrelado ao parent.',
  },
  {
    name: 'disappear',
    type: 'Boolean',
    default: 'false',
    description: 'Define se o menu some enquanto fechado.',
  },
];

const eventsDocumentation = [
  {
    name: 'update:model-value',
    description: 'Ativa quando o model de controle é atualizado',
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
