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

    <alex-custom-horizontal-bar
      :drawer="drawer"
      fixed
      :toggle-drawer="() => closeDrawable(!clipped)"
      :avatar="user.avatar"
      :placeholder="user.fullname"
      :menu-items="profileMenuItems"
      show-picture
      @click="onClickOutside"
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
import vuefiles from '~/assets/vueFiles.json';

const user = useStrapiUser<User>();

const { profileMenuItems } = useMainHorizontalBar();

const { clipped, drawer, isPermanent, closeDrawable, onClickOutside } =
  useNavigationDrawer();

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
  const capitaliseString = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);
  // Map each group to the desired output format
  const output = Object.entries(groups).map(([title, items]) => ({
    title: capitaliseString(title),
    items: (items as any[]).map((item) => ({
      icon: 'mdi-view-dashboard-outline',
      title: capitaliseString(
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
