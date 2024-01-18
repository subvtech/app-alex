<template>
  <div v-if="user" id="profile" class="w-100 d-flex overflow-x-hidden">
    <alex-custom-breadcrumbs
      v-if="isCurrentUser"
      :title="$t('pages.profile.title')"
    />

    <alex-custom-breadcrumbs
      v-else
      :title="$t('pages.profile.learningPlans')"
      :items="breadCrumbs"
    />

    <alex-custom-banner
      :can-edit="isCurrentUser"
      :cover-picture="user.cover"
      :profile-picture-size="160"
      :profile-picture="user.avatar"
      :userId="user.id"
      can-delete
      show-menu
      settings-menu
      show-settings
      show-profile-picture
      show-role
      show-border
      float-beneath
      distribution="fullname-username-role"
      :selectedOption="selectedOption"
      @select:option="selectOption"
      @display:settings="showSettings = !showSettings"
      :is-professor="user.isProfessor"
      :fullname="user.fullname"
      fullnameStyle="color: #454D54;"
      :username="user.username"
      usernameStyle="color: #A0A8B1;"
      roleStyle="color: #A0A8B1;"
      :links="isCurrentUser ? links : links.slice(0, -1)"
    />

    <NuxtPage
      :user="user"
      :can-edit="isCurrentUser"
      @update="
        async (data, message) => await userStore.updateUser(data, message)
      "
      @load="
        async (data) =>
          await userStore.loadUserGraphql(
            route.params.username as string,
            data.query,
            data.message,
          )
      "
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { TabType } from '~/components/alex/custom/Tabs.vue';
const i18n = useI18n();
const route = useRoute();

const { id } = useStrapiUser<User>().value;
definePageMeta({
  middleware: 'auth',
});

const userStore = useUserStore();
const { user, isCurrentUser } = toRefs(userStore);

await userStore.loadUser(route.params.username as string, '', false);
const showSettings = ref(true);

const selectedOption = ref(0);

const selectOption = (index) => {
  selectedOption.value = index;
  showSettings.value = false;
};
const fetchData = async () => {
  await useAsyncData('loadedUser', () =>
    userStore.loadUser(route.params.username as string, '', false),
  );

  if (!user.value) {
    navigateTo('/');
  }
};

await fetchData();

const breadCrumbs = [
  { disabled: false, title: i18n.t('pages.profile.home'), href: '/' },
  { disabled: false, title: i18n.t('pages.profile.learningPlans'), href: '/' },
];

const links = computed<TabType[]>(() => {
  const username = user?.value?.username;
  return [
    {
      label: i18n.t('pages.profile.general'),
      value: '0',
      to: `/users/${username}`,
    },
    {
      label: i18n.t('pages.profile.courses'),
      value: '1',
      to: `/users/${username}/courses`,
    },
    {
      label: i18n.t('pages.profile.projects'),
      value: '2',
      to: `/users/${username}/projects`,
    },
    {
      label: i18n.t('pages.profile.assignments'),
      value: '3',
      to: `/users/${username}/tasks`,
    },
    {
      label: i18n.t('pages.profile.events'),
      value: '4',
      to: `/users/${username}/events`,
    },
    {
      label: '',
      icon: 'mdi-cog-outline',
      value: '5',
      to: `/users/${username}/settings`,
    },
  ];
});
</script>

<style scoped lang="scss">
#profile {
  flex-direction: column;
  font-family: 'Sen';
  height: 100%;

  .header {
    justify-content: flex-start;
    align-items: center;
    align-self: stretch;
    height: 44px;

    .title {
      color: #5d6872;
      font-size: 24px;
      font-weight: bold;
      line-height: 28px;
      padding-right: 16px;
    }

    .pages {
      padding-left: 16px;
      gap: 12px;
      align-items: center;
      border-left: 1px solid #e1e4e7;
      .go-back {
        color: #abb2b9;
        font-size: 14px;
        font-weight: 400;
        line-height: normal;
      }

      .current-page {
        color: #5d6872;
        font-size: 14px;
        font-weight: 400;
        line-height: normal;
      }
    }
  }

  .content-block {
    gap: 24px;
    flex-direction: row;
  }

  @media (max-width: 1410px) {
    .competences {
      flex-direction: column;
    }
  }

  @media (max-width: 800px) {
    .content-block {
      flex-wrap: wrap;
    }
    .details {
      max-width: none;
    }
  }
}
</style>
