<template>
  <div
    class="user-block my-6 w-100"
    style="position: relative"
    data-testid="banner"
  >
    <div class="cover-block w-100">
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
      <div class="w-100 h-25" :class="showShade ? 'shade' : ''" role="shade" />
      <div v-if="canEdit" class="edit-cover d-flex align-center">
        <v-btn
          v-if="cover && imgFromStrapi"
          class="btn remove"
          @click="removeCoverPicture"
          size="large"
          icon
          variant="outlined"
          role="delete-cover"
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
      :settingsIcon="settingsIcon"
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
      :user-id="userId"
      :profile-picture="profilePicture"
      :is-professor="isProfessor"
      @display:settings="emit('display:settings')"
    />

    <div class="d-flex">
      <alex-custom-tabs
        v-if="showMenu"
        v-model="bannerSelectedOption"
        :tabs="links"
        @update:modelValue="emit('select:option', bannerSelectedOption)"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { TabType } from '@/components/alex/custom/Tabs.vue';
const emit = defineEmits(['select:option', 'display:settings']);
const { updateImage, uploadImage, removeImage } = useUploadedImage();
const client = useStrapiClient();

export type BannerImageType = {
  url: string;
  id: number;
  [x: string | number | symbol]: unknown;
};

const props = defineProps({
  coverPicture: {
    type: Object as PropType<BannerImageType | null>,
  },

  showSettings: {
    type: Boolean,
    default: false,
  },

  imgFromStrapi: {
    type: Boolean,
    default: true,
  },

  showProfilePicture: {
    type: Boolean,
    default: false,
  },

  profilePicture: {
    type: Object as PropType<BannerImageType | null>,
  },
  profilePictureSize: {
    type: Number,
    default: 50,
  },
  darkerBackground: {
    type: Boolean,
    default: false,
  },
  descriptionAbove: {
    type: Boolean,
    default: false,
  },

  description: {
    type: String,
  },

  distribution: {
    type: String as PropType<
      | 'single-row'
      | 'single-column'
      | 'fullname-username-role'
      | 'fullname-role-username'
      | 'username-fullname-role'
      | 'username-role-fullname'
    >,
    default: 'fullname-username-role',
  },
  settingsIcon: {
    type: String,
    default: 'mdi-cog-outline',
  },

  copyObject: {
    type: Object as PropType<{ label: string; copyText: string }>,
  },
  fullnameStyle: {
    type: String,
  },
  codeStyle: {
    type: String,
  },
  roleStyle: {
    type: String,
  },
  usernameStyle: {
    type: String,
  },
  startDateStyle: {
    type: String,
  },
  endDateStyle: {
    type: String,
  },

  titleStyle: {
    type: String,
  },

  subtitleStyle: {
    type: String,
  },

  avatarBlockStyle: {
    type: String,
  },

  showBorder: {
    type: Boolean,
    default: false,
  },

  floatBeneath: {
    type: Boolean,
    default: false,
  },
  settingsMenu: {
    type: Boolean,
    default: false,
  },

  dateToTheLeft: {
    type: Boolean,
    default: false,
  },

  showShade: {
    type: Boolean,
    default: false,
  },

  showRole: {
    type: Boolean,
    default: false,
  },

  updateProfilePicture: {
    type: Boolean,
    default: false,
  },

  title: {
    type: String,
  },

  subtitle: {
    type: String,
  },

  showMenu: { type: Boolean, default: false },

  userId: {
    type: Number,
  },
  fullname: {
    type: String,
  },
  startDate: {
    type: String,
  },
  endDate: {
    type: String,
  },
  username: {
    type: String,
  },
  selectedOption: {
    type: Number,
    default: 0,
  },

  links: {
    type: Array as PropType<TabType[]>,
    default: [],
  },
  isProfessor: { type: Boolean, default: false },
  canEdit: { type: Boolean, default: false },
  canDelete: { type: Boolean, default: false },
});

const { selectedOption, coverPicture, fullname, username, canEdit, userId } =
  toRefs(props);

const bannerSelectedOption = toRef(props.selectedOption);

const cover = ref<BannerImageType | null | undefined>(props.coverPicture);

async function uploadCoverPicture(event: any) {
  if (cover.value && props.imgFromStrapi) {
    const { updatedAt } = await updateImage(event, cover.value.id);
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

watch(selectedOption, () => {
  bannerSelectedOption.value = selectedOption.value;
});
</script>

<style scoped lang="scss">
.cursor-pointer {
  cursor: pointer;
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
.user-block {
  background-color: white;
  border-top-left-radius: 8px;
  box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.08);
  border-top-right-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0px;
  transition: all ease-in-out 1s;

  .cover-block {
    position: relative;
    max-height: 300px;
    .cover {
      width: 100%;
      height: auto;
      max-height: 300px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      object-fit: cover;
      aspect-ratio: 1 / 1;
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
        max-height: 300px;
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
        height: 300px !important;
        max-height: unset !important;
      }
    }
  }
}
</style>
