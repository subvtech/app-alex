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

    <div v-if="user" v-for="(item, index) in documentation">
      <p class="text-subtitle-2 text-gray-500" v-html="item.text" />

      <div class="d-flex flex-column w-100">
        <div
          class="d-flex align-center rounded-lg my-2 justify-center bg-gray-100 w-100 px-3 rounded-t"
        >
          <alex-custom-banner
            :key="index"
            v-bind="item.props as any"
            @select:option="item.props.selectOption"
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

const { findOne } = useStrapi();

const i18n = useI18n();

const { setMessage } = useMessageStore();

const { id } = useStrapiUser<User>().value;

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const copiedValue = ref('');
const copiedIndex = ref(-1);

const user = ref<any>(null);
const selectedOption1 = ref(0);
const selectedOption2 = ref(0);
const selectedOption3 = ref(0);
const selectedOption4 = ref(0);

const selectOption1 = (index) => {
  selectedOption1.value = index;
  showSettings.value = false;
};
const selectOption2 = (index) => {
  selectedOption2.value = index;
  showSettings2.value = false;
};

const selectOption3 = (index) => {
  selectedOption3.value = index;
  showSettings3.value = false;
};

const selectOption4 = (index) => {
  selectedOption4.value = index;
  showSettings4.value = false;
};

const links = ref([
  i18n.t('pages.profile.general'),
  i18n.t('pages.profile.courses'),
  i18n.t('pages.profile.projects'),
  i18n.t('pages.profile.assignments'),
  i18n.t('pages.profile.events'),
]);

const profilePicture = { url: 'https://picsum.photos/1200/600', id: 1 };
const coverPicture = { url: 'https://picsum.photos/2000/600', id: 1 };

const showSettings = ref(false);
const showSettings2 = ref(false);
const showSettings3 = ref(false);
const showSettings4 = ref(false);
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
  if (!user.value.avatar) user.value.avatar = profilePicture;
  if (!user.value.cover) {
    user.value.cover = coverPicture;
  }
  setMessage('done', 'green', show);
};

await updateUser(false);

const documentation = ref([
  {
    text: 'Esse é o modelo mais simples, passado nenhuma propriedade ele meramente exibe uma imagem aleatória da internet.',
    props: {},
  },
  {
    text: 'Por padrão, o componente usa uma imagem aleatória, mas você pode alterar essa imagem, passando uma prop <strong>coverPicture</strong> com a url desejada. Por padrão se espera que a imagem veja do strapi, mas você pode mudar esse comportamento passando a prop <strong>imgFromStrapi</strong> para falso',
    props: {
      coverPicture,
      imgFromStrapi: false,
      selectOption: () => {},
      displaySettings: () => {},
    },
  },
  {
    text: 'Por padrão <strong>img-from-strapi</strong> é falso, entao basta passar <strong>cover-picture</strong> que ele pega do strapi',
    props: {
      coverPicture, //na documentação está o exemplo correto
      imgFromStrapi: false,
      selectOption: () => {},
      displaySettings: () => {},
    },
  },
  {
    text: 'USO COMPLETO: O componente <strong>alex-custom-info</strong> altera bastante a maneira que o banner é exibido. Aqui é um exemplo com <strong>float-beneath</strong> definido como falso',
    props: {
      coverPicture,
      imgFromStrapi: false,
      showProfilePicture: true,
      profilePicture: { url: 'https://picsum.photos/600/500', id: 2 },
      profilePictureSize: 50,
      darkerBackground: false,
      descriptionAbove: false,
      distribution: 'fullname-username-role',
      copyObject: { label: 'Code', copyText: 'dasdasda' },
      fullnameStyle: 'font-weight-bold',
      codeStyle: 'color: red;',
      roleStyle: 'font-style: italic;',
      usernameStyle: 'color: blue;',
      startDateStyle: 'font-size: 12px;',
      endDateStyle: 'font-size: 12px;',
      titleStyle: 'font-size: 16px;',
      avatarStyle: 'border: 1px solid #ccc;',
      showBorder: false,
      floatBeneath: false,
      settingsMenu: false,
      dateToTheLeft: false,
      showShade: false,
      showRole: false,
      updateProfilePicture: false,
      title: 'Software Engineer',
      showMenu: true,
      settingsIcon: 'mdi-cog',
      userId: '123',
      fullname: 'John Doe',
      startDate: '2022-01-01',
      endDate: '2023-01-01',
      username: 'johndoe',
      selectedOption: selectedOption1.value,
      links: ['Link 1', 'Link 2', 'Link 3'],
      isProfessor: false,
      canEdit: true,
      canDelete: false,
      selectOption: selectOption1,
      displaySettings: () => (showSettings.value = !showSettings.value),
    },
  },
  {
    text: 'O componente <strong>alex-custom-info</strong> altera bastante a maneira que o banner é exibido. Aqui é um exemplo com <strong>float-beneath</strong> definido como verdadeiro',
    props: {
      coverPicture,
      imgFromStrapi: false,
      showProfilePicture: true,
      profilePicture: { url: 'https://picsum.photos/600/500', id: 2 },
      profilePictureSize: 500,
      darkerBackground: false,
      descriptionAbove: false,
      distribution: 'fullname-username-role',
      copyObject: { label: 'Code', copyText: 'dasdasda' },
      fullnameStyle: 'font-weight-bold',
      codeStyle: 'color: blue;',
      roleStyle: 'font-style: italic;',
      usernameStyle: 'color: blue;',
      startDateStyle: 'font-size: 12px;',
      endDateStyle: 'font-size: 12px;',
      titleStyle: 'font-size: 16px;',
      avatarStyle: 'border: 1px solid #ccc;',
      showBorder: false,
      floatBeneath: true,
      settingsMenu: false,
      dateToTheLeft: false,
      showShade: false,
      updateProfilePicture: false,
      title: 'Software Engineer',
      showMenu: true,
      settingsIcon: 'mdi-cog',
      userId: '123',
      fullname: 'John Doe',
      startDate: '2022-01-01',
      endDate: '2023-01-01',
      username: 'johndoe',
      selectedOption: selectedOption2.value,
      showRole: true,
      links: ['Link 1', 'Link 2', 'Link 3', 'Link 4'],
      isProfessor: false,
      canEdit: true,
      canDelete: false,
      selectOption: selectOption2,
      displaySettings: () => {
        showSettings2.value = !showSettings2.value;
      },
    },
  },
  {
    text: 'Aqui é um exemplo com de como é usado no <strong>perfil</strong>',
    props: {
      canEdit: true,
      coverPicture: user.value.cover,
      imgFromStrapi: user.value.cover ? false : true,
      profilePictureSize: 160,
      profilePicture: user.value.avatar,
      userId: id,
      canDelete: true,
      showMenu: true,
      showProfilePicture: true,
      showSettings: true,
      showRole: true,
      showBorder: true,
      floatBeneath: true,
      distribution: 'fullname-username-role',
      selectedOption: selectedOption3.value,
      selectOption: selectOption3,
      displaySettings: () => (showSettings3.value = !showSettings3.value),
      isProfessor: user.value.isProfessor,
      fullname: user.value.fullname ?? 'John Smith',
      fullnameStyle: 'color: #454D54;',
      username: user.value.username,
      usernameStyle: 'color: #A0A8B1;',
      roleStyle: 'color: #A0A8B1;',
      links: links.value,
    },
  },
  {
    text: 'Aqui é um exemplo com de como é usado no <strong>courses</strong>',
    props: {
      canEdit: false,
      coverPicture: user.value.cover,
      imgFromStrapi: user.value.cover ? false : true,
      profilePictureSize: 24,
      profilePicture: user.value.avatar,
      userId: id,
      showProfilePicture: true,
      darkerBackground: true,
      showShade: true,
      showMenu: true,
      settingsMenu: true,
      distribution: 'fullname-username-role',
      selectedOption: selectedOption4.value,
      selectOption: selectOption4,
      displaySettings: () => (showSettings4.value = !showSettings4.value),
      isProfessor: user.value.isProfessor,
      fullname: user.value.fullname ?? 'John Smith',
      title: 'Turma',
      copyObject: { label: 'Code', copyText: 'dasdasda' },
      description: 'Information Systems',
      subtitle: 'tsf idsda',
      startDate: '12/06/2006',
      endDate: '12/06/2016',
      links: links.value,
    },
  },
]);

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
      :descriptionAbove="false"
      :distribution="'fullname-username-role'"
      :copyObject="{ label: 'Code', copyText: 'dasdasda' }",
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

  `<alex-custom-banner
        :coverPicture="{ url: 'https://picsum.photos/2000/600', id: 1 }"
        :imgFromStrapi="false"
        :showProfilePicture="true"
        :profilePicture="{ url: 'https://picsum.photos/600/500', id: 2 }"
        :profilePictureSize="500"
        :darkerBackground="false"
        :descriptionAbove="false"
        :distribution="'fullname-username-role'"
        :copyObject="{ label: 'Code', copyText: 'dasdasda' }",
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
  `<alex-custom-banner
      v-if="user"
      :can-edit="true"
      :cover-picture="user.cover"
      :profile-picture-size="160"
      :profile-picture="user.avatar"
      :userId="user.id"
      can-delete
      show-menu
      show-settings
      show-profile-picture
      show-role
      show-border
      float-beneath
      distribution="fullname-username-role"
      :selectedOption="selectedOption2"
      @select:option="selectOption2"
      @display:settings="showSettings = !showSettings"
      :is-professor="user.isProfessor"
      :fullname="user.fullname"
      fullnameStyle="color: #454D54;"
      :username="user.username"
      usernameStyle="color: #A0A8B1;"
      roleStyle="color: #A0A8B1;"
      :links="links"
    />`,
  `<alex-custom-banner
        v-if="user"
        :can-edit="false"
        :cover-picture="user.cover"
        :profile-picture-size="24"
        :profile-picture="user.avatar"
        :userId="user.id"
        show-profile-picture
        darker-background
        show-shade
        show-menu
        settings-menu
        distribution="fullname-username-role"
        :selectedOption="selectedOption2"
        @select:option="selectOption2"
        @display:settings="showSettings = !showSettings"
        :is-professor="user.isProfessor"
        :fullname="user.fullname"
        title="Turma"
        :copyObject="{ label: 'Code', copyText: 'dasdasda' }",
        description="Information Systems"
        subtitle="tsf idsda"
        startDate="12/06/2006"
        endDate="12/06/2016"
        :links="links"
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
    name: 'showSettings',
    type: 'Boolean',
    default: 'false',
    description:
      'Um boolean que indica se o botão de settings deve ser exibido',
  },
  {
    name: 'settingsMenu',
    type: 'Boolean',
    default: 'false',
    description:
      'Um boolean que indica se o posicionamento do botão de settings, se true ele é exibido no menu ou se false é exibido na imagem-capa, depende de showSettings.',
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
