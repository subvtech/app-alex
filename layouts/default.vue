<template>
  <v-app class="tw-relative">
    <app-snackbar />
    <alex-custom-sidebar v-model="drawer" v-model:clipped="clipped" :blocks="menus" :is-permanent="isPermanent" />
    <alex-custom-horizontal-bar
      :drawer="drawer"
      fixed
      :class="clipped ? 'clipped-sidebar main-header-app' : 'sidebar main-header-app'"
      :avatar="user?.avatar"
      :placeholder="user?.fullname"
      :menu-items="profileMenuItems"
      :track-current-user="userStore.isCurrentUser"
      show-picture
      @toggle:drawer="closeDrawable(!clipped)"
    />
    <v-main class="bg-gray-blue pt-16 tw-flex tw-flex-col tw-grow" :class="clipped ? 'clipped-sidebar' : 'sidebar'">
      <v-container class="tw-flex tw-flex-col tw-grow pa-4 pa-sm-6 max-width-100">
        <alex-custom-header
          v-if="headerStore.showHeader"
          v-bind="headerStore.headerOptions"
          :loading="headerStore.isLoading"
          @main-action="headerStore.onMainAction"
          @secondary-action="headerStore.onSecondaryAction"
        />
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import useNavigationDrawer from '~/composables/useNavigationDrawer';
import { useMainHorizontalBar } from '~/composables/useMainHorizontalBar';
const i18n = useI18n();
const config = useRuntimeConfig();
const router = useRouter();

router.beforeEach(() => {
  headerStore.showHeader = false;
  headerStore.onMainAction = null;
  headerStore.onSecondaryAction = null;
});

const user = useStrapiUser<User>();
const userStore = useUserStore();
const { clipped, drawer, closeDrawable, isPermanent } = useNavigationDrawer();

const headerStore = usePageHeaderStore();

const { profileMenuItems } = useMainHorizontalBar();

onBeforeMount(() => {
  if (!userStore.user) return;
  userStore.user.avatar = user.value?.avatar;
  userStore.user.fullname = user.value?.fullname;
});

// const steps = [
//   {
//     id: 'step1',
//     title: i18n.t('layouts.default.step1.title'),
//     text: i18n.t('layouts.default.step1.text'),
//     attachTo: {
//       element: '[data-tour="step-user-area"]',
//       on: 'right',
//     },
//     buttons: [
//       {
//         text: i18n.t('layouts.default.step1.nextButton'),
//         action: 'next',
//       },
//     ],
//   },
//   {
//     id: 'step2',
//     title: i18n.t('layouts.default.step2.title'),
//     text: i18n.t('layouts.default.step2.text'),
//     attachTo: {
//       element: '[data-tour="step-user-area"]',
//       on: 'right',
//     },
//     buttons: [
//       {
//         text: i18n.t('layouts.default.step2.backButton'),
//         action: 'back',
//       },
//       {
//         text: i18n.t('layouts.default.step2.nextButton'),
//         action: 'next',
//       },
//     ],
//   },
//   {
//     id: 'step3',
//     title: i18n.t('layouts.default.step3.title'),
//     text: i18n.t('layouts.default.step3.text'),
//     attachTo: {
//       element: '[data-tour="step-navigation"]',
//       on: 'right',
//     },
//     buttons: [
//       {
//         text: i18n.t('layouts.default.step3.backButton'),
//         action: 'back',
//       },
//       {
//         text: i18n.t('layouts.default.step3.nextButton'),
//         action: 'next',
//       },
//     ],
//   },
//   {
//     id: 'step4',
//     title: i18n.t('layouts.default.step4.title'),
//     text: i18n.t('layouts.default.step4.text'),
//     attachTo: {
//       element: '[data-tour="step-professor"]',
//       on: 'bottom',
//     },
//     buttons: [
//       {
//         text: i18n.t('layouts.default.step4.backButton'),
//         action: 'back',
//       },
//       {
//         text: i18n.t('layouts.default.step4.nextButton'),
//         action: 'next',
//       },
//     ],
//   },
//   {
//     id: 'step5',
//     title: i18n.t('layouts.default.step5.title'),
//     text: i18n.t('layouts.default.step5.text'),
//     attachTo: {
//       element: '[data-tour="step-profile"]',
//       on: 'bottom',
//     },
//     buttons: [
//       {
//         text: i18n.t('layouts.default.step5.backButton'),
//         action: 'back',
//       },
//       {
//         text: i18n.t('layouts.default.step5.nextButton'),
//         action: 'next',
//       },
//     ],
//   },
//   {
//     id: 'step6',
//     title: i18n.t('layouts.default.step6.title'),
//     text: i18n.t('layouts.default.step6.text'),
//     attachTo: {
//       element: '',
//       on: 'center',
//     },
//     buttons: [
//       {
//         text: i18n.t('layouts.default.step6.backButton'),
//         action: 'back',
//       },
//       {
//         text: i18n.t('layouts.default.step6.completeButton'),
//         action: 'complete',
//       },
//     ],
//   },
// ];

// const { tour, activeTour } = useOnBoarding(steps);
interface Menu {
  dataTour?: string;
  title: string;
  items: {
    icon: string;
    title: string;
    to: string;
  }[];
}

const defaultMenus: Menu[] = [
  {
    title: i18n.t('layouts.default.userArea'),
    items: [
      {
        icon: 'mdi-view-dashboard-outline',
        title: i18n.t('layouts.default.dashboard'),
        to: '/',
      },
      {
        icon: 'mdi-book-cog-outline',
        title: i18n.t('layouts.default.myClasses'),
        to: '/courses/me',
      },
      {
        icon: 'alex:ProjectConfig',
        title: 'Meus Projetos',
        to: '/projects/me',
      },
      ...(user.value?.role.name === 'Professor'
        ? [
            {
              icon: 'alex:FactCheck',
              title: i18n.t('layouts.default.evaluations'),
              to: '/evaluations',
            },
          ]
        : []),
      // {
      //   icon: 'mdi-clipboard-multiple-outline',
      //   title: i18n.t('layouts.default.myProjects'),
      //   to: '/classes/active-links',
      // },
      // {
      //   icon: 'mdi-heart-outline',
      //   title: i18n.t('layouts.default.favourites'),
      //   to: '/classes/active-links',
      // },
    ],
  },

  // {
  //   title: i18n.t('layouts.default.BrowseOnAlex'),
  //   items: [
  //     {
  //       icon: 'mdi-book-outline',
  //       dataTour: 'step-navigation',
  //       title: i18n.t('layouts.default.courses'),
  //       to: '/learning-plans',
  //     },
  //     {
  //       icon: 'mdi-clipboard-text-outline',
  //       title: i18n.t('layouts.default.projects'),
  //       to: '/learning-plans/user',
  //     },
  //   ],
  // },

  // {
  //   title: i18n.t('layouts.default.professorTitle'),
  //   dataTour: 'step-professor',
  //   items: [
  //     {
  //       icon: 'mdi-account-multiple-outline',
  //       title: i18n.t('layouts.default.userList'),
  //       to: '/classes',
  //     },
  //     {
  //       icon: 'mdi-account-multiple-outline',
  //       title: i18n.t('layouts.default.institutionList'),
  //       to: '/classes',
  //     },
  //     {
  //       icon: 'mdi-lock-outline',
  //       title: i18n.t('layouts.default.accessControl'),
  //       to: '/classes',
  //     },
  //     {
  //       icon: 'mdi-cog-outline',
  //       title: i18n.t('layouts.default.settings'),
  //       to: '/projects',
  //     },
  //   ],
  // },
];

const componentsMenu: Menu[] = [
  {
    title: 'Componentes',
    dataTour: '',
    items: [
      {
        icon: 'mdi-view-dashboard-outline',
        title: 'Documentacao',
        to: '/components',
      },
    ],
  },
];

const adminMenus = [
  {
    title: 'Administrador',
    items: [
      {
        icon: 'mdi-view-dashboard-outline',
        title: 'Menu Admin',
        to: '/admin',
      },
    ],
  },
];

const menus = computed(() => {
  const newMenus = user.value?.role?.name === 'ADMIN' ? defaultMenus.concat(adminMenus) : defaultMenus;

  return config.public.showComponentsPage ? newMenus.concat(componentsMenu) : newMenus;
});
</script>

<style lang="scss">
@media screen and (min-width: 959px) {
  .sidebar {
    --v-layout-left: 256px !important;
  }
  .clipped-sidebar {
    --v-layout-left: 56px !important;
  }
  .main-header-app {
    left: var(--v-layout-left) !important;
    width: calc(100% - var(--v-layout-left)) !important;
  }
}

.overflow-hidden {
  overflow-y: hidden;
}
.max-width-100 {
  max-width: 100%;
}
.shepherd-step {
  z-index: 100000 !important;
  background-color: #fff !important;
  border-radius: 8px !important;
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.15);
  padding: 16px !important;
  max-width: 300px !important;
}

.active-step {
  z-index: 200000 !important;
  background: none;
  border-radius: 0.1rem;
  border: 2px dotted #00b7cc;
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

.shepherd-step .shepherd-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.shepherd-cancel-icon {
  font-size: 25px;
  height: 25px;
  width: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
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

.shepherd-step .shepherd-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.shepherd-cancel-icon {
  font-size: 25px;
  height: 25px;
  width: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.shepherd-step button {
  background-color: #00b7cc;
  padding: 0.5rem;
  border-radius: 0.5rem;
}

html,
body {
  .v-application {
    .item-name {
      color: #d2d6da;

      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 135%;
      letter-spacing: 0.56px;
    }

    .smaller {
      display: flex;
    }
    .larger {
      display: none;
    }

    @media (min-width: 959px) {
      .smaller {
        display: none;
      }
      .larger {
        display: flex;
      }
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
</style>
