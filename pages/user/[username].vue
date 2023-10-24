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

    <div class="user-block my-6">
      <div class="cover-block w-100">
        <NuxtImg
          v-if="coverPicture"
          class="cover"
          provider="strapi"
          ref="cover"
          :src="coverPicture"
          placeholder
        />
        <NuxtImg
          v-else
          class="cover"
          ref="cover"
          src="https://picsum.photos/2200/500"
          placeholder
        />
        <div v-if="canEdit" class="edit-cover d-flex align-center">
          <v-btn
            v-if="coverPicture"
            class="btn remove"
            @click="removeCoverPicture"
            size="large"
            icon
            variant="outlined"
          >
            <v-icon class="icon" size="20" color="#6E7A87"
              >mdi-trash-can-outline</v-icon
            >
          </v-btn>

          <label class="" for="coverInput">
            <v-btn
              class="btn label"
              @click="($refs.coverInput as any).click()"
              size="large"
              icon
              variant="outlined"
            >
              <v-icon class="icon" size="20" color="#6E7A87"
                >mdi-pencil-outline</v-icon
              >

              <p>{{ $t('pages.profile.cover') }}</p></v-btn
            >
            <v-btn
              class="btn label small"
              @click="($refs.coverInput as any).click()"
              size="large"
              icon="mdi-pencil-outline"
              variant="outlined"
            />
          </label>

          <input
            class="d-none"
            @input="uploadCoverPicture"
            accept="image/png, image/jpeg"
            ref="coverInput"
            id="coverInput"
            type="file"
          />
        </div>
      </div>

      <div
        class="d-flex justify-space-between align-center pl-sm-10 pr-xl-10 pr-md-8 pr-sm-6 pr-xs-4"
        style="padding-left: 32px"
      >
        <div class="card">
          <div class="photo" :class="canEdit ? 'hover' : ''">
            <label v-if="profilePicture" class="avatar" for="file-input">
              <NuxtImg
                class="img"
                provider="strapi"
                :src="profilePicture"
                :alt="user.fullname"
              />

              <v-icon v-if="canEdit" class="d-none" size="x-large" color="#fff"
                >mdi-pencil-outline</v-icon
              >
              <input
                v-if="canEdit"
                class="d-none"
                @input="uploadProfilePicture"
                accept="image/png, image/jpeg"
                id="file-input"
                type="file"
              />
            </label>
            <label v-else class="avatar" for="file-input">
              <div
                class="img d-flex justify-center align-center"
                alt="profile picture"
              >
                <v-icon size="40" color="#B9BFC6">mdi-account-outline</v-icon>
              </div>
              <v-icon v-if="canEdit" class="d-none" size="x-large" color="#fff"
                >mdi-plus</v-icon
              >
              <input
                v-if="canEdit"
                class="d-none"
                @input="uploadProfilePicture"
                accept="image/png, image/jpeg"
                id="file-input"
                type="file"
              />
            </label>
            <div
              v-if="canEdit && profilePicture"
              class="delete d-flex justify-center align-center"
              @click="removeProfilePicture"
            >
              <v-icon class="small-icon" size="x-small" color="#fff"
                >mdi-trash-can-outline</v-icon
              >
              <v-icon class="normal-icon" size="20" color="#fff"
                >mdi-trash-can-outline</v-icon
              >
            </div>
          </div>

          <div class="info">
            <div class="d-flex">
              <span class="fullname">
                {{ user.fullname }}
              </span>
              <span class="social">@{{ user.username }} </span>
            </div>

            <span class="role">
              {{
                user.isProfessor
                  ? $t('pages.profile.teacher')
                  : $t('pages.profile.student')
              }}
            </span>
          </div>
        </div>

        <v-icon
          v-if="canEdit"
          @click="showSettings = !showSettings"
          class="mr-4 mr-md-3 mr-sm-3 mr-xs-2"
          color="#6E7A87"
          >mdi-cog-outline</v-icon
        >
      </div>
      <div class="menu d-flex">
        <span
          :class="selectedOption === link ? 'selected' : ''"
          @click="selectedOption = link"
          v-for="link in links"
        >
          {{ link }}
        </span>
      </div>
    </div>
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
    <div
      v-else-if="links[0] === selectedOption"
      class="content-block d-flex justify-center flex-row w-100"
    >
      <div class="details d-flex flex-column w-100">
        <profile-general
          :id="user.id"
          :socials="user.socials"
          :telephone="user.phone"
          :email="user.email"
          @update:user="updateUser"
        />
        <profile-socials
          v-if="user.socials.length !== 0 || canEdit"
          :can-edit="canEdit"
          :socials="user.socials"
          :id="user.id"
          @update:user="updateUser"
        />
      </div>
      <div class="d-flex flex-column w-100">
        <profile-about
          :info="user.user_descriptions"
          :id="user.id"
          :can-edit="canEdit"
          @update:user="updateUser"
        />
        <div
          class="d-flex flex-xs-column flex-sm-column flex-md-column flex-xl-row flex-xxl-row mb-6 competences"
          style="gap: 24px"
        >
          <profile-competences
            v-if="technicalTags.length !== 0 || canEdit"
            :title="$t('components.profile.competences.technical.title')"
            :label="$t('components.profile.competences.technical.label')"
            :placeholder="
              $t('components.profile.competences.technical.placeholder')
            "
            :emptyMessage="$t('components.profile.competences.technical.empty')"
            :id="user.id"
            :can-edit="canEdit"
            :userTags="technicalTags"
            @update:user="updateUser"
          ></profile-competences>
          <profile-competences
            v-if="generalTags.length !== 0 || canEdit"
            :title="$t('components.profile.competences.general.title')"
            :label="$t('components.profile.competences.general.label')"
            :placeholder="
              $t('components.profile.competences.general.placeholder')
            "
            :emptyMessage="$t('components.profile.competences.general.empty')"
            :id="user.id"
            :can-edit="canEdit"
            :userTags="generalTags"
            :is-general="true"
            @update:user="updateUser"
          ></profile-competences>
        </div>
        <profile-institutional
          v-if="user.institutions.length !== 0 || canEdit"
          :institutions="user.institutions"
          :id="user.id"
          :can-edit="canEdit"
          @update:user="updateUser"
        />
      </div>
    </div>
    <div
      v-else-if="links[1] === selectedOption"
      class="content-block d-flex justify-center flex-row"
    >
      <profile-courses />
    </div>
    <div
      v-else-if="links[2] === selectedOption"
      class="content-block d-flex justify-center flex-row"
    ></div>
    <div
      v-else-if="links[3] === selectedOption"
      class="content-block d-flex justify-center flex-row"
    ></div>
    <div v-else class="content-block d-flex justify-center flex-row">
      <profile-events :url="user.avatar ? user.avatar.url : undefined" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { User } from '../../models/user.model';
import { useI18n } from 'vue-i18n';
const i18n = useI18n();
const { find, findOne } = useStrapi();
const client = useStrapiClient();
const route = useRoute();
const router = useRouter();
const messageStore = useMessageStore();
const { updateImage, uploadImage, removeImage } = useUploadedImage();
const profilePicture = ref<string | null>(null);
const coverPicture = ref<string | null>(null);
const canEdit = ref(false);

const user = ref<any>();
definePageMeta({
  middleware: 'auth',
});
const { id, username } = useStrapiUser<User>().value;

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

  generalTags.value = user.value.tags.filter((item) => item.isGeneral);
  technicalTags.value = user.value.tags.filter((item) => !item.isGeneral);

  if (user.value.avatar) profilePicture.value = user.value.avatar.url;
  if (user.value.cover) coverPicture.value = user.value.cover.url;
  messageStore.message = 'done';
  messageStore.color = 'green';
  messageStore.show = show;
};
const generalTags = ref();
const technicalTags = ref();
const selectedOption = ref(i18n.t('pages.profile.general'));
const links = ref([
  i18n.t('pages.profile.general'),
  i18n.t('pages.profile.courses'),
  i18n.t('pages.profile.projects'),
  i18n.t('pages.profile.assignments'),
  i18n.t('pages.profile.events'),
]);

const showSettings = ref(false);

async function uploadProfilePicture(event: any) {
  if (user.value.avatar) {
    const { updatedAt } = await updateImage(event, user.value.avatar.id);

    const url = profilePicture.value?.split('?');
    if (url) profilePicture.value = url[0] + '?' + updatedAt;
  } else {
    const temp = await uploadImage(event);
    user.value.avatar = temp[0];
    profilePicture.value = temp[0].url;

    await client(`/users/${user.value.id}`, {
      method: 'PUT',
      body: { avatar: temp[0].id },
    });
  }
}

async function removeProfilePicture() {
  const result = await removeImage(user.value.avatar.id);
  user.value.avatar = null;
  profilePicture.value = null;
}

async function uploadCoverPicture(event: any) {
  if (user.value.cover) {
    const { updatedAt } = await updateImage(event, user.value.cover.id);
    const url = coverPicture.value?.split('?');
    if (url) coverPicture.value = url[0] + '?' + updatedAt;
  } else {
    const temp = await uploadImage(event);
    user.value.cover = temp[0];
    coverPicture.value = temp[0].url;
    const result = await client(`/users/${user.value.id}`, {
      method: 'PUT',
      body: { cover: temp[0].id },
    });
  }
}

async function removeCoverPicture() {
  const result = await removeImage(user.value.cover.id);
  user.value.cover = null;
  coverPicture.value = null;
}
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
              display: block !important;
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
              display: block !important;
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
              display: block;
            }
            .normal-icon {
              display: none;
              visibility: hidden;
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
