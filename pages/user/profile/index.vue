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
      <img
        v-if="user.cover"
        class="cover"
        :src="strapiBaseUrl + user.cover.url"
        :alt="user.fullname"
      />
      <img
        v-else
        class="cover"
        src="https://picsum.photos/800/800"
        alt="cover picture"
      />
      <div class="card">
        <div class="photo">
          <div class="avatar">
            <img
              v-if="user.avatar && user.avatar.url"
              :src="strapiBaseUrl + user.avatar.url"
              :alt="user.fullname"
            />
            <img
              v-else
              src="https://picsum.photos/400/400"
              alt="profile picture"
            />
          </div>
          <v-icon
            class="edit"
            color="black"
            small
            :title="$t('pages.profile.edit')"
            >mdi-pencil-outline</v-icon
          >
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
      class="content-block d-flex justify-center flex-row"
    >
      <profile-general :telephone="user.phone" :email="user.email" />
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
      v-else-if="links[4] === selectedOption"
      class="content-block d-flex justify-center flex-row"
    >
      <profile-events
        :url="user.avatar ? strapiBaseUrl + user.avatar.url : undefined"
      />
    </div>
    <div v-else class="content-block d-flex justify-center flex-row">
      <profile-settings
        :id="user.id"
        :info="user.info"
        :fullname="user.fullname"
        :telephone="user.phone"
        :cpf="user.cpf"
        @update:user="updateUser"
      />
      <div class="d-flex flex-column">
        <profile-institutional
          :institutions="user.institutions"
          :id="user.id"
          :canEdit="true"
          @update:user="updateUser"
        />
        <profile-security
          :email="user.email"
          :id="user.id"
          @update:user="updateUser"
        />
        <profile-wallets
          :wallet="user.user_wallet"
          :id="user.id"
          @update:user="updateUser"
        />
      </div>
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
      'trails',
      'user_wallet',
    ],
  });

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
  i18n.t('pages.profile.settings'),
]);
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

        .edit {
          display: flex;
          width: 32px;
          height: 32px;
          padding: 10px;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 10px;
          right: 0px;
          bottom: 32px;
          position: absolute;
          border-radius: 99px;
          border: 1px solid #abb2b9;
          background: #f1f5f9;
          cursor: pointer;
        }
      }

      .info {
        display: flex;
        flex-direction: column;
        margin-block: 16px;
        margin-left: 170px;
        transition: all ease-in-out 1s;

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

        .role {
          color: #abb2b9;
          font-size: 18px;
          font-weight: bold;

          line-height: 22px;
        }
      }
    }
    .cover {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 300px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }

    .menu {
      border-top: 1px solid #eaeef1;
      gap: 24px;
      padding-inline: 24px;
      margin-top: 18px;
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
  }

  @media (max-width: 800px) {
    .content-block {
      flex-wrap: wrap;
    }
  }

  @media (max-width: 640px) {
    .user-block {
      .card {
        .info {
          margin-left: 125px;
          :first-child {
            gap: 8px;
            flex-direction: column-reverse;
          }
        }
        .photo {
          max-width: 120px;
          max-height: 120px;
          bottom: 40px;
          .avatar {
            img {
              max-width: 100%;
              max-height: 100%;

              margin-top: 0px;
            }
          }

          .edit {
            display: flex;
            width: 32px;
            height: 32px;
            padding: 10px;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 10px;
            right: 0px;
            bottom: 15px;
            position: absolute;
            border-radius: 99px;
            border: 1px solid #abb2b9;
            background: #f1f5f9;
            cursor: pointer;
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

  @media (max-width: 590px) {
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
          .avatar {
            img {
              max-width: 100%;
              max-height: 100%;

              margin-top: 0px;
            }
          }
        }
      }
    }
  }

  @media (max-width: 410px) {
    .user-block {
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
          }

          .social {
            color: #abb2b9;
            font-size: 20px;
            font-weight: 400;
            line-height: 28px;
          }
        }
        .photo {
          bottom: 110px;
          .avatar {
            img {
              max-width: 90%;
              max-height: 90%;

              margin-top: 0px;
            }
          }
          .edit {
            display: flex;
            width: 24px;
            height: 24px;
            padding: 10px;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 10px;
            right: 8px;
            bottom: 15px;
            position: absolute;
            border-radius: 99px;
            border: 1px solid #abb2b9;
            background: #f1f5f9;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
