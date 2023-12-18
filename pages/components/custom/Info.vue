<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column align-start pb-15"
  >
    <h1 class="text-h2 text-gray-800">Info</h1>
    <p class="text-subtitle-2 text-gray-500">
      O
      <strong class="bg-accent pa-1 rounded">alex-custom-info</strong>
      é projetado para exibir informações do usuário com recursos
      personalizáveis, imagens de perfil e detalhes adicionais do usuário. Ele é
      feito pra ser exibido sobre ou abaixo uma imagem. Esse componente é
      utilizado em <strong>alex-custom-banner</strong> e ele faz o uso do
      <strong>app-user-avatar</strong>.
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
      <strong>app-user-avatar</strong>
      aqui ilustraremos apenas as propriedades únicas ao
      <strong>alex-custom-info</strong> juntamente com os comportamentos mais
      comuns.
    </p>
    <p class="mt-2 text-subtitle-2 text-gray-500">
      Nos próximos exemplos vamos utilizar
      <strong>alex-custom-banner</strong> para ilustrar, dado que
      <strong>alex-custom-banner</strong> é apenas uma extensão do
      <strong>alex-custom-info</strong>
    </p>
    <h2 class="text-h3 text-gray-800">Adicionando propriedades básicas</h2>

    <div v-if="user" v-for="(item, index) in documentation" class="d-flex flex-column w-100">
      <h2 v-if="item.title" class="text-h2 text-gray-800">{{ item.title }}</h2>

      <div class="d-flex flex-column w-100 overflow-hidden">
        <p class="text-subtitle-2 text-gray-500" v-html="item.text" />
        <div
          class="d-flex align-center rounded-lg my-2 justify-center bg-gray-100 w-100 px-3 rounded-t"
        >
          <alex-custom-banner
            key="index"
            v-bind="item.props as any"
            @display:settings="
              item.props.displaySettings
                ? item.props.displaySettings()
                : () => {}
            "
          />
        </div>
        <div class="px-3" style="position: relative">
          <prism>{{ examples[index] }}</prism>
          <v-btn
            class="copy-icon"
            variant="text"
            color="gray-400"
            @click="copyToClipboard(index)"
          >
            <v-icon
              v-if="copiedIndex === index"
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
        <p
          v-if="item.default"
          class="text-body-1 text-gray-800 ml-2 font-weight-bold"
        >
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

const { findOne } = useStrapi();

const i18n = useI18n();

const { setMessage } = useMessageStore();

const { id } = useStrapiUser<User>().value;

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const user = ref<any>(null);

const profilePicture = { url: 'https://picsum.photos/1200/600', id: 1 };
const coverPicture = { url: 'https://picsum.photos/2000/600', id: 1 };

const copiedValue = ref('');
const copiedIndex = ref(-1);

const updateUser = async (show = true) => {
  const populate = [
    'cover',
    'avatar',
    'learningPlans',
    'socials',
    'trails',
    'role',
    'user_descriptions',
    'user_wallet',
  ];

  user.value = await findOne<User>('users', id, {
    populate: populate,
  });
  console.log({ user: user.value });
  if (!user.value.avatar) user.value.avatar = profilePicture;
  if (!user.value.cover) {
    user.value.cover = coverPicture;
  }
  setMessage('done', 'green', show);
};

await updateUser(false);

const documentation = ref([
  {
    text: 'Esse é o modelo mais simples, passado nenhuma propriedade ele não exibe nada.',
    props: {
      displaySettings: () => {},
    },
  },
  {
    text: 'Vamos adicionar título, username e role. Perceba que é necessário apenas passar <strong>show-role</strong> para exibir a role, por padrão a role é de Aluno, para alterar se usa o <strong>isProfessor</strong>',
    props: {
      displaySettings: () => {},
      title: 'test title',
      username: 'username',
      isProfessor: true,
      showRole: true,
    },
  },
  {
    text: 'Há duas variações principais <strong>float-beneath</strong> e <strong>float-cover</strong>, por padrão <strong>float-cover</strong> é selecionado. Para alterar basta setar <strong>float-beneath</strong> como true. <strong>Float Beneath</strong>',
    props: {
      displaySettings: () => {},
      coverPicture: { id: 0, url: '/images/default-cover.png' },
      imgFromStrapi: false,
      floatBeneath: true,
      showRole: true,
      roleStyle: 'color: #000',
      title: 'Title test',
      fullname: 'John Doe',
      username: 'username',
      usernameStyle: 'color: #000',
      fullnameStyle: 'color: #000;',
      titleStyle: 'color: #000;',
    },
  },
  {
    text: '<strong>Float Cover</strong>',
    props: {
      displaySettings: () => {},
      coverPicture,
      showRole: true,
      roleStyle: 'color: #000',
      title: 'Title test',
      fullname: 'John Doe',
      username: 'username',
      usernameStyle: 'color: #000',
      fullnameStyle: 'color: #000;',
      titleStyle: 'color: #000;',
    },
  },
  {
    text: 'Outra variação importante é o <strong>darkerBackground</strong>',
    props: {
      displaySettings: () => {},
      coverPicture: { id: 0, url: '/images/default-cover.png' },
      imgFromStrapi: false,
      showRole: true,
      darkerBackground: true,
      endDate: '25/12/2022',
      title: 'Title test',
      fullname: 'John Doe',
      username: 'username',
    },
  },
  {
    text: '<strong>darkerBackground</strong> com <strong>float-beneath</strong>',
    props: {
      displaySettings: () => {},
      coverPicture: { id: 0, url: '/images/default-cover.png' },
      imgFromStrapi: false,
      showRole: true,
      darkerBackground: true,
      floatBeneath: true,
      endDate: '25/12/2022',
      title: 'Title test',
      fullname: 'John Doe',
      username: 'username',
    },
  },
  {
    title: 'Uso Completo',
    text: 'Sem float-beneath',
    props: {
      displaySettings: () => {},
      coverPicture,
      showProfilePicture: true,
      profilePicture,
      profilePictureSize: 50,
      darkerBackground: true,
      descriptionAbove: false,
      distribution: 'username-fullname-role',
      copyObject: { label: 'Code', copyText: 'dasdasda' },
      fullnameStyle: 'font-weight-bold',
      codeStyle: 'color: red;',
      roleStyle: 'font-style: italic;',
      usernameStyle: 'color: blue;',
      startDateStyle: 'font-size: 12px;',
      endDateStyle: 'font-size: 12px;',
      titleStyle: 'font-size: 16px;',
      avatarBlockStyle: 'border: 1px solid #ccc;',
      showBorder: false,
      floatBeneath: false,
      settingsMenu: false,
      dateToTheLeft: false,
      showShade: false,
      showRole: true,
      updateProfilePicture: false,
      title: 'Software Engineer',
      userId: 123,
      fullname: 'John Doe',
      username: 'johndoe',
      selectedOption: 0,
      links: ['Link 1', 'Link 2', 'Link 3'],
      isProfessor: false,
      canEdit: true,
      canDelete: false,
      selectOption: () => {},
    },
  },
  {
    text: 'Com float-beneath',
    props: {
      coverPicture,
      profilePicture,
      showProfilePicture: true,
      profilePictureSize: 50,
      darkerBackground: true,
      descriptionAbove: false,
      distribution: 'username-fullname-role',
      copyObject: { label: 'copyme', copyText: 'dasdasda' },
      fullnameStyle: 'font-weight-bold',
      codeStyle: 'color: red;',
      roleStyle: 'font-style: italic;',
      usernameStyle: 'color: blue;',
      startDateStyle: 'font-size: 12px;',
      endDateStyle: 'font-size: 12px;',
      titleStyle: 'font-size: 16px;',
      avatarBlockStyle: 'border: 1px solid #ccc;',
      showBorder: false,
      floatBeneath: true,
      settingsMenu: false,
      dateToTheLeft: false,
      showShade: false,
      showRole: true,
      updateProfilePicture: false,
      title: 'Software Engineer',
      userId: 123,
      fullname: 'John Doe',
      username: 'johndoe',
      startDate: '25/06/2544',
      selectedOption: 0,
      links: ['Link 1', 'Link 2', 'Link 3'],
      isProfessor: false,
      canEdit: true,
      canDelete: false,
    },
  },
]);

const examples = [
  `<div class="d-flex align-center
   justify-space-between bg-gray-300
   w-100 px-3 rounded-t"
   style="height: 300px; position: relative">
      <alex-custom-info/>
</div>`,
  `<alex-custom-banner
    title="test title"
    username="username"
    is-professor
    show-role
/>`,
  `<alex-custom-banner
    :cover-picture="{ id: 0, url: 'https://picsum.photos/2300/500' }"
    :img-from-strapi="false"
    float-beneath
    show-role
    role-style="color: #000"
    title="Title test"
    fullname="John Doe"
    username="username"
    username-style="color: #000"
    fullname-style="color: #000;"
    title-style="color: #000; margin-top: -70px"
    />`,
  `<alex-custom-banner
    :cover-picture="{ id: 0, url: 'https://picsum.photos/2300/500' }"
    :img-from-strapi="false"
    show-role
    role-style="color: #000"
    title="Title test"
    fullname="John Doe"
    username="username"
    username-style="color: #000"
    fullname-style="color: #000;"
    title-style="color: #000;"
    />`,
  `<alex-custom-banner
        :cover-picture="{ id: 0, url: '/images/default-cover.png' }"
        :img-from-strapi="false"
        show-role
        darker-background
        endDate="25/12/2022"
        title="Title test"
        fullname="John Doe"
        username="username"
      />
    `,
  `<alex-custom-banner
        :cover-picture="{ id: 0, url: '/images/default-cover.png' }"
        :img-from-strapi="false"
        show-role
        float-beneath
        darker-background
        endDate="25/12/2022"
        title="Title test"
        fullname="John Doe"
        username="username"
      />
    `,

  `<alex-custom-banner
        :coverPicture="{ url: 'https://picsum.photos/2000/600', id: 1 }"
        :imgFromStrapi="false"
        :showProfilePicture="true"
        :profilePicture="{ url: 'https://picsum.photos/600/500', id: 2 }"
        :profilePictureSize="50"
        :darkerBackground="true"
        :descriptionAbove="false"
        :dateToTheLeft="true"
        :distribution="'username-fullname-role'"
        :code="'ABC123'"
        :fullnameStyle="'font-weight-bold'"
        :codeStyle="'color: red;'"
        :roleStyle="'font-style: italic;'"
        :usernameStyle="'color: blue;'"
        :startDateStyle="'font-size: 12px;'"
        :endDateStyle="'font-size: 12px;'"
        :titleStyle="'font-size: 16px;'"
        :avatarBlockStyle="'border: 1px solid #ccc;'"
        :showBorder="false"
        :floatBeneath="false"
        :settingsMenu="false"
        :dateToTheLeft="false"
        :showShade="false"
        :showRole="true"
        :updateProfilePicture="false"
        :title="'Software Engineer'"
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
    default: '-1',
    description: 'ID do usuário.',
  },
  {
    name: 'showProfilePicture',
    type: 'Boolean',
    default: 'false',
    description: 'Exibir a foto do perfil.',
  },
  {
    name: 'showBorder',
    type: 'Boolean',
    default: 'false',
    description: 'Mostrar borda ao redor da foto do perfil.',
  },
  {
    name: 'showSettings',
    type: 'Boolean',
    default: 'false',
    description: 'Exibir o ícone de configurações.',
  },
  {
    name: 'settingsIcon',
    type: 'String',
    default: 'mdi-cog-outline',
    description: 'O ícone que é exibido como o botão de settings.',
  },
  {
    name: 'floatBeneath',
    type: 'Boolean',
    default: 'false',
    description: 'Flutuar o bloco abaixo do conteúdo.',
  },
  {
    name: 'resize',
    type: 'Boolean',
    default: 'false',
    description: 'Redimensionar a foto do perfil.',
  },
  {
    name: 'profilePictureSize',
    type: 'Number',
    default: '160',
    description: 'Tamanho da foto do perfil.',
  },
  {
    name: 'showRole',
    type: 'Boolean',
    default: 'false',
    description: 'Exibir a função do usuário.',
  },
  {
    name: 'descriptionAbove',
    type: 'Boolean',
    default: 'false',
    description: 'Exibir o título acima do conteúdo.',
  },
  {
    name: 'darkerBackground',
    type: 'Boolean',
    default: 'false',
    description: 'Usar um fundo mais escuro.',
  },
  {
    name: 'distribution',
    type: 'String',
    default: "'fullname-username-role'",
    description: 'Distribuição do layout das informações do usuário.',
  },
  {
    name: 'wrap',
    type: 'Boolean',
    default: 'true',
    description: 'Habilitar quebra de texto.',
  },
  {
    name: 'updateProfilePicture',
    type: 'Boolean',
    default: 'false',
    description: 'Acionar a atualização da foto do perfil.',
  },
  {
    name: 'fullname',
    type: 'String',
    description: 'Nome completo do usuário.',
  },
  {
    name: 'codeStyle',
    type: 'String',
    description: 'Css extra para a propriedade code.',
  },
  {
    name: 'startDateStyle',
    type: 'String',
    description: 'Css extra para a propriedade startDate.',
  },
  {
    name: 'endDateStyle',
    type: 'String',
    description: 'Css extra para a propriedade endDate.',
  },
  {
    name: 'fullnameStyle',
    type: 'String',
    description: 'Css extra para a propriedade fullname.',
  },
  {
    name: 'avatarBlockStyle',
    type: 'String',
    description:
      'Css extra para a propriedade o bloco do app-user-avatar, útil para corrigir o posicionamento.',
  },
  {
    name: 'usernameStyle',
    type: 'String',
    description: 'Css extra para a propriedade username',
  },
  {
    name: 'titleStyle',
    type: 'String',
    description: 'Css extra para a propriedade title.',
  },
  {
    name: 'roleStyle',
    type: 'String',
    description: 'Css extra para a propriedade role.',
  },
  {
    name: 'title',
    type: 'String',
    description: 'Título do bloco de informações do usuário.',
  },
  {
    name: 'description',
    type: 'String',
    description: 'Um título alternativo ao informações do usuário.',
  },
  {
    name: 'startDate',
    type: 'String',
    description: 'Data de início do usuário.',
  },
  {
    name: 'endDate',
    type: 'String',
    description: 'Data de término do usuário.',
  },
  {
    name: 'copyObject',
    type: '{ label: string; copyText: text }',

    description: 'Um objeto a ser copiado.',
  },
  {
    name: 'username',
    type: 'String',
    description: 'Nome de usuário do usuário.',
  },
  {
    name: 'isProfessor',
    type: 'Boolean',
    default: 'false',
    description: 'O usuário é um professor.',
  },
  {
    name: 'canEdit',
    type: 'Boolean',
    default: 'false',
    description: 'O usuário pode editar o conteúdo.',
  },
  {
    name: 'canDelete',
    type: 'Boolean',
    default: 'false',
    description: 'O usuário pode excluir o conteúdo.',
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
