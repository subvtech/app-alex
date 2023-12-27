<template>
  <div id="profile" class="w-100 d-flex overflow-x-hidden">
    <alex-custom-breadcrumbs
      v-if="canEdit"
      :title="$t('pages.profile.title')"
    />

    <alex-custom-breadcrumbs
      v-else
      :title="$t('pages.profile.learningPlans')"
      :items="breadCrumbs"
    />

    <alex-custom-banner
      :can-edit="canEdit"
      :cover-picture="cover"
      :profile-picture-size="160"
      :profile-picture="avatar"
      :userId="id"
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
      :is-professor="isProfessor"
      :fullname="fullname"
      fullnameStyle="color: #454D54;"
      :username="username"
      usernameStyle="color: #A0A8B1;"
      roleStyle="color: #A0A8B1;"
      :links="canEdit ? links : links.slice(0, -1)"
    />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { TabType } from '~/components/alex/custom/Tabs.vue';
const i18n = useI18n();
const { updateUser } = useUpdateStrapi();

definePageMeta({
  middleware: 'auth',
});

await updateUser(false);
const userStore = useUserStore();
const {
  email,
  phone,
  socials,
  username,
  id,
  fullname,
  cover,
  avatar,
  isProfessor,
  institutions,
  tags,
  info,
  canEdit,
} = toRefs(userStore);

const showSettings = ref(true);

const update = async (data) => {
  const userResponse = await updateUser(true, data ? data.message : data);
};

const selectedOption = ref(0);

const selectOption = (index) => {
  selectedOption.value = index;
  showSettings.value = false;
};

const breadCrumbs = [
  { disabled: false, title: i18n.t('pages.profile.home'), href: '/' },
  { disabled: false, title: i18n.t('pages.profile.learningPlans'), href: '/' },
];

const links = computed<TabType[]>(() => [
  {
    label: i18n.t('pages.profile.general'),
    value: '0',
    to: `/users/${username.value}`,
  },
  {
    label: i18n.t('pages.profile.courses'),
    value: '1',
    to: `/users/${username.value}/courses`,
  },
  {
    label: i18n.t('pages.profile.projects'),
    value: '2',
    to: `/users/${username.value}/projects`,
  },
  {
    label: i18n.t('pages.profile.assignments'),
    value: '3',
    to: `/users/${username.value}/assignments`,
  },
  {
    label: i18n.t('pages.profile.events'),
    value: '4',
    to: `/users/${username.value}/events`,
  },
  {
    label: '',
    icon: 'mdi-cog-outline',
    value: '5',
    to: `/users/${username.value}/settings`,
  },
]);
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
