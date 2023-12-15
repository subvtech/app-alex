<template>
  <v-app>
    <AppSnackbar />
    <alex-custom-drawable
      v-model="drawer"
      :blocks="menus"
      :clipped="clipped"
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

    <alex-custom-horizontal-bar
      :drawer="drawer"
      fixed
      :toggle-drawer="() => closeDrawable(!clipped)"
      :avatar="user.avatar"
      :placeholder="user.fullname"
      @click="onClickOutside"
      :menu-items="profileMenuItems"
      show-picture
    />

    <v-main class="secondary bg-gray-blue pt-16" @click="onClickOutside">
      <v-container style="max-width: 100%" class="pa-4 pa-sm-6">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useMainHorizontalBar } from '~/composables/useMainHorizontalBar';
import useNavigationDrawer from '~/composables/useNavigationDrawer';

const user = useStrapiUser<User>();
const userStore = useUserStore();

const { profileMenuItems } = useMainHorizontalBar();

const { clipped, drawer, isPermanent, closeDrawable, onClickOutside } =
  useNavigationDrawer();

onBeforeMount(() => {
  userStore.profilePicture = user.value?.avatar;
  userStore.fullname = user.value?.fullname;
});

const menus = [
  {
    title: 'Custom',
    items: [
      {
        icon: 'mdi-account-circle',
        title: 'AppUserAvatar',
        to: '/components/custom/Appuseravatar',
      },
      {
        icon: 'mdi-view-dashboard-outline',
        title: 'Accordion',
        to: '/components/custom/Accordion',
      },
      {
        icon: 'mdi-view-dashboard-outline',
        title: 'Banner',
        to: '/components/custom/banner',
      },

      {
        icon: 'mdi-view-dashboard-outline',
        title: 'Button',
        to: '/components/custom/Button',
      },
      {
        icon: 'mdi-chip',
        title: 'Chip',
        to: '/components/custom/chip',
      },
      {
        icon: 'mdi-view-dashboard-outline',
        title: 'Dialog',
        to: '/components/custom/Dialog',
      },

      {
        icon: 'mdi-information-variant',
        title: 'Info',
        to: '/components/custom/info',
      },
    ],
  },
  {
    title: 'Navigation',
    items: [
      {
        icon: 'mdi-baguette',
        title: 'Breadcrumbs',
        to: '/components/custom/breadcrumbs',
      },
      {
        icon: 'mdi-view-dashboard-outline',
        title: 'Horizontalbar',
        to: '/components/custom/horizontalbar',
      },
      {
        icon: 'mdi-view-dashboard-outline',
        title: 'Drawable',
        to: '/components/custom/drawable',
      },
      {
        icon: 'mdi-book-open-page-variant',
        title: 'pagination',
        to: '/components/custom/pagination',
      },
      {
        icon: 'mdi-view-dashboard-outline',
        title: 'tabs',
        to: '/components/custom/tabs',
      },
    ],
  },
  {
    title: 'Input',
    items: [
      {
        icon: 'mdi-radio',
        title: 'Radio-button',
        to: '/components/inputs/radio-button',
      },
      {
        icon: 'mdi-card-text-outline',
        title: 'Text-field',
        to: '/components/inputs/text-field',
      },
      {
        icon: 'mdi-view-dashboard-outline',
        title: 'Card projetos e cursos',
        to: '/components/learning-plans/card',
      },
      {
        icon: 'mdi-view-dashboard-outline',
        title: 'Dropdown',
        to: '/components/inputs/dropdown',
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
