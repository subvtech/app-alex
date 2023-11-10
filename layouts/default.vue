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
    <alex-custom-horizontal-bar
      :drawer="true"
      fixed
      :is-bell-active="false"
      :is-chat-active="false"
      :toggle-drawer="() => (drawer = !drawer)"
      :menu-items="profileMenuItems"
      :reverse="false"
      :user="user"
    />

    <v-main class="secondary bg-gray-blue">
      <v-container style="max-width: 100%" class="pa-4 pa-sm-6">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
const i18n = useI18n();
const clipped = ref(false);
const drawer = ref(true);
const user = useStrapiUser<User>();

const menus = [
  {
    title: i18n.t('layouts.default.dashboardsTitle'),
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
const profileMenuItems = [
  {
    title: i18n.t('layouts.default.profile'),
    to: `/user/${user?.username}`,
    logout: false,
  },
  {
    title: i18n.t('layouts.default.settings'),
    to: '/user/settings',
    logout: false,
  },
  {
    title: i18n.t('layouts.default.logout'),
    logout: true,
  },
];

const miniVariant = ref(false);
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
</style>
