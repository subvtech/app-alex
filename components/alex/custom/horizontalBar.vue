<template>
  <v-app-bar
    app
    color="white"
    class="px-4"
    :class="[notFixed ? 'not-fixed' : '']"
    data-testid="horizontal-bar"
    style="min-width: max-content"
  >
    <div
      class="d-flex w-100 align-center"
      :class="reverse ? 'flex-row-reverse' : ''"
      :role="reverse ? 'reversed' : ''"
    >
      <v-app-bar-nav-icon
        class="text-gray-900"
        @click.stop="emit('toggle:drawer')"
      />

      <v-spacer />

      <div :class="[reverse ? 'ml-4' : 'mr-4']">
        <v-btn icon color="#6E7A87" @click="emit('chat')">
          <img
            :src="
              isChatActive
                ? 'public/svg/chat-read-active.svg'
                : 'public/svg/chat-read.svg'
            "
            width="24"
            height="24"
            role="chat-active"
          />
        </v-btn>
        <v-btn icon color="grey" @click="emit('alert')">
          <img
            v-if="isBellActive"
            src="public/svg/bell.svg"
            width="24"
            height="24"
            role="bell-active"
          />
          <v-icon v-else color="#6E7A87">mdi-bell-outline</v-icon>
        </v-btn>
      </div>

      <v-menu offset-y nudge-bottom="10">
        <template #activator="{ props }">
          <v-hover v-slot="{ isHovering }">
            <div
              v-if="avatar && showPicture"
              v-bind="props"
              class="user-block"
              :class="isHovering ? 'rounded-pill grey lighten-3' : ''"
            >
              <app-user-avatar
                :profile-picture="avatar"
                :placeholder="computedPlaceholder"
                :size="pictureSize"
                :track-current-user="trackCurrentUser"
                show-border
                avatar-style="border: 1px solid #A0A8B1;"
                class="mr-2"
              />

              <span class="placeholder mr-1" style="cursor: pointer">
                {{ computedPlaceholder }}
              </span>

              <v-icon color="#6E7A87" style="cursor: pointer">
                mdi-chevron-down
              </v-icon>
            </div>
            <div
              v-else-if="showPicture"
              v-bind="props"
              class="user-block"
              :class="isHovering ? 'rounded-pill grey lighten-3' : ''"
            >
              <app-user-avatar
                :placeholder="computedPlaceholder"
                :size="pictureSize"
                :track-current-user="trackCurrentUser"
                class="mr-2"
              />
              <span class="placeholder mr-1" style="cursor: pointer">
                {{ computedPlaceholder }}
              </span>

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
            @click="
              item.to
                ? router.push({ path: item.to })
                : item.action
                ? item.action()
                : () => {}
            "
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>
<script setup lang="ts">
/*
  This component is meant to be used on the main screen as a horizontal Menu,
   it's also suitable for use inside smaller components.
*/
import { type ProfilePictureItemType } from '../../AppUserAvatar.vue';

export interface HorizontalBarEmits {
  (e: 'alert'): void; // click on the alert button
  (e: 'chat'): void; // click on the chat button
  (e: 'toggle:drawer'): void; // click on the main button to change the drawer state
}

export interface HorizontalBarMenuItemType {
  title: string;
  to?: string;
  action?: () => void;
}

export interface HorizontalBarComponentType {
  avatar?: ProfilePictureItemType;
  placeholder?: string;
  notFixed?: boolean;
  menuItems: HorizontalBarMenuItemType[];
  isBellActive?: boolean;
  isChatActive?: boolean;
  reverse?: boolean;
  showPicture?: boolean;
  pictureSize?: number;
  trackCurrentUser?: boolean;
}

const userStore = useUserStore();
const emit = defineEmits<HorizontalBarEmits>();
const placeholderFallback = 'user';
const router = useRouter();

const props = withDefaults(defineProps<HorizontalBarComponentType>(), {
  avatar: undefined,
  placeholder: undefined,
  notFixed: false,
  menuItems: () => [],
  isBellActive: false,
  isChatActive: false,
  reverse: false,
  showPicture: false,
  pictureSize: 40,
  trackCurrentUser: false,
});

const computedPlaceholder = computed(() =>
  props.trackCurrentUser && userStore.user
    ? userStore.user?.fullname
    : props.placeholder
    ? props.placeholder
    : placeholderFallback,
);
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
        display: flex;
        align-items: center;
        .placeholder {
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
          .placeholder {
            display: none;
          }
        }
      }
    }
  }
}

.d-flex.w-100.align-center {
  .v-btn {
    width: 44px;
    height: 44px;
  }
}
.not-fixed {
  position: static !important;
  top: unset !important;
  transform: none !important;
}
</style>
