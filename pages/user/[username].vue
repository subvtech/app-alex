<template>
  <div id="profile" class="w-100 d-flex" v-if="user">
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
    <alex-banner
      :can-edit="canEdit"
      :cover-picture="user.cover"
      :profile-picture="user.avatar"
      :userId="user.id"
      :selectedOption="selectedOption"
      @selected:option="
        (index) => {
          selectedOption = index;
        }
      "
      @display:settings="showSettings = !showSettings"
      :is-professor="user.isProfessor"
      :fullname="user.fullname"
      :username="user.username"
      :links="links"
    />
    <div
      v-if="showSettings && canEdit"
      class="content-block d-flex justify-center flex-row"
    >
      <profile-settings
        :email="user.email"
        :cpf="user.cpf"
        :telephone="user.phone"
        :fullname="user.fullname"
        :id="user.id"
      />
    </div>

    <div v-else class="content-block d-flex justify-center flex-row w-100">
      <component
        :is="selectedComponent"
        :url="user.avatar ? user.avatar.url : undefined"
        :email="user.email"
        :phone="user.phone"
        :socials="user.socials"
        :institutions="user.institutions"
        :technicalTags="technicalTags"
        :generalTags="generalTags"
        :info="user.user_descriptions"
        :user-id="user.id"
        :can-edit="canEdit"
        @update:user="updateUser"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { User } from '../../models/user.model';
import { useI18n } from 'vue-i18n';
const i18n = useI18n();
const { find, findOne } = useStrapi();

const route = useRoute();
const router = useRouter();
const messageStore = useMessageStore();
const profilePicture = ref<string | null>(null);
const coverPicture = ref<string | null>(null);
const canEdit = ref(false);
const showSettings = ref(false);

const generalTags = ref();
const technicalTags = ref();
const selectedOption = ref(0);
const links = ref([
  i18n.t('pages.profile.general'),
  i18n.t('pages.profile.courses'),
  i18n.t('pages.profile.projects'),
  i18n.t('pages.profile.assignments'),
  i18n.t('pages.profile.events'),
]);

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

const updateUser = async (show = true) => {
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

  console.log({ user: user.value });

  generalTags.value = user.value.tags.filter((item) => item.isGeneral);
  technicalTags.value = user.value.tags.filter((item) => !item.isGeneral);

  if (user.value.avatar) profilePicture.value = user.value.avatar.url;
  if (user.value.cover) coverPicture.value = user.value.cover.url;
  messageStore.message = 'done';
  messageStore.color = 'green';
  messageStore.show = show;
};
</script>

<style lang="scss">
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

  .user-block {
    background-color: white;
    box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.08);
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 0px;
    transition: all ease-in-out 1s;

    .card {
      display: flex;
      flex-direction: row;
      position: relative;
      width: 100%;
      transition: all ease-in-out 1s;
      gap: 12px;

      .hover {
        .avatar {
          &:hover {
            i {
              display: flex !important;
              position: absolute;
            }

            .img {
              filter: brightness(50%);
              i {
                display: none !important;
              }
            }
          }
        }
      }

      .photo {
        display: flex;
        position: absolute;
        bottom: 0px;
        transition: all ease-in-out 1s;

        .avatar {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          border: solid #fff;
          border-radius: 100%;

          i {
            transition: all ease-in-out 0.7s;
          }
          .img {
            aspect-ratio: 1 / 1; /* defining the aspect ratio of the image */
            object-fit: cover;
          }

          .img {
            max-width: 160px;
            max-height: 160px;

            border-top-left-radius: 4px;
            border-top-right-radius: 4px;

            transition: all ease-in-out 0.4s;
            border-radius: 100%;
          }
          div.img {
            position: relative;
            background-color: #ebedef;
            width: 160px;
            height: 160px;
            i {
              display: flex !important;
              position: absolute;
            }
          }
        }

        .delete {
          right: 0px;
          bottom: 32px;

          position: absolute;

          border-radius: 8px;

          max-width: 28px;
          max-height: 28px;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;

          background: #e9494a;
          cursor: pointer;
          .small-icon {
            display: none;
          }

          i {
            display: flex;
            justify-content: center;
            align-items: center;
            vertical-align: middle;
          }
        }
      }

      .info {
        display: flex;
        flex-direction: column;
        margin-block: 16px;
        margin-left: 170px;
        padding-left: 16px;
        transition: all ease-in-out 1s;

        .d-flex {
          gap: 8px;
          .fullname {
            color: #0d4173;
            font-size: 24px;
            font-style: normal;
            font-weight: bold;
            line-height: 28px;
          }

          .social {
            color: #abb2b9;
            font-size: 24px;
            font-weight: 400;
            line-height: 28px;
          }
        }

        .role {
          color: #abb2b9;
          font-size: 18px;
          font-weight: bold;

          line-height: 22px;
        }
      }
    }
    .cover-block {
      position: relative;
      .cover {
        width: 100%;
        height: auto;
        max-height: 300px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        object-fit: cover;
        aspect-ratio: 1 / 1;
      }

      .edit-cover {
        gap: 16px;
        position: absolute;
        bottom: 24px;
        right: 20px;
        .btn.label {
          width: 153px;

          border-radius: 8px;
          border: none;
          color: #6e7a87 !important;
          height: 44px;
          background-color: #f1f5f9;
          text-transform: none !important;

          p {
            font-size: 14px;
            margin-left: 8px;
            letter-spacing: 0.56px;
          }
        }
        .btn.label.small {
          width: 44px;
          height: 44px;
          display: none;
        }
        .btn.remove {
          width: 44px;
          height: 44px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f1f5f9;
          border-radius: 8px;
          border: none;
          cursor: pointer;

          .small-icon {
            display: none;
          }
        }
      }
    }
    .menu {
      border-top: 1px solid #eaeef1;
      gap: 24px;
      padding-inline: 24px;
      transition: all ease-in-out 1s;
      align-items: center;

      span {
        color: #5d6872;
        font-size: 16px;
        font-weight: 400;
        line-height: 22px;
        cursor: pointer;
        padding-block: 16px;
        text-align: center;
        &:hover {
          color: #279ee3;
        }
      }

      .selected {
        color: #279ee3;
        border-bottom: 2px solid #279ee3;
      }
    }
  }

  .content-block {
    gap: 24px;
    flex-direction: row;
  }

  .details {
    max-width: 450px;
    gap: 24px;
  }

  @media (max-width: 1410px) {
    .competences {
      flex-direction: column;
    }
  }

  @media (max-width: 1200px) {
    .user-block {
      .card {
        margin-top: -2px;
        .photo {
          bottom: 15px;
          .avatar {
            .img {
              max-width: 120px;
              max-height: 120px;
            }
          }
          .delete {
            bottom: 15px;
            width: 24px;
            height: 24px;

            .small-icon {
              display: flex;
            }
            .normal-icon {
              display: none;
              visibility: hidden;
            }

            i {
              display: flex;
              justify-content: center;
              align-items: center;
              vertical-align: middle;
            }
          }
        }

        .info {
          margin-left: 130px;
          margin-block: 11px;
          .d-flex {
            gap: 8px;
            .fullname {
              font-size: 20px;
              font-style: normal;
              font-weight: bold;
              line-height: 28px;
            }

            .social {
              color: #abb2b9;
              font-size: 20px;
              font-weight: 400;
              line-height: 28px;
            }
          }
          .role {
            font-size: 14px;
          }
        }
      }
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
  @media (min-width: 400px) {
    .cover-block {
      .edit-cover {
        .btn.label {
          width: 153px !important;
        }
      }
    }
  }
  @media (max-height: 740px) {
    .user-block {
      .cover-block {
        .edit-cover {
          .btn {
            height: 33px !important;
          }
          .btn.remove {
            width: 33px !important;
          }
          .btn.label {
            width: 153px !important;
          }
          .btn.label.small {
            width: 33px !important;
          }
        }
      }
      .card {
        .photo {
          bottom: 20px;
        }
      }
    }
  }

  @media (max-width: 640px) {
    .user-block {
      .cover-block {
        position: relative;
        .img {
          width: 100%;
          height: auto;
          max-width: 100%;
          max-height: 300px;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }

        .edit-cover {
          min-width: 100px;
        }

        p {
          font-size: 12px;
        }
      }

      .card {
        .info {
          margin-left: 105px;
        }
        .photo {
          bottom: 22px;
          .avatar {
            .img {
              max-width: 100px;
              max-height: 100px;
            }
          }
          .delete {
            right: 0px;
            bottom: 22px;

            width: 20px;
            height: 20px;
            i {
              display: flex;
              justify-content: center;
              align-items: center;
              vertical-align: middle;
            }
          }
        }
      }
      .menu {
        gap: 16px;
        :first-child {
          min-width: 73px;
        }
      }
    }
  }

  @media (max-width: 608px) {
    .user-block {
      .menu {
        gap: 24px;
        overflow-x: auto;
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
        &::-webkit-scrollbar {
          display: none;
        }
      }
    }
  }

  @media (max-width: 450px) {
    .user-block {
      .card {
        .photo {
          bottom: 50px;
        }
        .info {
          padding-left: 10px;
          justify-content: space-between;
          flex-direction: column;

          .d-flex {
            gap: 0px;
            flex-direction: column;
          }

          .fullname {
            font-size: 20px;
            font-style: normal;
            font-weight: bold;
            line-height: 28px;
          }

          .social {
            color: #abb2b9;
            font-size: 20px;
            font-weight: 400;
            line-height: 28px;
          }
        }
      }
    }
  }

  @media (max-width: 400px) {
    .user-block {
      .cover-block {
        .edit-cover {
          .btn.label {
            display: none;
          }
          .btn.label.small {
            display: block;
          }
        }
      }
      .card {
        .info {
          width: 100%;
          margin-left: 0px;

          justify-content: space-between;
          flex-direction: row;

          :first-child {
            flex-direction: column;
            gap: 0px;
            margin-top: 10px;
          }

          .fullname {
            font-size: 20px;
            font-style: normal;
            font-weight: bold;
            line-height: 28px;
            min-width: 172px;
          }

          .social {
            color: #abb2b9;
            font-size: 20px;
            font-weight: 400;
            line-height: 28px;
          }
        }
        .photo {
          bottom: 70px;
        }
      }
    }
  }
}
</style>
