<template>
  <div class="user-block my-6" style="position: relative" data-testid="banner">
    <div class="cover-block w-100">
      <NuxtImg
        v-if="cover"
        class="cover"
        :provider="imgFromStrapi ? 'strapi' : undefined"
        :src="cover.url"
        placeholder
        role="custom-cover"
      />
      <NuxtImg
        v-else
        class="cover"
        src="https://picsum.photos/2200/500"
        placeholder
        role="default-cover"
      />
      <div
        class="w-100 h-100"
        style="top: 0; left: 0; opacity: 0.1; height: auto; position: absolute"
        :style="
          showShade
            ? 'background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.24) 53.12%, rgba(0, 0, 0, 0.3) 61.46%, rgba(0, 0, 0, 0.6) 93.75%);'
            : ''
        "
      ></div>
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
          <NuxtImg
            src="/svg/trash-dark.svg"
            style="color: #6e7a87"
            width="24"
            height="24"
            placeholder
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
      :code="code"
      :code-style="codeStyle"
      :fullname-style="fullnameStyle"
      :username-style="usernameStyle"
      :role-style="roleStyle"
      :title-style="titleStyle"
      :avatar-block-style="avatarBlockStyle"
      :title-above="titleAbove"
      :float-beneath="floatBeneath"
      :show-role="showRole"
      :show-border="showBorder"
      :show-settings="!settingsMenu"
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

    <div
      v-if="showMenu"
      class="menu d-flex h-100"
      data-testid="menu"
      style="z-index: 1"
    >
      <span
        v-for="(link, index) in links"
        class="font-weight-regular text-body-3 text-sm-body-2"
        :class="selectedOption === index ? 'selected' : ''"
        @click="emit('select:option', index)"
        :key="index"
        style="letter-spacing: 0.32px !important"
      >
        {{ link }}
      </span>

      <v-spacer />
      <div v-if="settingsMenu" data-testid="settings-menu">
        <v-icon
          v-if="canEdit"
          @click="emit('display:settings')"
          class="mr-4 mr-md-3 mr-sm-3 mr-xs-2"
          color="#6E7A87"
          >mdi-cog-outline</v-icon
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const emit = defineEmits(['select:option', 'display:settings']);
const { updateImage, uploadImage, removeImage } = useUploadedImage();
const client = useStrapiClient();

const props = defineProps({
  coverPicture: {
    type: Object as PropType<{ url: string; id: number } | null>,
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
    type: Object as PropType<{ url: string; id: number } | null>,
  },
  profilePictureSize: {
    type: Number,
    default: 50,
  },
  darkerBackground: {
    type: Boolean,
    default: false,
  },

  titleAbove: {
    type: Boolean,
    default: false,
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

  code: {
    type: String,
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
    type: Array as PropType<string[]>,
    default: [],
  },
  isProfessor: { type: Boolean, default: false },
  canEdit: { type: Boolean, default: false },
  canDelete: { type: Boolean, default: false },
});

const { selectedOption, fullname, username, canEdit, userId } = toRefs(props);

const cover = ref<{ id: number; url: string } | null | undefined>(
  props.coverPicture,
);

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
</script>

<style scoped lang="scss">
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
    gap: 24px;
    padding-inline: 24px;
    transition: all ease-in-out 1s;
    align-items: center;

    span {
      color: #5d6872;
      line-height: 22px;
      padding-block: 16px;
      text-align: center;
      cursor: pointer;
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
        }
        .btn.label {
          display: none !important;
        }
      }

      p {
        font-size: 12px;
      }
    }

    .menu {
      gap: 16px;
      :first-child {
        min-width: 79px;
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

@media (max-width: 335px) {
  .user-block {
    .cover-block {
      max-height: 295px;
    }
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
</style>
