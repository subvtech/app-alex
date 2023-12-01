<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column align-start"
  >
    <h1 class="text-h2 text-gray-800">HorizontalBar</h1>
    <p class="text-subtitle-2 text-gray-500">
      O
      <strong class="bg-accent pa-1 rounded">alex-custom-horizontalBar</strong>
      para facilitar o acesso a páginas importantes e abrir/fechar o menu
      lateral.
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
          href="https://vuetifyjs.com/en/api/v-app-bar/#links"
          target="_blank"
          >vuetifyjs.com</a
        >
      </div>
    </div>
    <h2 class="text-h2 text-gray-800">Uso Básico</h2>
    <p class="text-subtitle-2 text-gray-500">
      Todas as propriedades são opcionais. Ela herda todas as propriedades de
      <strong>v-app-bar</strong> e <strong>app-user-avatar</strong>
    </p>
    <div class="pa-4">
      <p class="text-subtitle-2 text-gray-500">
        Esse é o modelo mais simples, passado nenhuma propriedade, é necessário
        passar a prop <strong>not-fixed</strong>ele exibe o esqueleto com dois
        botões, e nenhum deles funcionam
      </p>
    </div>
    <div class="first w-100 d-flex flex-row">
      <v-container class="p-0 m-0">
        <v-row align="center"><alex-custom-horizontal-bar not-fixed /></v-row
      ></v-container>
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
      Menu items são exibido dentro do dropdown menu
    </p>

    <div class="w-100">
      <v-container>
        <v-row align="center"
          ><alex-custom-horizontal-bar
            :toggle-drawer="() => {}"
            :menu-items="[
              {
                title: 'profile',
                to: '/',
              },
              {
                title: 'settings',
                to: '/user/settings',
              },
              {
                title: 'logout',
                action: () => {
                  console.log('logout');
                },
              },
            ]"
            not-fixed
            :avatar="user.avatar"
            :placeholder="user.fullname"
          /> </v-row
      ></v-container>
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
      Para exibir o ícone de avatar é necessário usar
      <strong>show-picture</strong>.
    </p>

    <div class="w-100">
      <div class="px-3" style="position: relative">
        <v-container>
          <v-row align="center"
            ><alex-custom-horizontalBar
              :toggle-drawer="
                () => {
                  drawer = !drawer;
                }
              "
              :menu-items="menuItems"
              show-picture
              not-fixed
              :placeholder="user.fullname"
              :avatar="user.avatar"
            /> </v-row
        ></v-container>
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
      É possível inverter a disposição do menu com <strong>reverse</strong>.
    </p>

    <div class="w-100">
      <div class="px-3" style="position: relative">
        <v-container>
          <v-row align="center"
            ><alex-custom-horizontalBar
              :toggle-drawer="
                () => {
                  drawer = !drawer;
                }
              "
              :menu-items="menuItems"
              reverse
              show-picture
              not-fixed
              :placeholder="user.fullname"
              :avatar="user.avatar"
            /> </v-row
        ></v-container>
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

    <p class="text-subtitle-2 text-gray-500">
      É possível inverter ativar os icons de chat e o do bell com
      <strong>isChatActive</strong> e <strong>isBellActive</strong>
    </p>

    <div class="w-100">
      <div class="px-3">
        <v-container>
          <v-row align="center"
            ><alex-custom-horizontal-bar
              :toggle-drawer="() => (drawer = !drawer)"
              is-chat-active
              is-bell-active
              not-fixed
              :menu-items="menuItems"
            /> </v-row
        ></v-container>
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
        <div class="px-3">
          <v-container>
            <v-row align="center"
              ><alex-custom-horizontal-bar
                :toggle-drawer="() => (drawer = !drawer)"
                reverse
                not-fixed
                show-picture :placeholder="user.fullname"
              :avatar="user.avatar"
                :is-chat-active="isChatActive"
                :is-bell-active="isBellActive"
                @alert="isBellActive = !isBellActive"
                @chat="isChatActive = !isChatActive"
                :menu-items="[
                  { title: 'title1', to: '/' },
                  { title: 'title2', to: '/' },
                  { title: 'title3', to: '/' },
                ]"
              /> </v-row
          ></v-container>
          <prism>{{ examples[5] }}</prism>
          <v-btn
            class="copy-icon"
            variant="text"
            color="gray-400"
            @click="copyToClipboard(5)"
          >
            <v-icon
              v-if="copiedIndex === 5"
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

const user: User = {
  fullname: 'John Doe',
  avatar: {
    url: 'https://picsum.photos/1000/600',
    id: 2,
  },
};
const copiedValue = ref('');
const copiedIndex = ref(-1);
const drawer = ref(false);
const isChatActive = ref(false);
const isBellActive = ref(false);

const menuItems: { title: string; to?: string; action?: () => void }[] = [
  {
    title: 'profile',
    to: '/',
  },
  {
    title: 'settings',
    to: '/user/settings',
  },
  {
    title: 'logout',
    action: () => {
      console.log('logout');
    },
  },
];
const examples = [
  `<alex-custom-horizontal-bar not-fixed/>`,
  `<alex-custom-horizontal-bar
      :toggle-drawer="() => {}"
      :menu-items="[
        {
          title: 'profile',
          to: '/',
          
        },
        {
          title: 'settings',
          to: '/user/settings',
          
        },
        { title: 'logout', action: () => {console.log('logout')} },
      ]"
      not-fixed
      :placeholder="user.fullname"
      :avatar="user.avatar"
    />`,
  `<alex-custom-horizontalBar
      :toggle-drawer="() => (drawer = !drawer)"
      :menu-items="profileMenuItems"
      show-picture
      not-fixed 
      :placeholder="user.fullname"
      :avatar="user.avatar"
    />
     `,
  `<alex-custom-horizontalBar
      :toggle-drawer="() => (drawer = !drawer)"
      :menu-items="profileMenuItems"
      reverse
      show-picture
      not-fixed
      :placeholder="user.fullname"
      :avatar="user.avatar"
    />
     `,
  `<alex-custom-horizontalBar
      :toggle-drawer="() => (drawer = !drawer)"
      is-chat-active
      is-bell-active
      not-fixed
      :menu-items="[
        { title: 'title1', to: '/' },
        { title: 'title2', to: '/' },
        { title: 'title3', to: '/' },
      ]"
    /> `,
  `<alex-custom-horizontalBar
      :toggle-drawer="() => (drawer = !drawer)"
      reverse
      not-fixed
      show-picture
      :avatar="user.avatar"
      :placeholder="user.fullname"
      :is-chat-active="isChatActive"
      :is-bell-active="isBellActive"
      @alert="isBellActive = !isBellActive"
      @chat="isChatActive = !isChatActive"
      :menu-items="[
        { title: 'title1', to: '/' },
        { title: 'title2', to: '/' },
        { title: 'title3', to: '/' },
      ]"
    />`,
];

const propsDocumentation = [
  {
    name: 'menu-items',
    type: '{ title: string; to?: string; action?: () => {} }[]',
    default: '[]',
    description: 'O array de items a ser exibido no dropdown-menu.',
  },
  {
    name: 'avatar',
    type: '{ id: number, url: string }',
    default: 'undefined',
    description:
      'As informações do avatar a serem exibidas, contém uma url e um id. Funciona apenas com imagens hosteadas no strapi',
  },
  {
    name: 'placeholder',
    type: 'String',
    default: 'undefined',
    description:
      'Placeholder que é exibido, ele assume o papel do fullname do usuário.',
  },
  {
    name: 'isBellActive',
    type: '() => void',
    default: '() => {}',
    description: 'Define função do botão de menu.',
  },

  {
    name: 'isBellActive',
    type: 'Boolean',
    default: 'false',
    description: 'Define se o icon bell-active é exibido',
  },

  {
    name: 'isChatActive',
    type: 'Boolean',
    default: 'false',
    description: 'Define se o icon chat-active é exibido',
  },

  {
    name: 'notFixed',
    type: 'Boolean',
    default: 'false',
    description:
      'Define se o icon horizontal-bar é exibido fixo no topo da tela ou se é restrito ao parent',
  },

  {
    name: 'showPicture',
    type: 'Boolean',
    default: 'false',
    description:
      'Define se a photo de profile é exibido ou não, independente se o avatar é passado.',
  },
  {
    name: 'reverse',
    type: 'Boolean',
    default: 'false',
    description: 'Ativa flex-reverse, invertendo os items do menu',
  },
];

const eventsDocumentation = [
  {
    name: 'alert',
    description: 'Ativa no click do bell-icon',
  },
  {
    name: 'chat',
    description: 'Ativa no click do chat-icon.',
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

@media (max-width: 800px) {
  .first {
    flex-wrap: wrap;
  }
}
</style>
