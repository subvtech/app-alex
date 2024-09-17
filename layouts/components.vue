<template>
  <v-app class="tw-relative">
    <app-snackbar />
    <alex-custom-sidebar
      v-model="drawer"
      v-model:clipped="clipped"
      :blocks="menus"
      :is-permanent="isPermanent"
    />

    <alex-custom-horizontal-bar
      :drawer="drawer"
      fixed
      :class="
        clipped ? 'clipped-sidebar main-header-app' : 'sidebar main-header-app'
      "
      :avatar="user?.avatar"
      :placeholder="user?.fullname"
      :menu-items="profileMenuItems"
      :track-current-user="userStore.isCurrentUser"
      show-picture
      @toggle:drawer="closeDrawable(!clipped)"
    />

    <v-main
      class="bg-gray-blue pt-16"
      :class="clipped ? 'clipped-sidebar' : 'sidebar'"
    >
      <v-container class="pa-4 pa-sm-6 max-width-100">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useMainHorizontalBar } from '~/composables/useMainHorizontalBar';
import useNavigationDrawer from '~/composables/useNavigationDrawer';
import vuefiles from '~/assets/vueFiles.json';

const { profileMenuItems } = useMainHorizontalBar();

const { clipped, drawer, isPermanent, closeDrawable } = useNavigationDrawer();
const user = useStrapiUser<User>();
const userStore = useUserStore();

const icons = [
  'mdi-account-circle',
  'mdi-book',
  'mdi-briefcase',
  'mdi-image-area',
  'mdi-view-dashboard-outline',
  'mdi-view-carousel',
  'mdi-chip',
  'mdi-calendar-blank',
  'mdi-image-filter-center-focus-weak',
  'mdi-information-variant',
  'mdi-cards-heart',
  'mdi-tooltip',
  'mdi-chart-tree',
  'mdi-chart-line-stacked',
  'mdi-chart-pie',
  'mdi-chart-box',
  'mdi-chart-box-outline',
  'mdi-checkbook',
  'mdi-checkerboard',
  'mdi-clipboard-text-outline',
  'mdi-clipboard-text',
  'mdi-code-equal',
  'mdi-credit-card',
  'mdi-bitcoin',
  'mdi-alert-box',
  'mdi-baguette',
];

function getRandomIcon(): string {
  const randomIndex = Math.floor(Math.random() * icons.length);
  return icons[randomIndex];
}

const menus = computed(() => {
  // Group input objects by the first element of the 'namespaces' array
  const groups = vuefiles.reduce((acc, obj) => {
    const key = obj.namespaces[0];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});

  // Map each group to the desired output format
  const output = Object.entries(groups).map(([title, items]) => ({
    title: capitalize(title),
    items: (items as any[]).map((item) => ({
      icon: getRandomIcon(),
      title: capitalize(
        item.namespaces[item.namespaces.length - 1] === 'index'
          ? item.namespaces[item.namespaces.length - 2]
          : item.namespaces[item.namespaces.length - 1],
      ),
      to: `/components/${item.namespaces.join('/').toLowerCase()}`,
    })),
  }));

  return output;
});
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
