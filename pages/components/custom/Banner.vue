<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column align-start pb-15"
  >
    <h1 class="text-h2 text-gray-800">Banner</h1>
    <p class="text-subtitle-2 text-gray-500">
      O
      <strong class="bg-accent pa-1 rounded">alex-custom-banner</strong>
      é projetado para exibir informações do usuário com recursos
      personalizáveis, como imagens de capa, imagens de perfil e detalhes
      adicionais do usuário. Inclui funcionalidades de upload, remoção de fotos
      de capa e exibição de menu com links personalizáveis.. Isso também pode
      ser usado como uma pseudo-navegação para uma página ou seção, já que ele
      faz o uso do
      <strong>alex-custom-tabs</strong>.
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
      Todas as propriedades são opcionais. Ele herda as propriedades de
      <strong>alex-custom-info</strong> e <strong>alex-custom-tabs</strong>,
      aqui ilustraremos apenas as propriedades únicas ao
      <strong>alex-custom-banner</strong> juntamente com os comportamentos mais
      comuns.
    </p>
    <div class="pa-4">
      <p class="text-subtitle-2 text-gray-500">
        Esse é o modelo mais simples, passado nenhuma propriedade ele meramente
        exibe uma imagem aleatória da internet.
      </p>
    </div>
    <div class="w-100" style="margin-top: -40px">
      <div
        class="d-flex align-center justify-space-between w-100 px-3 rounded-t"
      >
        <alex-custom-banner />
      </div>
      <div class="px-3" style="position: relative">
        <prism class=""> {{ examples[0] }}</prism>
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

    <h2 class="text-h3 text-gray-800">Alterando a imagem do Banner</h2>
    <p class="text-subtitle-2 text-gray-500">
      Por padrão, o componente usa uma imagem aleatória, mas você pode alterar
      essa image, passando uma prop <strong>coverPicture</strong> com a url
      desejada. Por padrão se espera que a imagem veja do strapi, mas você pode
      mudar esse comportamento passando a prop
      <strong>imgFromStrapi</strong> para falso
    </p>
    <div class="d-flex w-100 flex-column flex-sm-row">
      <div class="w-100 w-sm-25">
        <alex-custom-banner
          :cover-picture="{ id: 0, url: 'https://picsum.photos/2100/500' }"
          :img-from-strapi="false"
        />
      </div>
      <div class="mt-4 mb-8 w-100" style="position: relative">
        <prism class="h-100 overflow-auto"> {{ examples[1] }}</prism>
        <v-btn
          class="copy-icon mt-1 ml-4"
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
        Por padrão <strong>img-from-strapi</strong> é falso, entao basta passar
        <strong>cover-picture</strong> que ele pega do strapi
      </p>
      <alex-custom-banner
        :cover-picture="{ id: 0, url: 'https://picsum.photos/2300/500' }"
        :img-from-strapi="false"
      />

      <div
        class="d-flex align-center justify-space-between w-100 px-3 bg-gray-100 rounded-t"
      >
        <div class="mt-4 mb-8 w-100" style="position: relative">
          <prism class="overflow-auto"> {{ examples[2] }}</prism>
          <v-btn
            class="copy-icon mt-1 ml-4"
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
    <h2 class="text-h2 text-gray-800">Uso Completo</h2>
    <div class="px-4 py-2 w-100 d-flex">
      <div class="w-100">
        <p class="text-subtitle-2 text-gray-500 mb-14">
          O componente <strong>alex-custom-info</strong> altera bastante a
          maneira que o banner é exibido. Aqui é um exemplo com
          <strong>float-beneath</strong> definido como falso
        </p>
        <alex-custom-banner
          :coverPicture="{ url: 'https://picsum.photos/2000/600', id: 1 }"
          :imgFromStrapi="false"
          :showProfilePicture="true"
          :profilePicture="{ url: 'https://picsum.photos/600/500', id: 2 }"
          :profilePictureSize="50"
          :darkerBackground="false"
          :titleAbove="false"
          :distribution="'fullname-username-role'"
          :code="'ABC123'"
          :fullnameStyle="'font-weight-bold'"
          :codeStyle="'color: red;'"
          :roleStyle="'font-style: italic;'"
          :usernameStyle="'color: blue;'"
          :startDateStyle="'font-size: 12px;'"
          :endDateStyle="'font-size: 12px;'"
          :titleStyle="'font-size: 16px;'"
          :avatarStyle="'border: 1px solid #ccc;'"
          :showBorder="false"
          :floatBeneath="false"
          :settingsMenu="false"
          :dateToTheLeft="false"
          :showShade="false"
          :showRole="false"
          :updateProfilePicture="false"
          :title="'Software Engineer'"
          :showMenu="true"
          settings-icon="mdi-cog"
          :userId="123"
          :fullname="'John Doe'"
          :startDate="'2022-01-01'"
          :endDate="'2023-01-01'"
          :username="'johndoe'"
          :selectedOption="selectedOption1"
          :links="['Link 1', 'Link 2', 'Link 3']"
          :isProfessor="false"
          :canEdit="true"
          :canDelete="false"
          @select:option="() => {}"
          @display:settings="() => {}"
        />
        <div class="w-100" style="position: relative;">
          <prism class="bg-grey-lighten-5">
            {{ examples[3] }}
          </prism>
          <v-btn
            class="copy-icon mt-1 ml-4"
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
    <div class="px-4 py-2 w-100 d-flex">
      <div class="w-100">
        <p class="text-subtitle-2 text-gray-500 mb-14">
          O componente <strong>alex-custom-info</strong> altera bastante a
          maneira que o banner é exibido. Aqui é um exemplo com
          <strong>float-beneath</strong> definido como verdadeiro
        </p>
        <alex-custom-banner
          :coverPicture="{ url: 'https://picsum.photos/2000/600', id: 1 }"
          :imgFromStrapi="false"
          :showProfilePicture="true"
          :profilePicture="{ url: 'https://picsum.photos/600/500', id: 2 }"
          :profilePictureSize="500"
          :darkerBackground="false"
          :titleAbove="false"
          :distribution="'fullname-username-role'"
          :code="'ABC123'"
          :fullnameStyle="'font-weight-bold'"
          :codeStyle="'color: red;'"
          :roleStyle="'font-style: italic;'"
          :usernameStyle="'color: blue;'"
          :startDateStyle="'font-size: 12px;'"
          :endDateStyle="'font-size: 12px;'"
          :titleStyle="'font-size: 16px;'"
          :avatarStyle="'border: 1px solid #ccc;'"
          :showBorder="false"
          float-beneath
          :settingsMenu="false"
          :dateToTheLeft="false"
          :showShade="false"
          :updateProfilePicture="false"
          :title="'Software Engineer'"
          :showMenu="true"
          settings-icon="mdi-cog"
          :userId="123"
          :fullname="'John Doe'"
          :startDate="'2022-01-01'"
          :endDate="'2023-01-01'"
          :username="'johndoe'"
          :selectedOption="selectedOption2"
          show-role
          :links="['Link 1', 'Link 2', 'Link 3', 'Link 4']"
          :isProfessor="false"
          :canEdit="true"
          :canDelete="false"
          @select:option="() => {}"
          @display:settings="() => {}"
        />
        <div class="w-100" style="position: relative;">
          <prism class="bg-grey-lighten-5">
            {{ examples[4] }}
          </prism>
          <v-btn
            class="copy-icon mt-1 ml-4"
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
      <div
        class="pa-6 d-flex flex-column rounded-lg align-baseline"
        :style="
          propsDocumentation.length % 2 === 0
            ? 'background-color: #EBEDEF'
            : 'background-color: #D1F6FA'
        "
      >
        <p class="text-subtitle-2 text-gray-500">app-custom-info</p>

        <p class="text-body-1 text-gray-800 ml-2 font-weight-bold">
          Descrição:
          <span class="font-weight-regular"
            >todas as propriedades do <strong>app-custom-info</strong> são
            aplicáveis</span
          >
        </p>
      </div>
      <div
        class="pa-6 d-flex flex-column rounded-lg align-baseline"
        :style="
          propsDocumentation.length % 2 !== 0
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
      <div
        class="pa-6 d-flex flex-column rounded-lg align-baseline"
        :style="
          propsDocumentation.length % 2 === 0
            ? 'background-color: #EBEDEF'
            : 'background-color: #D1F6FA'
        "
      >
        <p class="text-subtitle-2 text-gray-500">app-custom-tabs</p>

        <p class="text-body-1 text-gray-800 ml-2 font-weight-bold">
          Descrição:
          <span class="font-weight-regular"
            >todas as propriedades do <strong>app-custom-tabs</strong> são
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
  middleware: 'auth',
});

const copiedValue = ref('');
const copiedIndex = ref(-1);

const selectedOption1 = ref(0)
const selectedOption2 = ref(0)

const examples = [
  '<alex-custom-banner />',
  `<alex-custom-banner
    :cover-picture="{ id: 0, url: 'https://picsum.photos/2200/500' }"
    :img-from-strapi="false"
  />`,
  `<alex-custom-banner
    :cover-picture="{ id: user.id, url: user.id }"
  />`,
  `<alex-custom-banner
      :coverPicture="{ url: 'https://picsum.photos/2000/600', id: 1 }"
      :imgFromStrapi="false"
      :showProfilePicture="true"
      :profilePicture="{ url: 'https://picsum.photos/600/500', id: 2 }"
      :profilePictureSize="50"
      :darkerBackground="false"
      :titleAbove="false"
      :distribution="'fullname-username-role'"
      :code="'ABC123'"
      settings-icon="mdi-cog"
      :fullnameStyle="'font-weight-bold'"
      :codeStyle="'color: red;'"
      :roleStyle="'font-style: italic;'"
      :usernameStyle="'color: blue;'"
      :startDateStyle="'font-size: 12px;'"
      :endDateStyle="'font-size: 12px;'"
      :titleStyle="'font-size: 16px;'"
      :avatarStyle="'border: 1px solid #ccc;'"
      :showBorder="false"
      :floatBeneath="false"
      :settingsMenu="false"
      :dateToTheLeft="false"
      :showShade="false"
      :showRole="false"
      :updateProfilePicture="false"
      :title="'Software Engineer'"
      :showMenu="true"
      :userId="123"
      :fullname="'John Doe'"
      :startDate="'2022-01-01'"
      :endDate="'2023-01-01'"
      :username="'johndoe'"
      :selectedOption="0"
      :links="['Link 1', 'Link 2', 'Link 3']"
      :isProfessor="false"
      :canEdit="true"
      :canDelete="false"
      @select:option="() => {}"
      @display:settings="() => {}"
    />`,

  `  <alex-custom-banner
        :coverPicture="{ url: 'https://picsum.photos/2000/600', id: 1 }"
        :imgFromStrapi="false"
        :showProfilePicture="true"
        :profilePicture="{ url: 'https://picsum.photos/600/500', id: 2 }"
        :profilePictureSize="500"
        :darkerBackground="false"
        :titleAbove="false"
        :distribution="'fullname-username-role'"
        :code="'ABC123'"
        :fullnameStyle="'font-weight-bold'"
        :codeStyle="'color: red;'"
        :roleStyle="'font-style: italic;'"
        :usernameStyle="'color: blue;'"
        :startDateStyle="'font-size: 12px;'"
        :endDateStyle="'font-size: 12px;'"
        :titleStyle="'font-size: 16px;'"
        :avatarStyle="'border: 1px solid #ccc;'"
        :showBorder="false"
          float-beneath
        :settingsMenu="false"
        :dateToTheLeft="false"
        :showShade="false"
        :updateProfilePicture="false"
        :title="'Software Engineer'"
        :showMenu="true"
        settings-icon="mdi-cog"
        :userId="123"
        :fullname="'John Doe'"
        :startDate="'2022-01-01'"
        :endDate="'2023-01-01'"
        :username="'johndoe'"
        :selectedOption="0"
        show-role
        :links="['Link 1', 'Link 2', 'Link 3', 'Link 4']"
        :isProfessor="false"
        :canEdit="true"
        :canDelete="false"
        @select:option="() => {}"
        @display:settings="() => {}"
      />`,
];

const propsDocumentation = [
  {
    name: 'coverPicture',
    type: 'Object | null',
    default: 'null',
    description: 'O objeto cover-picture com as propriedades url e id.',
  },
  {
    name: 'imgFromStrapi',
    type: 'Boolean',
    default: 'true',
    description: 'Um boolean que indica se coverPicture deve vir do Strapi.',
  },
  {
    name: 'showShade',
    type: 'Boolean',
    default: 'false',
    description:
      'Um boolean que indica se a um shading deve ser exibido na parte debaixo da imagem.',
  },
  {
    name: 'settingsMenu',
    type: 'Boolean',
    default: 'false',
    description:
      'Um boolean que indica se o botão de settings deve ser exibido no menu ou na imagem-capa.',
  },

  {
    name: 'showMenu',
    type: 'Boolean',
    default: 'false',
    description: 'Um boolean que indica se o menu deve ser exibido.',
  },

  {
    name: 'canEdit',
    type: 'Boolean',
    default: 'false',
    description:
      'Um boolean que indica se o usuário tem permissão de editar. Se igual a true é possível editar a capa, essa propriedade é repassada para alex-custom-input e app-user-avatar.',
  },

  {
    name: 'settingsIcon',
    type: 'String',
    default: 'mdi-cog-outline',
    description: 'O ícone que é exibido como o botão de settings.',
  },

  // Add other props here
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
