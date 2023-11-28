<template>
  <v-app>
    <AppSnackbar />
    <alex-custom-drawable
      :blocks="menus"
      :clipped="clipped"
      v-model="drawer"
      dark
      :permanent="isPermanent"
      @update:model-value="closeDrawable"
    >
      <template v-slot:header>
        <div
          class="my-4 w-100 d-flex"
          :class="clipped ? '' : 'justify-center'"
          style="max-height: 28px"
        >
          <div>
            <NuxtLink to="/">
              <img
                v-if="clipped"
                src="/images/alex-mini.svg"
                height="28"
                width="43"
              />
              <img v-else src="/images/alex.svg" height="28" width="84" />
            </NuxtLink>
          </div>
        </div>
      </template>
    </alex-custom-drawable>

    <alex-custom-horizontal-bar
      :drawer="drawer"
      fixed
      :toggle-drawer="() => closeDrawable(!clipped)"
      :user="user"
      @click="onClickOutside"
      :menu-items="profileMenuItems"
    />

    <v-main class="secondary bg-gray-blue pt-16" @click="onClickOutside">
      <v-container style="max-width: 100%" class="pa-4 pa-sm-6">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import useNavigationDrawer from '~/composables/useNavigationDrawer';

const i18n = useI18n();
const user = useStrapiUser<User>();
const userStore = useUserStore();

const { clipped, drawer, isPermanent, closeDrawable, onClickOutside } =
  useNavigationDrawer();

onBeforeMount(() => {
  if (user.value) {
    userStore.profilePicture = user.value.avatar;
    userStore.fullname = user.value.fullname;
  }
});

const menus = [
  {
    title: 'Components',
    items: [
      {
        icon: 'mdi-view-dashboard-outline',
        title: 'AppUserAvatar',
        to: '/components/custom/appuseravatar',
      },
      {
        icon: 'mdi-view-dashboard-outline',
        title: 'Banner',
        to: '/components/custom/banner',
      },

      {
        icon: 'mdi-view-dashboard-outline',
        title: 'Chip',
        to: '/components/custom/chip',
      },
      {
        icon: 'mdi-view-dashboard-outline',
        title: 'Dialog',
        to: '/components/custom/Dialog',
      },

      {
        icon: 'mdi-view-dashboard-outline',
        title: 'Info',
        to: '/components/custom/info',
      },
    ],
  },
  {
    title: 'Navigation',
    items: [
      {
        icon: 'mdi-view-dashboard-outline',
        title: 'Breadcrumbs',
        to: '/components/custom/breadcrumbs',
      },

      {
        icon: 'mdi-view-dashboard-outline',
        title: 'HorizontalBar',
        to: '/components/custom/horizontalBar',
      },

      {
        icon: 'mdi-view-dashboard-outline',
        title: 'Drawable',
        to: '/components/custom/Drawable',
      },

      {
        icon: 'mdi-view-dashboard-outline',
        title: 'Tabs',
        to: '/components/custom/tabs',
      },
      {
        icon: 'mdi-view-dashboard-outline',
        title: 'Header',
        to: '/components/custom/header',
      },
    ],
  },
];

const profileMenuItems = [
  {
    title: i18n.t('layouts.default.profile'),
    to: `/user/${user.value ? user.value.username : ''}`,
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
</script>

<style scoped lang="scss">
html,
body {
  overflow-y: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none;
  }

  .v-application {
    .item-name {
      color: #d2d6da;

      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 135%; /* 18.9px */
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
