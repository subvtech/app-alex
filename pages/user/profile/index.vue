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
        <img
          v-if="user.cover"
          :src="strapiBaseUrl + cover"
          :alt="user.fullname"
        />
        <img
          v-else
          class="cover"
          src="https://picsum.photos/800/800"
          alt="cover picture"
        />
        <div class="img-upload">
          <label class="" for="cover-input">
            <v-btn
              class="btn"
              @click="($refs.coverInput as any).click()"
              size="large"
              variant="outlined"
            >
              <v-icon class="icon" color="#6E7A87">mdi-pencil-outline</v-icon>

              <p>{{ $t('pages.profile.cover') }}</p></v-btn
            >
          </label>

          <input
            class=""
            @input="uploadCoverPicture"
            style="display: none"
            accept="image/png, image/jpeg"
            ref="coverInput"
            id="cover-input"
            type="file"
          />
        </div>
      </div>

      <div class="card">
        <div class="photo">
          <div class="avatar">
            <img
              v-if="avatar"
              :src="strapiBaseUrl + avatar"
              :alt="user.fullname"
            />
            <img
              v-else
              src="https://picsum.photos/400/400"
              alt="profile picture"
            />
          </div>
          <div class="img-upload">
            <label class="edit" for="file-input">
              <v-icon size="x-small">mdi-pencil-outline</v-icon>
            </label>

            <input
              class=""
              @input="uploadProfilePicture"
              style="display: none"
              accept="image/png, image/jpeg"
              id="file-input"
              type="file"
            />
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
        <profile-about :info="user.info" />
        <profile-institutional
          :institutions="user.institutions"
          :id="user.id"
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
    <div
      v-else
      class="content-block d-flex justify-center flex-row"
    >
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
const strapiUrl = useStrapiUrl();
const strapiBaseUrl = computed(() => strapiUrl.replace('/api', ''));

const messageStore = useMessageStore();
const { updateImage } = useUploadedImage();
const avatar = ref<string | null>(null);
const cover = ref<string | null>(null);
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
      'socials.icon',
      'trails',
      'user_wallet',
    ],
  });

  if (user.value.avatar) avatar.value = user.value.avatar.url;
  if (user.value.cover) cover.value = user.value.cover.url;
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
  const { updatedAt } = await updateImage(event, user.value.avatar.id);
  const url = avatar.value?.split('?');
  if (url) avatar.value = url[0] + '?' + updatedAt;
}

async function uploadCoverPicture(event: any) {
  const { updatedAt } = await updateImage(event, user.value.cover.id);
  const url = cover.value?.split('?');
  if (url) cover.value = url[0] + '?' + updatedAt;
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
          align-items: flex-end;

          img {
            max-width: 160px;
            max-height: 160px;

            aspect-ratio: 1 / 1; /* defining the aspect ratio of the image */
            object-fit: cover;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            border: solid #fff;

            border-radius: 100%;
          }
        }

        .img-upload {
          right: 0px;
          bottom: 32px;

          position: absolute;

          width: 32px;
          height: 32px;

          border-radius: 99px;
          border: 1px solid #abb2b9;
          background: #f1f5f9;

          .edit {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            cursor: pointer;
          }
        }
      }

      .info {
        display: flex;
        flex-direction: column;
        margin-block: 16px;
        margin-left: 170px;
        transition: all ease-in-out 1s;

        .d-flex {
          gap: 8px;
          .fullname {
            color: #001529;
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
      img {
        width: 100%;
        height: auto;
        max-height: 300px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        object-fit: cover;
      }

      .btn {
        position: absolute;
        width: 153px;
        bottom: 24px;
        right: 20px;
        border-radius: 8px;
        border: none;
        color: #6e7a87;
        height: 44px;
        background-color: #ebedef;
        text-transform: none !important;

        p {
          font-size: 14px;
          margin-left: 8px;
          letter-spacing: 0.56px;
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
  }

  @media (max-width: 1200px) {
    .user-block {
      .card {
        margin-top: -2px;
        .photo {
          bottom: 15px;
          .avatar {
            img {
              max-width: 120px;
              max-height: 120px;
            }
          }
          .img-upload {
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
              color: #001529;
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

  @media (max-width: 640px) {
    .user-block {
      .cover-block {
        position: relative;
        img {
          width: 100%;
          height: auto;
          max-width: 100%;
          max-height: 300px;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }

        .btn {
          position: absolute;
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
          bottom: 20px;
          .avatar {
            img {
              max-width: 100px;
              max-height: 100px;
            }
          }
          .img-upload {
            right: 0px;
            bottom: 20px;

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
    @media (max-height: 740px) {
      .user-block {
        .cover-block {
          .btn {
            height: 33px;
          }
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
        .info {
          justify-content: space-between;
          flex-direction: column;

          .d-flex {
            gap: 0px;
            flex-direction: column;
          }

          .fullname {
            color: #001529;
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
        .btn {
          right: 10px;
          padding-inline: 2px;
          width: 110px;
          justify-content: center;
          p {
            margin: 0px;
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
            color: #001529;
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
