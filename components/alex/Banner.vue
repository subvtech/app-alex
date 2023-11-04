<template>
  <div class="user-block my-6" style="position: relative">
    <div class="cover-block w-100">
      <NuxtImg
        v-if="cover"
        class="cover"
        provider="strapi"
        :src="cover.url"
        placeholder
      />
      <NuxtImg
        v-else
        class="cover"
        src="https://picsum.photos/2200/500"
        placeholder
      />
      <div v-if="canEdit" class="edit-cover d-flex align-center">
        <v-btn
          v-if="cover"
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
      v-if="startDate || endDate"
      class="d-flex py-1 py-sm-2 px-2 px-sm-4 rounded-lg ml-4 ml-sm-6 mt-4 mt-sm-6"
      style="position: absolute; top: 0px"
      :style="[
        dateToTheLeft ? '' : 'right: 10px',
        darkerBackground
          ? 'background-color: rgba(0, 0, 0, 0.5); color: white'
          : 'background-color: white; color: #232b32',
      ]"
    >
      <div
        v-if="startDate"
        class="d-flex flex-column justify-center align-end"
        :class="startDate && endDate ? 'mr-2 mr-sm-4' : ''"
      >
        <span style="font-size: 14px; letter-spacing: 0.28px">
          {{ $t('pages.profile.startDate') }}</span
        >
        <span class="font-weight-bold">{{ startDate }}</span>
      </div>
      <v-divider v-if="startDate && endDate" vertical></v-divider>
      <div
        v-if="endDate"
        class="d-flex flex-column justify-center align-start"
        :class="startDate && endDate ? 'ml-2 ml-sm-4' : ''"
      >
        <span style="font-size: 14px; letter-spacing: 0.28px">
          {{ $t('pages.profile.endDate') }}</span
        ><span class="font-weight-bold">{{ endDate }}</span>
      </div>
    </div>
    <alex-info
      :can-edit="canEdit"
      :end-date="endDate"
      :start-date="startDate"
      :fullname="fullname"
      :username="username + username"
      :title="title"
      title-style="color: #000"
      fullname-style="color: #454D54;"
      show-role
      resize
      :user-id="userId"
      :profile-picture="profilePicture"
      :is-professor="isProfessor"
    />

    <div v-if="showMenu" class="menu d-flex" style="z-index: 1">
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
      <div v-if="false">
        <v-icon
          v-if="canEdit"
          @click="emit('display:settings')"
          class="mr-4 mr-md-3 mr-sm-3 mr-xs-2"
          color="#6E7A87"
          >mdi-cog-outline</v-icon
        >
        <v-btn
          v-else-if="settingsPlaceholder"
          class="d-flex px-3 mr-4 mr-md-3 mr-sm-3 mr-xs-2"
          color="#fff"
          @click="emit('alternative:settings')"
        >
          <NuxtImg
            src="/svg/account-card.svg"
            width="20"
            height="20"
            placeholder
          />
          <span
            class="ml-2 font-weight-bold"
            style="color: #00b7cc; text-transform: none"
            >{{ settingsPlaceholder }}</span
          ></v-btn
        >
        <v-btn
          v-else
          class="mr-4 mr-md-3 mr-sm-3 mr-xs-2"
          @click="emit('alternative:settings')"
          color="#fff"
        >
          <NuxtImg
            src="/svg/account-card.svg"
            width="20"
            height="20"
            placeholder
        /></v-btn>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const emit = defineEmits([
  'select:option',
  'alternative:settings',
  'display:settings',
]);
const { updateImage, uploadImage, removeImage } = useUploadedImage();
const client = useStrapiClient();

const props = defineProps({
  coverPicture: {
    type: Object as PropType<{ url: string; id: number } | null>,
  },

  profilePicture: {
    type: Object as PropType<{ url: string; id: number } | null>,
    required: true,
  },

  darkerBackground: {
    type: Boolean,
    default: true,
  },

  floatBeneath: {
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

  settingsPlaceholder: {
    type: String,
  },

  title: {
    type: String,
  },

  showMenu: { type: Boolean, default: false },

  userId: {
    type: Number,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
  },
  endDate: {
    type: String,
  },
  username: {
    type: String,
    required: true,
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
  canEdit: { type: Boolean, required: true },
});

const { selectedOption, fullname, username, canEdit, userId } = toRefs(props);

function consoleHitOn() {
  console.log('I got hit on');
}

const cover = ref<{ id: number; url: string } | null | undefined>(
  props.coverPicture,
);

async function uploadCoverPicture(event: any) {
  if (cover.value) {
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
