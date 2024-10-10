<template>
  <v-app>
    <AppSnackbar />
    <alex-custom-drawable
      v-model="drawer"
      :blocks="menus"
      :clipped="clipped"
      dark
      :permanent="isPermanent"
      data-tour="step-user-area"
    >
      <template #header>
        <div class="my-4 w-100 d-flex" :class="clipped ? '' : 'justify-center'" style="max-height: 28px">
          <div>
            <NuxtLink to="/">
              <img v-if="clipped" src="public/images/alex-mini.svg" height="28" width="43" />
              <img v-else src="public/images/alex.svg" height="28" width="84" />
            </NuxtLink>
          </div>
        </div>
      </template>
    </alex-custom-drawable>

    <alex-custom-horizontal-bar
      :drawer="drawer"
      fixed
      :avatar="user?.avatar"
      :placeholder="user?.fullname"
      :menu-items="profileMenuItems"
      :track-current-user="userStore.isCurrentUser"
      show-picture
      @toggle:drawer="closeDrawable(!clipped)"
      @click="onClickOutside"
    />
    <v-main class="bg-gray-blue pt-16" @click="onClickOutside">
      <v-container class="pa-4 pa-sm-6 max-width-100">
        <alex-custom-header
          v-if="headerStore.showHeader"
          v-bind="headerStore.headerOptions"
          :loading="headerStore.isLoading"
          @main-action="headerStore.onMainAction"
          @secondary-action="headerStore.onSecondaryAction"
        />
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import useNavigationDrawer from '~/composables/useNavigationDrawer';
import { useMainHorizontalBar } from '~/composables/useMainHorizontalBar';

const router = useRouter();

router.beforeEach(() => {
  headerStore.showHeader = false;
  headerStore.onMainAction = null;
  headerStore.onSecondaryAction = null;
});

const user = useStrapiUser<User>();
const userStore = useUserStore();
const { clipped, drawer, isPermanent, closeDrawable, onClickOutside } = useNavigationDrawer();

const headerStore = usePageHeaderStore();

const { profileMenuItems } = useMainHorizontalBar();

onBeforeMount(() => {
  if (!userStore.user) return;
  userStore.user.avatar = user.value?.avatar;
  userStore.user.fullname = user.value?.fullname;
});

const adminMenus = [
  {
    title: 'Administrador',
    items: [
      {
        icon: 'mdi-view-dashboard-outline',
        title: 'Usuários',
        to: '/admin/users',
      },
      {
        icon: 'mdi-view-dashboard-outline',
        title: 'Lista de instituições',
        to: '/admin/institutions',
      },
    ],
  },
];

const menus = computed(() => {
  return adminMenus;
});
</script>

<style lang="scss">
.overflow-hidden {
  overflow-y: hidden;
}
.max-width-100 {
  max-width: 100%;
}
.shepherd-step {
  z-index: 100000 !important;
  background-color: #fff !important;
  border-radius: 8px !important;
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.15);
  padding: 16px !important;
  max-width: 300px !important;
}

.active-step {
  z-index: 200000 !important;
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

.shepherd-step .shepherd-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.shepherd-cancel-icon {
  font-size: 25px;
  height: 25px;
  width: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
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

.shepherd-step .shepherd-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.shepherd-cancel-icon {
  font-size: 25px;
  height: 25px;
  width: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.shepherd-step button {
  background-color: #00b7cc;
  padding: 0.5rem;
  border-radius: 0.5rem;
}

html,
body {
  .v-application {
    .item-name {
      color: #d2d6da;

      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 135%;
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
