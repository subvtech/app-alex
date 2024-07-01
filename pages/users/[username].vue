<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { TabType } from '~/components/alex/custom/Tabs.vue';

definePageMeta({
  middleware: 'auth',
});

const i18n = useI18n();
const route = useRoute();
const router = useRouter();

const { $trpc } = useNuxtApp();
const { session } = useAuth();
const userStore = useUserStore();

const user = $trpc.users.getBy.useQuery({
  field: 'username',
  value: route.params.username as string,
});

const isCurrentUser = computed(() => {
  return session.value?.user?.username === route.params.username;
});

await userStore.loadUser(route.params.username as string, '', false);

if (user.status.value !== 'pending' && !user.data.value) {
  router.push('/');
}

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

  if (!user.data.value) {
    navigateTo('/');
  }
};

await fetchData();

const breadCrumbs = [
  { disabled: false, title: i18n.t('pages.profile.home'), href: '/' },
  {
    disabled: false,
    title: user.data.value?.username || i18n.t('pages.profile.title2'),
    href: `/users/${user.data.value?.username}`,
  },
];

const links = computed<TabType[]>(() => {
  const username = user.data.value?.username;

  return [
    {
      label: i18n.t('pages.profile.general'),
      value: '0',
      to: `/users/${username}`,
    },
    {
      label: '',
      icon: 'mdi-cog-outline',
      value: 1,
      to: `/users/${username}/settings`,
      classes: 'ml-auto',
    },
  ];
});

const settingsTab = {
  label: '',
  icon: 'mdi-cog-outline',
  value: '5',
  to: `/users/${route.params.username}/settings`,
};
</script>

<template>
  <div
    v-if="user"
    id="profile"
    class="w-100 d-flex flex-column h-100 overflow-x-hidden"
  >
    <alex-custom-breadcrumbs
      v-if="isCurrentUser"
      :title="$t('pages.profile.title')"
    />
    <alex-custom-breadcrumbs
      v-else
      :title="$t('pages.profile.title2')"
      :items="breadCrumbs"
    />
    <alex-custom-banner
      can-delete
      float-beneath
      settings-menu
      show-menu
      show-profile-picture
      show-role
      show-border
      distribution="fullname-username-role"
      fullname-style="color: #454D54;"
      role-style="color: #A0A8B1;"
      username-style="color: #A0A8B1;"
      :can-edit="isCurrentUser"
      :cover-picture="user.data.value?.cover"
      :fullname="user.data.value?.name"
      :is-professor="user.data.value?.isProfessor"
      :links="isCurrentUser ? links : links.slice(0, -1)"
      :profile-picture-size="160"
      :profile-picture="user.data.value?.avatar"
      :selected-option="selectedOption"
      :settings="settingsTab"
      :show-settings="isCurrentUser"
      :user-id="user.data.value?.id"
      :username="user.data.value?.username"
      @select:option="selectOption"
      @display:settings="showSettings = !showSettings"
    />
    <NuxtPage
      :user="user"
      :can-edit="isCurrentUser"
      :active-learning-plans="userStore.activeLearningPlans"
      :active-tasks="userStore.activeTasks"
      :update-socials="userStore.loadUserSocials"
      :update-competences="userStore.loadUserTags"
      :update-institutions="userStore.loadUserInstitutions"
      :loading="userStore.loading"
      @update="
        async (data, populateArray, message) =>
          await userStore.updateUser(data, populateArray, message)
      "
    />
  </div>
</template>
