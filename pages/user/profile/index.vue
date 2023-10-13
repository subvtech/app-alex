<template>
  <div id="profile" class="w-100 d-flex" v-if="user">
    <div class="header d-flex w-100">
      <span class="title h-">{{ $t('pages.profile.title') }}</span>
      <div class="pages d-flex h-100">
        <NuxtLink to="/" class="text-decoration-none">
          <span class="go-back" style="cursor: pointer">{{
            $t('pages.profile.home')
          }}</span>
        </NuxtLink>
        <span class="go-back">></span>
        <span class="current-page">{{ $t('pages.profile.title') }}</span>
      </div>
    </div>
    <div class="user-block my-6">
      <div class="cover-block w-100">
        <NuxtImg
          v-if="coverPicture"
          class="cover"
          ref="cover"
          :src="strapiBaseUrl + coverPicture"
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
          <div v-if="coverPicture" class="delete" @click="removeCoverPicture">
            <v-icon class="big-icon" size="24" color="#6E7A87"
              >mdi-trash-can-outline</v-icon
            >
            <v-icon class="small-icon" size="18" color="#6E7A87"
              >mdi-trash-can-outline</v-icon
            >
          </div>
          <label class="" for="coverInput">
            <v-btn
              class="btn"
              @click="($refs.coverInput as any).click()"
              size="large"
              variant="outlined"
            >
              <v-icon class="icon" size="14" color="#6E7A87"
                >mdi-pencil-outline</v-icon
              >

              <p>{{ $t('pages.profile.cover') }}</p></v-btn
            >
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

      <div class="card">
        <div class="photo">
          <label v-if="profilePicture" class="avatar" for="file-input">
            <NuxtImg
              class="img"
              :src="strapiBaseUrl + profilePicture"
              :alt="user.fullname"
            />

            <v-icon class="d-none" size="x-large" color="#fff"
              >mdi-pencil-outline</v-icon
            >
            <input
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
            <v-icon class="d-none" size="x-large" color="#fff">mdi-plus</v-icon>
            <input
              class="d-none"
              @input="uploadProfilePicture"
              accept="image/png, image/jpeg"
              id="file-input"
              type="file"
            />
          </label>
          <div
            v-if="canEdit && profilePicture"
            class="delete"
            @click="removeProfilePicture"
          >
            <v-icon size="x-small" color="#fff">mdi-trash-can-outline</v-icon>
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
      v-if="links[0] === selectedOption"
      class="content-block d-flex justify-center flex-row w-100"
    >
      <div class="details d-flex flex-column w-100">
        <profile-general
          :id="user.id"
          :socials="user.socials"
          :telephone="user.phone"
          :can-edit="canEdit"
          :email="user.email"
          @update:user="updateUser"
        />
        <profile-socials
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
        <profile-institutional
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
      <profile-events
        :url="user.avatar ? strapiBaseUrl + user.avatar.url : undefined"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { User } from '../../../models/user.model';
import { useI18n } from 'vue-i18n';
const i18n = useI18n();
const { findOne } = useStrapi();
const client = useStrapiClient();
const strapiUrl = useStrapiUrl();
const strapiBaseUrl = computed(() => strapiUrl.replace('/api', ''));

const messageStore = useMessageStore();
const { updateImage, uploadImage, removeImage } = useUploadedImage();
const profilePicture = ref<string | null>(null);
const coverPicture = ref<string | null>(null);
const canEdit = ref(true);

const user = ref<any>();
definePageMeta({
  middleware: 'auth',
});
const { id } = useStrapiUser<User>().value;

const updateUser = async (show = true) => {
  user.value = await findOne<User>('users', id, {
    populate: [
      'institutions.cover',
      'cover',
      'avatar',
      'learningPlans',
      'socials',
      'trails',
      'user_descriptions',
      'user_wallet',
    ],
  });

  if (user.value.avatar) profilePicture.value = user.value.avatar.url;
  if (user.value.cover) coverPicture.value = user.value.cover.url;
  messageStore.message = 'done';
  messageStore.color = 'green';
  messageStore.show = show;
};
await updateUser(false);

const selectedOption = ref(i18n.t('pages.profile.general'));
const links = ref([
  i18n.t('pages.profile.general'),
  i18n.t('pages.profile.courses'),
  i18n.t('pages.profile.projects'),
  i18n.t('pages.profile.assignments'),
  i18n.t('pages.profile.events'),
]);

async function uploadProfilePicture(event: any) {
  if (user.value.avatar) {
    const { updatedAt } = await updateImage(event, user.value.avatar.id);

    const url = profilePicture.value?.split('?');
    if (url) profilePicture.value = url[0] + '?' + updatedAt;
  } else {
    const temp = await uploadImage(event);
    user.value.avatar = temp[0];
    profilePicture.value = temp[0].url;
    const result = await client(`/users/${user.value.id}`, {
      method: 'PUT',
      body: { avatar: temp[0].id },
    });

    console.log(result);
  }
}

async function removeProfilePicture() {
  const result = await removeImage(user.value.avatar.id);
  console.log(result);
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

    console.log(result);
  }
}

async function removeCoverPicture() {
  const result = await removeImage(user.value.cover.id);
  console.log(result);
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
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 0px;
    transition: all ease-in-out 1s;
    max-width: 1612px;

    .card {
      display: flex;
      flex-direction: row;
      position: relative;
      width: 100%;
      padding-inline: 40px;
      transition: all ease-in-out 1s;
      gap: 12px;

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

          max-width: 32px;
          max-height: 32px;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;

          background: #e9494a;
          cursor: pointer;
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
      max-width: 1612px;
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
        .btn {
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
        .delete {
          width: 44px;
          height: 44px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f1f5f9;

          border-radius: 8px;

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
  @media (max-height: 740px) {
    .user-block {
      .cover-block {
        .edit-cover {
          .delete {
            height: 33px;
            width: 33px;
            .small-icon {
              display: block;
            }
            .big-icon {
              display: none;
            }
          }

          .btn {
            height: 33px;
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
        .icon {
          display: none;
        }
        .edit-cover {
          right: 10px;
          .btn {
            padding-inline: 2px;
            width: 110px;
            justify-content: center;
            p {
              margin: 0px;
            }
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
