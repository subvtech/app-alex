<template>
  <v-app>
    <AppSnackbar></AppSnackbar>
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
      <div v-for="(menu, i) in menus">
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
                v-text="item.title"
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
        <template #activator="{ on, attrs }">
          <v-hover v-slot="{ hover }">
            <div
              v-bind="attrs"
              style="cursor: pointer"
              :class="hover ? 'rounded-pill grey lighten-3' : ''"
              v-on="on"
            >
              <app-user-avatar :user="$strapi.user" class="mr-2" />
              <span> {{ $strapi.user.fullname }} </span>

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
        <Nuxt />
      </v-container>
    </v-main>
    <!-- <v-footer :absolute="!fixed" app>
        <span>&copy; {{ new Date().getFullYear() }}</span>
      </v-footer> -->
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      profileMenuItems: [
        {
          title: 'Perfil',
          to: '/user/profile',
        },
        {
          title: 'Configurações',
          to: '/user/settings',
        },
        {
          title: 'Sair',
          logout: true,
        },
      ],
      menus: [
        {
          title: 'DASHBOARDS',
          items: [
            {
              icon: 'mdi-star-outline',
              title: 'Dashboard',
              to: '/dashboard',
            },
          ],
        },
        {
          title: 'PLANOS DE APRENDIZAGEM',
          items: [
            {
              icon: 'mdi-star-outline',
              title: 'Todos os planos',
              to: '/learning-plans',
            },
            {
              icon: 'mdi-star-outline',
              title: 'Meus planos',
              to: '/learning-plans/user',
            },
          ],
        },
        {
          title: 'TURMAS',
          items: [
            {
              icon: 'mdi-star-outline',
              title: 'Minhas turmas',
              to: '/classes',
            },
            {
              icon: 'mdi-star-outline',
              title: 'Links ativos',
              to: '/classes/active-links',
            },
          ],
        },
      ],
      miniVariant: false,
      title: 'Alex',
    };
  },
  methods: {
    async onMenuClick(route = '', logout = false) {
      if (logout) {
        await this.logout();
      } else {
        this.$router.push({ path: route });
      }
    },
    async logout() {
      await this.$strapi.logout();
      this.$router.push('/login');
    },
  },
};
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
