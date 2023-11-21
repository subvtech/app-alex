<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column align-start pb-15"
  >
    <h1 class="text-h2 text-gray-800">AppUserAvatar</h1>
    <p class="text-subtitle-2 text-gray-500">
      O
      <strong class="bg-accent pa-1 rounded">app-user-avatar</strong>
      é projetado para exibir a photo do usuário, e a possibilidade de alterar
      essa photo. Esse componente é utilizado em
      <strong>alex-custom-info</strong>.
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
          href="https://vuetifyjs.com/en/components/avatars/"
          target="_blank"
          >vuetifyjs.com</a
        >
      </div>
    </div>
    <h2 class="text-h2 text-gray-800">Uso Básico</h2>
    <p class="text-subtitle-2 text-gray-500">
      Todas as propriedades são opcionais com exceção do placeholder. aqui
      ilustraremos apenas os comportamentos mais comuns.
    </p>
    <div class="pa-4">
      <p class="text-subtitle-2 text-gray-500">
        Esse é o modelo mais simples, passado nenhuma propriedade a exceção do
        placeholder ele não exibe nada.
      </p>
    </div>
    <div class="w-100 d-flex">
      <div
        class="d-flex my-2 rounded-lg align-center justify-space-between bg-gray-100 w-100 px-3 rounded-t"
      >
        <app-user-avatar placeholder="" />
      </div>
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
      Vamos definir o tamanho, e permitir que se adicione/exclua a imagem.
      Perceba com nenhuma imagem é passada o placeholder é exibido
    </p>

    <div class="d-flex w-100">
      <div
        class="d-flex align-center rounded-lg my-2 justify-space-between bg-gray-100 w-100 px-3 rounded-t"
      >
        <app-user-avatar
          :size="45"
          placeholder="John Doe"
          can-delete
          can-edit
        />
      </div>
      <div class="px-3" style="position: relative">
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
    </div>

    <div class="w-100">
      <p class="text-subtitle-2 text-gray-500 mb-14">
        Uma variação importante é o <strong>showBorder</strong>
      </p>
      <div class="d-flex w-100">
        <div
          class="d-flex align-center rounded-lg my-2 justify-space-between bg-gray-100 w-100 px-3 rounded-t"
          style="position: relative"
        >
          <app-user-avatar
            :size="45"
            placeholder="John Doe"
            can-delete
            show-border
            can-edit
          />
        </div>
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
    </div>
    <div class="w-100">
      <p class="text-subtitle-2 text-gray-500 mb-14">
        É possível alterar a cor da borda com <strong>avatarStyle</strong>
      </p>
      <div class="d-flex w-100">
        <div
          class="d-flex align-center rounded-lg my-2 justify-space-between bg-gray-100 w-100 px-3 rounded-t"
          style="position: relative"
        >
          <app-user-avatar
            :size="45"
            placeholder="John Doe"
            show-border
            avatarStyle="border-color:red"
            can-delete
            can-edit
          />
        </div>
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
    </div>

    <div class="w-100">
      <p class="text-subtitle-2 text-gray-500 mb-14">
        É possível travar <strong>app-user-avatar</strong> na photo do usuário
        logado com <strong>trackCurrentUser</strong>
      </p>
      <div class="d-flex w-100">
        <div
          class="d-flex align-center rounded-lg my-2 justify-space-between bg-gray-100 w-100 px-3 rounded-t"
          style="position: relative"
        >
          <app-user-avatar
            :size="45"
            placeholder="John Doe"
            show-border
            track-current-user
            avatarStyle="border-color:blue"
            can-delete
            can-edit
          />
        </div>
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
    </div>

    <h2 class="text-h2 text-gray-800">Uso Completo</h2>
    <div class="px-4 py-2 w-100 d-flex">
      <div class="w-100 bg-gray-100">
        <app-user-avatar
          :size="45"
          placeholder="John Doe"
          show-border
          avatarStyle="border-color:green"
          can-delete
          can-edit
        />
        <div class="px-3" style="position: relative">
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

      <div
        class="pa-6 d-flex flex-column rounded-lg align-baseline"
        :style="
          propsDocumentation.length % 2 === 0
            ? 'background-color: #EBEDEF'
            : 'background-color: #D1F6FA'
        "
      >
        <p class="text-subtitle-2 text-gray-500">app-user-avatar</p>

        <p class="text-body-1 text-gray-800 ml-2 font-weight-bold">
          Descrição:
          <span class="font-weight-regular"
            >todas as propriedades do <strong>app-user-avatar</strong> são
            aplicáveis</span
          >
        </p>
      </div>
    </div>

    <h2 class="text-h3 text-gray-800">Eventos disponíveis</h2>
    <div class="d-flex flex-column" style="gap: 8px">
      <div
        class="pa-6 d-flex flex-column rounded-lg align-baseline"
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
        <p class="text-body-1 text-gray-800 ml-2 font-weight-bold">
          parameters:
          <span class="text-red-darken-2 font-weight-regular">{{
            item.parameters
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
  layout: 'components',
  middleware: 'auth',
});

const copiedValue = ref('');
const copiedIndex = ref(-1);
const examples = [
  `<app-user-avatar  placeholder/>`,
  `<app-user-avatar
    :placeholder="'John Doe'"
    can-delete
    can-edit/>`,
  `<app-user-avatar
          :size="45"
          placeholder="'John Doe'"
          show-border
          can-delete
          can-edit
        />
     `,
  `<app-user-avatar
          :size="45"
          placeholder="'John Doe'"
          show-border
          avatarStyle='border-color:red'
          can-delete
          can-edit
        />
     `,
  `<app-user-avatar
      :size="45"
      placeholder="John Doe"
      show-border
      track-current-user
      avatarStyle="border-color:blue"
      can-delete
      can-edit
    />`,
  `<app-user-avatar
      :size="45"
      placeholder="'John Doe'"
      show-border
      avatarStyle='border-color:green'
      can-delete
      can-edit
    />`,
];

const propsDocumentation = [
  {
    name: 'profilePicture',
    type: 'Object',
    default: 'null',
    description:
      'Objeto da foto do perfil do usuário { url: string, id: number } ou null.',
  },
  {
    name: 'userId',
    type: 'Number',
    default: 'undefined',
    description: 'ID do usuário.',
  },
  {
    name: 'placeholder',
    type: 'String',
    required: 'true',
    description: 'O nome do usuário é usado como placeholder.',
  },

  {
    name: 'avatarStyling',
    type: 'String',
    description:
      'Extra css para o avatar, é possível alterar a cor da borda por aqui.',
  },
  {
    name: 'showBorder',
    type: 'Boolean',
    default: 'false',
    description: 'Mostrar borda ao redor da foto do perfil.',
  },

  {
    name: 'trackCurrentUser',
    type: 'Boolean',
    default: 'false',
    description:
      'Ativa um watcher na photo do usuário logado, sempre que ela for atualizada esse componente também será atualizado.',
  },

  {
    name: 'size',
    type: 'Number',
    default: '30',
    description: 'Tamanho da foto do perfil.',
  },

  {
    name: 'canEdit',
    type: 'Boolean',
    default: 'false',
    description: 'Habilita hover, editar e remover imagem.',
  },
  {
    name: 'canDelete',
    type: 'Boolean',
    default: 'false',
    description:
      'Habilita e remover imagem, é necessário que canEdit seja true',
  },
];

const eventsDocumentation = [
  {
    name: 'select:option',
    parameters: 'index: Number',
    description:
      'Dispara quando uma opção do menu é selecionada. Ele passa o index da opção selecionada.',
  },
  {
    name: 'display:settings',
    parameters: 'None',
    description:
      'Dispara quando o botão de configurações é clidado. É usado para altenar a exibição das configurações.',
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
