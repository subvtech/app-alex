<template>
  <v-app v-if="user">
    <AppSnackbar />
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      color="primary"
      fixed
      app
      dark
      class="d-flex flex-column pb-2 px-2"
    >
      <v-row justify="center" class="my-4" style="max-height: 64px">
        <div>
          <NuxtLink to="/">
            <img src="/images/alex.svg" height="32" width="96" />
          </NuxtLink>
        </div>
      </v-row>
      <!-- aqui começa o teste para o on boarding -->
      <div v-for="(menu, i) in menus" :key="`menu-${i}`">
        <v-subheader :key="`menu-${i}`" class="subheader accent-text">
          {{ menu.title }}
        </v-subheader>
        <v-list :key="`menu-${i}-list`">
          <v-list-item
            v-for="(item, j) in menu.items"
            :key="`menu-${i}-item-${j}`"
            :to="item.to"
            class=""
            router
            exact
          >
            <div class="d-flex align-center" style="gap: 16px">
              <v-list-item-action>
                <v-icon color="#d2d6da">{{ item.icon }}</v-icon>
              </v-list-item-action>

              <v-list-item-title
                class="item-name font-weight-medium"
                v-text="item.title"
              />
            </div>
          </v-list-item>
        </v-list>
      </div>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app color="white">
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        class="text-gray-900"
      />
      <div
        v-if="!drawer"
        class="primary pl-2 pt-1 rounded-pill"
        style="height: 42px; width: 115px"
      ></div>
      <v-spacer />
      <v-btn icon color="grey">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon color="grey">
        <v-icon>mdi-chat-processing-outline</v-icon>
      </v-btn>
      <v-btn icon color="grey" class="mr-2">
        <v-icon>mdi-bell-outline</v-icon>
      </v-btn>

      <v-menu offset-y nudge-bottom="10">
        <template #activator="{ props }">
          <v-hover v-slot="{ isHovering }">
            <div
              v-bind="props"
              style="cursor: pointer"
              class="user-block"
              :class="isHovering ? 'rounded-pill grey lighten-3' : ''"
            >
              <app-user-avatar :user="user" class="mr-2" />
              <span class="fullname">
                {{ user?.fullname }}
              </span>

              <v-icon class="fullname"> mdi-chevron-down </v-icon>
            </div>
          </v-hover>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in profileMenuItems"
            :key="`profile-menu-item-${index}`"
            @click="onMenuClick(item.to, item.logout)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main class="secondary bg-gray-blue">
      <v-container style="max-width: 100%" class="pa-4 pa-sm-6">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import Shepherd from 'shepherd.js';
import { User } from '../models/user.model';

const i18n = useI18n();
const clipped = ref(false);
const drawer = ref(true);
const { logout } = useStrapiAuth();
const router = useRouter();
const user = useStrapiUser<User>();

const tour = new Shepherd.Tour({
  useModalOverlay: true,
  confirmCancel: true,
  defaultStepOptions: {
    arrow: true,
    classes: 'shepherd-step',
    scrollTo: true,
    highlightClass: 'active-step',
  },
});

const isTourActive = ref(false); // Variável que vai definir se a tour está ativa ou não pra controlar a classe que ativa o highlight nos elementos

const stepsData = [
  {
    id: 'step1',
    title: 'Bem vindo(a) ao Projeto ALEX, esteja pronto para aprender e ensinar!',
    text: 'Iniciamos com a Dashboard, ela centraliza informações e atalhos para as funcionalidades do sistema',
    attachTo: {
      element: '[data-tour="step-dashboard"]',
      on: 'bottom',
    },
    classes: 'example-step-extra-class',
    buttons: [
      {
        text: 'Avançar',
        action: tour.next,
      },
    ],
  },
  {
    id: 'step2',
    text: 'Na área de planos de aprendizagem você acessa os planos criados por toda a comunidade ou planos que você criou ou nos quais está inserido',
    attachTo: {
      element: '[data-tour="step-learning-plans"]',
      on: 'bottom',
    },
    buttons: [
      {
        text: 'Voltar',
        action: tour.back,
      },
      {
        text: 'Avançar',
        action: tour.next,
      },
    ],
  },
  {
    id: 'step3',
    text: 'Na área de turmas você acessa as turmas criadas por toda a comunidade ou turmas que você criou ou nas quais está inserido',
    attachTo: {
      element: '[data-tour="step-all-classes"]',
      on: 'bottom',
    },
    buttons: [
      {
        text: 'Voltar',
        action: tour.back,
      },
      {
        text: 'Avançar',
        action: tour.next,
      },
    ],
  },
  {
    id: 'step4',
    text: 'Professores têm uma área especial para gerenciar seus planos e turmas',
    attachTo: {
      element: '[data-tour="step-classes-links"]',
      on: 'bottom',
    },
    buttons: [
      {
        text: 'Voltar',
        action: tour.back,
      },
      {
        text: 'Finalizar',
        action: tour.complete,
      },
    ],
  },
];

onMounted(() => {
  tour.addSteps(stepsData);
  isTourActive.value = true;
  tour.start();
});

tour.on('complete', () => {
  isTourActive.value = false; // Define a variável como falsa pra tirar o highlight do menu (ou de outro possível local) quando a gente finaliza a tour
});

tour.on('cancel', () => {
  isTourActive.value = false; // Define a variável como falsa pra tirar o highlight do menu (ou de outro possível local) quando a gente cancela a tour (com ESC)
});

const profileMenuItems = [
  {
    title: i18n.t('layouts.default.profile'),
    to: `/user/${user.value.username}`,
  },
  {
    title: i18n.t('layouts.default.settings'),
    to: '/user/settings',
  },
  {
    title: i18n.t('layouts.default.logout'),
    logout: true,
  },
];

const menus = [
  {
    title: i18n.t('layouts.default.dashboardsTitle'),
    items: [
      {
        icon: 'mdi-view-dashboard-outline',
        title: i18n.t('layouts.default.dashboard'),
        dataTour: 'step-dashboard',
        to: '/dashboard',
      },
    ],
  },
  {
    title: i18n.t('layouts.default.BrowseOnAlex'),
    items: [
      {
        icon: 'mdi-book-outline',
        title: i18n.t('layouts.default.courses'),
        to: '/learning-plans',
      },
      {
        icon: 'mdi-clipboard-text-outline',
        title: i18n.t('layouts.default.projects'),
        to: '/learning-plans/user',
      },
    ],
  },
  {
    title: i18n.t('layouts.default.userArea'),
    items: [
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
  {
    title: i18n.t('layouts.default.professorTitle'),
    items: [
      {
        icon: 'mdi-account-multiple-outline',
        title: i18n.t('layouts.default.userList'),
        to: '/classes',
      },
      {
        icon: 'mdi-lock-outline',
        title: i18n.t('layouts.default.accessControl'),
        to: '/classes',
      },
      {
        icon: 'mdi-cog-outline',
        title: i18n.t('layouts.default.settings'),
        to: '/projects',
      },
    ],
  },
];

const miniVariant = ref(false);
function onMenuClick(route = '', logout = false) {
  if (logout) {
    logoutUser();
  } else {
    router.push({ path: route });
  }
}

function logoutUser() {
  logout();
  router.push('/login');
}
</script>

<style lang="scss">
html,
body {
  overflow-y: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none;
  }

  .v-application {
    font-family: Sen !important;

    .v-navigation-drawer__content {
      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none; /* Firefox */
      gap: 24px;
      display: flex;
      flex-direction: column;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .subheader {
      color: #00b7cc;
      padding-left: 16px;
      padding-right: 8px;

      /* Body/P6 */
      font-size: 12px;
      font-weight: 700;
      line-height: 135%; /* 16.2px */
      letter-spacing: 0.48px;
    }

    .item-name {
      color: #d2d6da;

      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 135%; /* 18.9px */
      letter-spacing: 0.56px;
    }

    @media (max-width: 550px) {
      .v-toolbar__content {
        .user-block {
          .fullname {
            display: none;
          }
        }
      }
    }
  }
}
.shepherd-step {
  z-index: 100000;
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.15);
  padding: 16px;
  max-width: 300px;
}

.active-step {
  background: rgb(46, 116, 184, 0.2);
  padding: 0.5rem;
}

.shepherd-step .shepherd-arrow {
  background-color: #fff;
}

.shepherd-step .shepherd-title {
  font-size: 1rem;
  line-height: 1.25rem;
  margin-bottom: 1rem;
}

.shepherd-step .shepherd-text {
  font-size: 1rem;
  line-height: 1.5rem;
  margin-bottom: 1rem;
}

.shepherd-step .shepherd-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
}

.shepherd-step button {
  background-color: #00b7cc;
  padding: 0.5rem;
  border-radius: 0.5rem;
}
</style>
