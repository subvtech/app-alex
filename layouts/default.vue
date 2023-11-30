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
        :data-tour="menus[0].dataTour"
        :class="{ 'active-step': menus[0].dataTour !== '' && isTourActive }"
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
      :toggle-drawer="
        () => {
          drawer = !drawer;
        }
      "
      :menu-items="profileMenuItems"
      :data-tour="profileMenuItems[0].dataTour"
      :class="{
        'active-step': profileMenuItems[0].dataTour !== '' && isTourActive,
      }"
      :reverse="false"
      :user="user"
      show-picture
    />

    <v-main class="secondary bg-gray-blue pt-16">
      <v-container style="max-width: 100%" class="pa-4 pa-sm-6">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useOnBoarding } from '@/composables/useOnBoarding';
const i18n = useI18n();
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

const steps = [
  {
    id: 'step1',
    title: i18n.t('layouts.default.step1.title'),
    text: i18n.t('layouts.default.step1.text'),
    attachTo: {
      element: '[data-tour="step-user-area"]',
      on: 'right',
    },
    buttons: [
      {
        text: i18n.t('layouts.default.step1.nextButton'),
        action: 'next',
      },
    ],
  },
  {
    id: 'step2',
    title: i18n.t('layouts.default.step2.title'),
    text: i18n.t('layouts.default.step2.text'),
    attachTo: {
      element: '[data-tour="step-user-area"]',
      on: 'right',
    },
    buttons: [
      {
        text: i18n.t('layouts.default.step2.backButton'),
        action: 'back',
      },
      {
        text: i18n.t('layouts.default.step2.nextButton'),
        action: 'next',
      },
    ],
  },
  {
    id: 'step3',
    title: i18n.t('layouts.default.step3.title'),
    text: i18n.t('layouts.default.step3.text'),
    attachTo: {
      element: '[data-tour="step-navigation"]',
      on: 'right',
    },
    buttons: [
      {
        text: i18n.t('layouts.default.step3.backButton'),
        action: 'back',
      },
      {
        text: i18n.t('layouts.default.step3.nextButton'),
        action: 'next',
      },
    ],
  },
  {
    id: 'step4',
    title: i18n.t('layouts.default.step4.title'),
    text: i18n.t('layouts.default.step4.text'),
    attachTo: {
      element: '[data-tour="step-professor"]',
      on: 'bottom',
    },
    buttons: [
      {
        text: i18n.t('layouts.default.step4.backButton'),
        action: 'back',
      },
      {
        text: i18n.t('layouts.default.step4.nextButton'),
        action: 'next',
      },
    ],
  },
  {
    id: 'step5',
    title: i18n.t('layouts.default.step5.title'),
    text: i18n.t('layouts.default.step5.text'),
    attachTo: {
      element: '[data-tour="step-profile"]',
      on: 'bottom',
    },
    buttons: [
      {
        text: i18n.t('layouts.default.step5.backButton'),
        action: 'back',
      },
      {
        text: i18n.t('layouts.default.step5.nextButton'),
        action: 'next',
      },
    ],
  },
  {
    id: 'step6',
    title: i18n.t('layouts.default.step6.title'),
    text: i18n.t('layouts.default.step6.text'),
    attachTo: {
      element: '',
      on: 'center',
    },
    buttons: [
      {
        text: i18n.t('layouts.default.step6.backButton'),
        action: 'back',
      },
      {
        text: i18n.t('layouts.default.step6.completeButton'),
        action: 'complete',
      },
    ],
  },
];

const { tour, isTourActive } = useOnBoarding(steps);

const menus = [
  {
    title: i18n.t('layouts.default.userArea'),
    dataTour: 'step-user-area',
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
        dataTour: 'step-navigation',
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
    dataTour: 'step-professor',
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

const miniVariant = ref(false);
</script>

<style lang="scss">

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
