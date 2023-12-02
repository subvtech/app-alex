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
        <template #header>
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
const clipped = ref(false);
const drawer = ref(true);
const isPermanent = ref(false);
const user = useStrapiUser<User>();
const userStore = useUserStore();

const { profileMenuItems } = useMainHorizontalBar();

onBeforeMount(() => {
  userStore.profilePicture = user.value.avatar;
  userStore.fullname = user.value.fullname;
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
        title: 'Breadcrumbs',
        to: '/components/custom/breadcrumbs',
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
        title: 'Horizontalbar',
        to: '/components/custom/horizontalbar',
      },
      {
        icon: 'mdi-view-dashboard-outline',
        title: 'Info',
        to: '/components/custom/info',
      },
      {
        icon: 'mdi-view-dashboard-outline',
        title: 'Card projetos e cursos',
        to: '/components/learning-plans/card',
      },
    ],
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
