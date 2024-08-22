<template>
  <div class="banner user-block my-6 w-100" data-testid="banner">
    <div class="cover-block w-100">
      <alex-custom-skeleton v-if="loading" class="height-90" color="gray-200" />
      <template v-else>
        <NuxtImg
          v-if="cover"
          class="cover"
          :provider="imgFromStrapi ? 'strapi' : undefined"
          :src="cover.url"
          placeholder
          role="custom-cover"
        />
        <img
          v-else
          class="cover"
          src="/images/alex-banner.svg"
          role="default-cover"
        />
      </template>
      <div class="w-100 h-25" :class="showShade ? 'shade' : ''" role="shade" />
      <div v-if="canEdit" class="edit-cover d-flex align-center">
        <v-btn
          v-if="cover && imgFromStrapi"
          class="btn remove"
          size="large"
          icon
          variant="outlined"
          role="delete-cover"
          @click="removeCoverPicture"
        >
          <img
            src="/svg/trash-dark.svg"
            style="color: #6e7a87"
            width="24"
            height="24"
          />
        </v-btn>

        <label class="" for="coverInput" data-testid="edit-cover">
          <v-btn
            class="btn label"
            size="large"
            icon
            variant="outlined"
            @click="($refs.coverInput as any).click()"
          >
            <v-icon class="icon" size="20" color="#6E7A87"
              >mdi-pencil-outline</v-icon
            >

            <p>{{ $t('pages.profile.cover') }}</p></v-btn
          >
          <v-btn
            class="btn label small"
            size="large"
            icon="mdi-pencil-outline"
            variant="outlined"
            @click="($refs.coverInput as any).click()"
          />
        </label>

        <input
          id="coverInput"
          ref="coverInput"
          class="d-none"
          accept="image/png, image/jpeg"
          type="file"
          @input="uploadCoverPicture"
        />
      </div>
    </div>

    <alex-custom-info
      :show-profile-picture="showProfilePicture"
      :can-edit="canEdit"
      :can-delete="canDelete"
      :end-date="endDate"
      :start-date="startDate"
      :fullname="fullname"
      :username="username"
      :title="title"
      :subtitle="subtitle"
      :copy-object="copyObject"
      :code-style="codeStyle"
      :settings-icon="settingsIcon"
      :fullname-style="fullnameStyle"
      :username-style="usernameStyle"
      :role-style="roleStyle"
      :title-style="titleStyle"
      :subtitle-style="subtitleStyle"
      :avatar-block-style="avatarBlockStyle"
      :description-above="descriptionAbove"
      :description="description"
      :float-beneath="floatBeneath"
      :show-role="showRole"
      :show-border="showBorder"
      :show-settings="!settingsMenu && showSettings"
      :distribution="distribution"
      :darker-background="darkerBackground"
      :profile-picture-size="profilePictureSize"
      :start-date-style="startDateStyle"
      :end-date-style="endDateStyle"
      resize
      :update-profile-picture="updateProfilePicture"
      :user-id="userId"
      :profile-picture="profilePicture"
      :is-professor="isProfessor"
      @display:settings="emit('display:settings')"
    />
    <div class="d-flex justify-space-between align-center px-6 overflow-x-auto">
      <alex-custom-tabs
        v-if="showMenu"
        v-model="selectedOption"
        show-arrows
        :mandatory="false"
        :tabs="links"
        class="tabs"
        @update:model-value="emit('select:option', selectedOption)"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { TabType } from '@/components/alex/custom/Tabs.vue';
const emit = defineEmits(['select:option', 'display:settings']);
const { updateImage, uploadImage, removeImage } = useUploadedImage();
const client = useStrapiClient();
type BannerProps = {
  coverPicture?: Upload | null;
  showSetting?: boolean;
  imgFromStrapi?: boolean;
  showProfilePicture?: boolean;
  profilePicture?: Upload | null;
  profilePictureSize?: number;
  darkerBackground?: boolean;
  descriptionAbove?: boolean;
  description?: string;
  distribution?:
    | 'single-row'
    | 'single-column'
    | 'fullname-username-role'
    | 'fullname-role-username'
    | 'username-fullname-role'
    | 'username-role-fullname';
  settingsIcon?: string;
  selectedOption?: number | null;
  isProfessor?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  userId?: number;
  fullname?: string;
  startDate?: string;
  endDate?: string;
  username?: string;
  copyObject?: { label: string; copyText: string };
  fullnameStyle?: string;
  codeStyle?: string;
  roleStyle?: string;
  usernameStyle?: string;
  startDateStyle?: string;
  endDateStyle?: string;
  titleStyle?: string;
  subtitleStyle?: string;
  avatarBlockStyle?: string;
  showBorder?: boolean;
  floatBeneath?: boolean;
  settingsMenu?: boolean;
  dateToTheLeft?: boolean;
  showShade?: boolean;
  showRole?: boolean;
  updateProfilePicture?: boolean;
  title?: string;
  subtitle?: string;
  showMenu?: boolean;
  showSettings?: boolean;
  links?: TabType[];
  settings?: TabType;
  loading?: boolean;
};
const props = withDefaults(defineProps<BannerProps>(), {
  coverPicture: null,
  showSetting: false,
  imgFromStrapi: false,
  showProfilePicture: false,
  profilePicture: null,
  profilePictureSize: 50,
  darkerBackground: false,
  descriptionAbove: false,
  description: undefined,
  selectedOption: null,
  links: () => [],
  isProfessor: false,
  canEdit: false,
  canDelete: false,
  userId: undefined,
  fullname: undefined,
  startDate: undefined,
  endDate: undefined,
  username: undefined,
  copyObject: undefined,
  floatBeneath: false,
  settingsMenu: false,
  dateToTheLeft: false,
  showShade: false,
  showRole: false,
  fullnameStyle: undefined,
  codeStyle: undefined,
  roleStyle: undefined,
  usernameStyle: undefined,
  startDateStyle: undefined,
  endDateStyle: undefined,
  titleStyle: undefined,
  subtitleStyle: undefined,
  avatarBlockStyle: undefined,
  settingsIcon: 'mdi-cog-outline',
  distribution: 'fullname-username-role',
  title: undefined,
  subtitle: undefined,
  showMenu: false,
  showSettings: false,
  settings: undefined,
  updateProfilePicture: false,
  loading: false,
});

const { coverPicture, fullname, username, canEdit, userId } = toRefs(props);
const selectedOption = toRef(props.selectedOption);
const cover = ref<Partial<Upload> | null | undefined>(props.coverPicture);

async function uploadCoverPicture(event: any) {
  if (cover.value && props.imgFromStrapi) {
    const { updatedAt } = await updateImage(event, String(cover.value.id));
    const url = cover.value.url?.split('?');
    if (url) cover.value.url = url[0] + '?' + updatedAt;
  } else {
    const temp = await uploadImage(event);

    cover.value = { url: temp[0].url, id: temp[0].id };
    await client(`/users/${props.userId}`, {
      method: 'PUT',
      body: { cover: temp[0].id },
    });
  }
}

async function removeCoverPicture() {
  if (!cover.value) return;
  await removeImage(cover.value.id);
  cover.value = null;
}

watch(coverPicture!, () => {
  if (coverPicture) cover.value = coverPicture.value;
  else cover.value = undefined;
});
</script>

<style lang="scss">
.banner {
  position: relative;
  .cursor-pointer {
    cursor: pointer;
  }

  &.user-block {
    background-color: white;
    border-top-left-radius: 8px;
    box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 0px;
    transition: all ease-in-out 1s;
    overflow: hidden;

    .cover-block {
      position: relative;
      max-height: 360px;
      .cover {
        width: 100%;
        height: auto;
        max-height: 360px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        object-fit: cover;
        aspect-ratio: 1/1;
      }

      .w-100.h-25 {
        bottom: 0;
        left: 0;
        opacity: 1;
        height: auto;
        position: absolute;
      }

      .shade {
        background: linear-gradient(
          180deg,
          rgba(0, 0, 0, 0) 0%,
          rgba(0, 0, 0, 0.4) 78.65%
        );
      }

      .edit-cover {
        gap: 16px;
        position: absolute;
        bottom: 24px;
        right: 20px;
        z-index: 10;

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
      height: 46px;
      padding-inline: 24px;
      transition: all ease-in-out 1s;
      overflow-x: auto;
      overflow-y: hidden;
      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none; /* Firefox */
      &::-webkit-scrollbar {
        display: none;
      }
      div {
        height: 100%;
        display: flex;
        border-bottom: 2px solid transparent;
        &:hover {
          color: #279ee3;
        }
        span {
          color: #454d54;
          padding-inline: 16px;
          letter-spacing: 0.32px;
          font-size: 1rem;
          min-width: max-content;
          align-self: center;
          text-align: center;

          /* Body/P1 */
        }
      }

      .selected {
        color: #279ee3;
        border-bottom: 2px solid #279ee3;
        span {
          color: #279ee3;
        }
      }
    }
  }

  .banner-skeleton .v-skeleton-loader__bone.v-skeleton-loader__image {
    height: 360px !important;
  }
  .coverPlaceholder {
    .avatar {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
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
          max-height: 360px;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }

        .edit-cover {
          .btn.label.small {
            display: block !important;
            width: 33px !important;
            height: 33px !important;
          }
          .btn.label {
            display: none !important;
          }
        }

        p {
          font-size: 12px;
        }
      }
    }
  }

  @media (max-width: 608px) {
    .user-block {
      .menu {
        div {
          span {
            font-size: 14px;
          }
        }
      }
    }
  }

  @media (max-width: 410px) {
    .user-block {
      .cover-block {
        img {
          height: 360px !important;
          max-height: unset !important;
        }
      }
    }
  }
}
</style>
