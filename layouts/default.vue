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
            <v-img src="/images/alex.svg" height="32" width="96" />
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
              <!-- <app-user-avatar :user="user" class="mr-2" /> -->
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
    <v-main class="secondary">
      <v-container style="width: 100%; max-width: 100%" class="pa-10">
        <slot />
      </v-container>
    </v-main>
    <!-- <v-footer :absolute="!fixed" app>
        <span>&copy; {{ new Date().getFullYear() }}</span>
      </v-footer> -->
  </v-app>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { User } from 'models/user.model';

const i18n = useI18n();
const clipped = ref(false);
const drawer = ref(true);
// const fixed = ref(false);

const { logout } = useStrapiAuth();
const router = useRouter();
const user = useStrapiUser<User>();

const profileMenuItems = ref([
  {
    title: i18n.t('defaultLayout.profile'),
    to: '/user/profile',
  },
  {
    title: i18n.t('defaultLayout.settings'),
    to: '/user/settings',
  },
  {
    title: i18n.t('defaultLayout.logout'),
    logout: true,
  },
]);

const menus = ref([
  {
    title: i18n.t('defaultLayout.dashboardsTitle'),
    items: [
      {
        icon: 'mdi-star-outline',
        title: i18n.t('defaultLayout.dashboard'),
        to: '/dashboard',
      },
    ],
  },
  {
    title: i18n.t('defaultLayout.learningPlansTitle'),
    items: [
      {
        icon: 'mdi-star-outline',
        title: i18n.t('defaultLayout.learningPlans'),
        to: '/learning-plans',
      },
      {
        icon: 'mdi-star-outline',
        title: i18n.t('defaultLayout.learningPlansUser'),
        to: '/learning-plans/user',
      },
    ],
  },
  {
    title: i18n.t('defaultLayout.classesTitle'),
    items: [
      {
        icon: 'mdi-star-outline',
        title: i18n.t('defaultLayout.classes'),
        to: '/classes',
      },
      {
        icon: 'mdi-star-outline',
        title: i18n.t('defaultLayout.classesLinks'),
        to: '/classes/active-links',
      },
    ],
  },
]);

const miniVariant = ref(false);

// const title = ref('Alex');

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
  font-family: 'Montserrat' !important;

  .v-application {
    font-family: 'Montserrat' !important;
  }
}
</style>
