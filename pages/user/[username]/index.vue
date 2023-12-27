<template>
  <div id="profile" class="w-100 d-flex overflow-x-hidden" v-if="user">
    <div v-if="canEdit" class="header d-flex w-100">
      <span class="title h-">{{ $t('pages.profile.title') }}</span>
    </div>
    <div v-else class="header d-flex w-100">
      <span class="title h-">{{ $t('pages.profile.learningPlans') }}</span>
      <div class="pages d-flex h-100">
        <NuxtLink to="/" class="text-decoration-none">
          <span class="go-back" style="cursor: pointer">{{
            $t('pages.profile.home')
          }}</span>
        </NuxtLink>
        <span class="go-back">></span>
        <span class="current-page">{{
          $t('pages.profile.learningPlans')
        }}</span>
      </div>
    </div>
    <alex-custom-banner
      :can-edit="canEdit"
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
      :links="links"
    />

    <div class="content-block d-flex justify-center flex-row w-100">
      <component
        :is="selectedComponent"
        :email="user.email"
        :phone="user.phone"
        :socials="user.socials"
        :institutions="user.institutions"
        :technicalTags="technicalTags"
        :generalTags="generalTags"
        :info="user.info"
        :user-id="user.id"
        :can-edit="canEdit"
        @update:user="(data) => updateUser(true, data ? data.message : data)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { TabType } from '@/components/alex/custom/Tabs.vue';
import { User } from '@/models/user.model';
const i18n = useI18n();
const { find, findOne } = useStrapi();

const route = useRoute();
const router = useRouter();
const messageStore = useMessageStore();
const canEdit = ref(false);
const showSettings = ref(false);

const generalTags = ref();
const technicalTags = ref();
const selectedOption = ref(0);

const user = ref<any>();
definePageMeta({
  middleware: 'auth',
});
const { id, username } = useStrapiUser<User>().value;

const selectedComponent = computed(() => {
  switch (selectedOption.value) {
    case 0:
      return resolveComponent('Profile-Components-General');
    case 1:
      return resolveComponent('Profile-Courses');
    case 2:
      return resolveComponent('Profile-Projects');
    case 3:
      return resolveComponent('Profile-Tasks');
    default:
      return resolveComponent('Profile-Events');
  }
});
onBeforeMount(async () => {
  await updateUser(false);
});
const links = computed<TabType[]>(() => [
  {
    label: i18n.t('pages.profile.general'),
    value: '0',
    to: `/user/${user.value.username}`,
  },
  { label: i18n.t('pages.profile.courses'), value: '1' },
  { label: i18n.t('pages.profile.projects'), value: '2' },
  { label: i18n.t('pages.profile.assignments'), value: '3' },
  { label: i18n.t('pages.profile.events'), value: '4' },
  {
    label: '',
    icon: 'mdi-cog-outline',
    value: '5',
    to: `/user/${user.value.username}/settings`,
  },
]);

const updateUser = async (show = true, message?) => {
  const populate = [
    'institutions.cover',
    'cover',
    'avatar',
    'learningPlans',
    'socials',
    'trails',
    'role',
    'tags',
    'user_descriptions',
    'user_wallet',
  ];
  if (username === route.params.username) {
    canEdit.value = true;
    user.value = await findOne<User>('users', id, {
      populate: populate,
    });
  } else {
    canEdit.value = false;
    user.value = (
      await find<User>('users', {
        filters: { username: route.params.username },
        populate: populate,
      })
    )[0];
  }

  if (!user.value) {
    router.push({ path: '/' });
  }

  generalTags.value = user.value.tags.filter((item) => item.isGeneral);
  technicalTags.value = user.value.tags.filter((item) => !item.isGeneral);

  messageStore.setMessage(message ?? 'done', 'green', show);
};

const selectOption = (index) => {
  selectedOption.value = index;
  showSettings.value = false;
};
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
