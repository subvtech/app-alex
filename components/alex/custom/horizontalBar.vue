<template>
  <v-app-bar app color="white" class="px-4" :class="[notFixed ? 'not-fixed' : '']" data-testid="horizontal-bar">
    <div
      class="d-flex w-100 align-center"
      :class="reverse ? 'flex-row-reverse' : ''"
      :role="reverse ? 'reversed' : ''"
    >
      <v-app-bar-nav-icon @click.stop="toggleDrawer" class="text-gray-900" />

      <v-spacer />
      <v-btn icon color="#6E7A87" @click="emit('chat')">
        <NuxtImg
          :src="
            isChatActive ? '/svg/chat-read-active.svg' : '/svg/chat-read.svg'
          "
          width="24"
          height="24"
          role="chat-active"
        />
      </v-btn>
      <v-btn icon color="grey" @click="emit('alert')" class="mr-2">
        <NuxtImg
          v-if="isBellActive"
          src="/svg/bell.svg"
          width="24"
          height="24"
          role="bell-active"
        />
        <v-icon v-else color="#6E7A87">mdi-bell-outline</v-icon>
      </v-btn>

      <v-menu offset-y nudge-bottom="10">
        <template #activator="{ props }">
          <v-hover v-slot="{ isHovering }">
            <div
              v-if="user"
              v-bind="props"
              class="user-block"
              :class="isHovering ? 'rounded-pill grey lighten-3' : ''"
            >
              <app-user-avatar
                :avatar-url="user.avatar ? user.avatar.url : user.avatar"
                :fullname="user.fullname"
                class="mr-2"
              />
              <span class="fullname mr-1" style="cursor: pointer">
                {{ user.fullname }}
              </span>

              <v-icon color="#6E7A87" style="cursor: pointer">
                mdi-chevron-down
              </v-icon>
            </div>
            <div
              v-else
              v-bind="props"
              class="user-block"
              :class="isHovering ? 'rounded-pill grey lighten-3' : ''"
            >
              <app-user-avatar :avatar-url="''" :fullname="''" class="mr-2" />
              <span class="fullname mr-1" style="cursor: pointer"> user </span>

              <v-icon color="#6E7A87" style="cursor: pointer">
                mdi-chevron-down
              </v-icon>
            </div>
          </v-hover>
        </template>
        <v-list v-if="menuItems">
          <v-list-item
            v-for="(item, index) in menuItems"
            :key="`profile-menu-item-${index}`"
            @click="onMenuClick(item.to ?? '/', item.logout)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>
<script setup lang="ts">
import { User } from '../../../models/user.model';

const { logout } = useStrapiAuth();
const emit = defineEmits(['alert', 'chat']);

const router = useRouter();

const props = defineProps({
  user: {
    type: Object as PropType<User>,
  },

  notFixed: {
    type: Boolean,
    default: false,
  },

  menuItems: {
    type: Array as PropType<{ title: string; to?: string; logout: boolean }[]>,
    default: [],
  },

  toggleDrawer: {
    type: Function as PropType<(payload: MouseEvent) => void>,
    default: () => {},
  },

  isBellActive: {
    type: Boolean,
    default: false,
  },

  isChatActive: {
    type: Boolean,
    default: false,
  },
  reverse: {
    type: Boolean,
    default: false,
  },
});

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
    font-family: Sen !important;

    .v-navigation-drawer__content {
      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none; /* Firefox */
      gap: 24px;
      display: flex;
      flex-direction: column;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .subheader {
      color: #00b7cc;
      padding-left: 16px;
      padding-right: 8px;

      /* Body/P6 */
      font-size: 12px;
      font-weight: 700;
      line-height: 135%; /* 16.2px */
      letter-spacing: 0.48px;
    }

    .item-name {
      color: #d2d6da;

      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 135%; /* 18.9px */
      letter-spacing: 0.56px;
    }
    .v-toolbar__content {
      .user-block {
        min-width: 72px;
        .fullname {
          color: #6e7a87;

          font-size: 16px;
          font-weight: 400;
          letter-spacing: 0.32px;
          vertical-align: middle;
        }
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

.not-fixed {
  position: static !important;
  top: unset !important;
  transform: none !important;
}
</style>
