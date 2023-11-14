<template>
  <v-app v-if="user">
    <AppSnackbar />
    <div
      @click.stop="
        (e: any) => {
          drawer = !drawer;
        }
      "
    >
      <alex-custom-drawable
        :blocks="menus"
        :clipped="clipped"
        :show="drawer"
        dark
        :permanent="isPermanent"
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
    </div>
    <alex-custom-horizontal-bar
      :drawer="drawer"
      fixed
      :toggle-drawer="() => (drawer = !drawer)"
      :menu-items="profileMenuItems"
      :reverse="false"
      :user="user"
    />

    <v-main class="secondary bg-gray-blue pt-16">
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
const isPermanent = ref(false);
const user = useStrapiUser<User>();
const userStore = useUserStore();

onBeforeMount(() => {
  userStore.profilePicture = user.value.avatar;
  userStore.fullname = user.value.fullname;
});

const menus = [
  {
    title: i18n.t('layouts.default.userArea'),
    items: [
      {
        icon: 'mdi-view-dashboard-outline',
        title: i18n.t('layouts.default.dashboard'),
        to: '/dashboard',
      },
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
    title: i18n.t('layouts.default.professorTitle'),
    dataTour: '',
    items: [
      {
        icon: 'mdi-account-multiple-outline',
        title: i18n.t('layouts.default.userList'),
        to: '/classes',
      },
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
    to: `/user/${user.value.username}`,
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

.shepherd-step button {
  background-color: #00b7cc;
  padding: 0.5rem;
  border-radius: 0.5rem;
}
</style>
