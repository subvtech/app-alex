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
      :can-edit="isCurrentUser"
      :cover-picture="user.cover"
      :profile-picture-size="160"
      :profile-picture="user.avatar"
      :user-id="user.id"
      can-delete
      show-menu
      settings-menu
      :show-settings="isCurrentUser"
      :settings="settingsTab"
      show-profile-picture
      show-role
      show-border
      float-beneath
      distribution="fullname-username-role"
      :selected-option="selectedOption"
      :is-professor="user.isProfessor"
      :fullname="user.fullname"
      fullname-style="color: #454D54;"
      :username="user.username"
      username-style="color: #A0A8B1;"
      role-style="color: #A0A8B1;"
      :links="isCurrentUser ? links : links.slice(0, -1)"
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

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { TabType } from '~/components/alex/custom/Tabs.vue';
const i18n = useI18n();
const route = useRoute();
const router = useRouter();

definePageMeta({
  middleware: 'auth',
});

const userStore = useUserStore();
const { user, isCurrentUser } = toRefs(userStore);
await userStore.loadUser(route.params.username as string, '', false);
if (!user.value) router.push('/');

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
  {
    disabled: false,
    title: user.value?.username || i18n.t('pages.profile.title2'),
    href: `/users/${user.value?.username}`,
  },
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

<style scoped lang="scss"></style>
