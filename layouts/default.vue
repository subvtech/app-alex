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
      <div v-for="(menu, i) in menus" :key="`menu-${i}`">
        <div
          :data-tour="menu.dataTour"
          :class="{ 'active-step': menu.dataTour !== '' && isTourActive }"
        >
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
      </div>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app color="white">
      <v-app-bar-nav-icon
        class="text-gray-900"
        @click.stop="drawer = !drawer"
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
import { useOnBoarding } from '@/composables/useOnBoarding';
import { User } from '../models/user.model';

const i18n = useI18n();
const clipped = ref(false);
const drawer = ref(true);
const { logout } = useStrapiAuth();
const router = useRouter();
const user = useStrapiUser<User>();

const steps = [
  {
    id: 'step1',
    title: i18n.t('layouts.default.step1.title'),
    text: i18n.t('layouts.default.step1.text'),
    attachTo: {
      element: '[data-tour="step-dashboard"]',
      on: 'bottom',
    },
    buttons: [
      {
        text: i18n.t('layouts.default.step1.nextButton'),
        action: 'next',
      },
    ],
  },
  {
    id: 'step2',
    title: i18n.t('layouts.default.step2.title'),
    text: i18n.t('layouts.default.step2.text'),
    attachTo: {
      element: '[data-tour="step-courses"]',
      on: 'bottom',
    },
    buttons: [
      {
        text: i18n.t('layouts.default.step2.backButton'),
        action: 'back',
      },
      {
        text: i18n.t('layouts.default.step2.nextButton'),
        action: 'next',
      },
    ],
  },
  {
    id: 'step3',
    title: i18n.t('layouts.default.step3.title'),
    text: i18n.t('layouts.default.step3.text'),
    attachTo: {
      element: '[data-tour="step-projects"]',
      on: 'bottom',
    },
    buttons: [
      {
        text: i18n.t('layouts.default.step3.backButton'),
        action: 'back',
      },
      {
        text: i18n.t('layouts.default.step3.nextButton'),
        action: 'next',
      },
    ],
  },
  {
    id: 'step4',
    title: i18n.t('layouts.default.step4.title'),
    text: i18n.t('layouts.default.step4.text'),
    attachTo: {
      element: '[data-tour="step-projects"]',
      on: 'bottom',
    },
    buttons: [
      {
        text: i18n.t('layouts.default.step4.backButton'),
        action: 'back',
      },
      {
        text: i18n.t('layouts.default.step4.completeButton'),
        action: 'complete',
      },
    ],
  },
];

const { tour, isTourActive } = useOnBoarding(steps);

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
    dataTour: 'step-dashboard',
    items: [
      {
        icon: 'mdi-view-dashboard-outline',
        title: i18n.t('layouts.default.dashboard'),
        to: '/dashboard',
      },
    ],
  },
  {
    title: i18n.t('layouts.default.BrowseOnAlex'),
    dataTour: 'step-courses',
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
    dataTour: 'step-projects',
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
    dataTour: '',
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
</style>
