<template>
  <v-app>
    <AppSnackbar />
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      color="primary"
      fixed
      app
      dark
      class="pa-4"
    >
      <v-row justify="center" class="my-10">
        <div>
          <NuxtLink to="/">
            <img src="@/static/images/alex.svg" height="32" width="96" />
          </NuxtLink>
        </div>
      </v-row>
      <div v-for="(menu, i) in menus" :key="`menu-${i}`">
        <v-subheader
          :key="`menu-${i}`"
          class="accent--text"
          style="font-size: 12px; line-height: 15px"
        >
          {{ menu.title }}
        </v-subheader>
        <v-list :key="`menu-${i}-list`">
          <v-list-item
            v-for="(item, j) in menu.items"
            :key="`menu-${i}-item-${j}`"
            :to="item.to"
            router
            exact
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title
                class="font-weight-medium"
                :text="item.title"
              />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app color="white">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <div
        v-if="!drawer"
        class="primary pl-2 pt-1 rounded-pill"
        style="height: 42px; width: 115px"
      >
        <NuxtLink to="/">
          <v-img src="/images/alex.svg" height="32" width="96" />
        </NuxtLink>
      </div>
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
              :class="isHovering ? 'rounded-pill grey lighten-3' : ''"
            >
              <span>
                {{ user?.fullname }}
              </span>

              <v-icon> mdi-chevron-down </v-icon>
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
      <v-container style="width: 100%; max-width: 100%" class="pa-4 pa-sm-10">
        <slot />
      </v-container>
    </v-main>
    
  </v-app>
</template>

<script setup lang="ts">

import { User } from 'models/user.model';

const i18n = useI18n();
const clipped = ref(false);
const drawer = ref(true);
const { logout } = useStrapiAuth();
const router = useRouter();
const user = useStrapiUser<User>();

const profileMenuItems = [
  {
    title: i18n.t('layouts.default.profile'),
    to: '/user/profile',
  },
  {
    title: i18n.t('layouts.default.settings'),
    to: '/user/settings',
  },
  {
    title: i18n.t('layouts.default.logout'),
    logout: true,
  },
]

const menus = [
  {
    title: i18n.t('layouts.default.dashboardsTitle'),
    items: [
      {
        icon: 'mdi-star-outline',
        title: i18n.t('layouts.default.dashboard'),
        to: '/dashboard',
      },
    ],
  },
  {
    title: i18n.t('layouts.default.learningPlansTitle'),
    items: [
      {
        icon: 'mdi-star-outline',
        title: i18n.t('layouts.default.learningPlans'),
        to: '/learning-plans',
      },
      {
        icon: 'mdi-star-outline',
        title: i18n.t('layouts.default.learningPlansUser'),
        to: '/learning-plans/user',
      },
    ],
  },
  {
    title: i18n.t('layouts.default.classesTitle'),
    items: [
      {
        icon: 'mdi-star-outline',
        title: i18n.t('layouts.default.classes'),
        to: '/classes',
      },
      {
        icon: 'mdi-star-outline',
        title: i18n.t('layouts.default.classesLinks'),
        to: '/projects',
      },
    ],
  },
]

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

</style>
