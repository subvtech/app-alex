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
      <div
        v-if="canEdit && !coverPlaceholder"
        class="edit-cover d-flex align-center"
      >
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
      v-if="(startDate || endDate) && coverPlaceholder"
      class="d-flex py-1 py-sm-2 px-2 px-sm-4 rounded-lg ml-4 ml-sm-6 mt-4 mt-sm-6"
      style="position: absolute; top: 0px; background-color: white"
    >
      <div
        v-if="startDate"
        class="d-flex flex-column justify-center align-end"
        :class="startDate && endDate ? 'mr-2 mr-sm-4' : ''"
      >
        <span style="color: #454d54; font-size: 14px; letter-spacing: 0.28px">
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
        <span style="color: #454d54; font-size: 14px; letter-spacing: 0.28px">
          {{ $t('pages.profile.endDate') }}</span
        ><span class="font-weight-bold">{{ endDate }}</span>
      </div>
    </div>

    <div
      v-if="coverPlaceholder"
      class="coverPlaceholder d-flex w-100"
      style="position: relative"
    >
      <div
        class="d-flex flex-column w-100 mb-1 px-6 pt-6 pb-4"
        :class="canEdit ? 'hover' : ''"
        style="
          position: absolute;
          bottom: 0px;
          left: 0px;
          border-radius: var(--0, 0px);
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.24) 53.12%,
            rgba(0, 0, 0, 0.3) 61.46%,
            rgba(0, 0, 0, 0.6) 93.75%
          );
        "
      >
        <span
          class="font-weight-bold text-h3 text-md-h2"
          style="color: white"
          >{{ coverPlaceholder }}</span
        >

        <div class="d-flex flex-row align-center" style="gap: 8px">
          <div v-if="avatar" class="avatar">
            <NuxtImg
              class="img"
              width="35"
              height="35"
              provider="strapi"
              :src="avatar.url"
              :alt="fullname"
              placeholder
            />
          </div>
          <div v-else class="avatar">
            <div
              class="img d-flex justify-center align-center"
              alt="profile picture"
            >
              <v-icon size="40" color="#B9BFC6">mdi-account-outline</v-icon>
            </div>
          </div>
          <span
            class="font-weight-normal text-h5 text-md-h4"
            style="color: white; letter-spacing: 0.8"
          >
            {{ fullname }}
          </span>
        </div>
      </div>
    </div>
    <div
      v-else
      class="d-flex justify-space-between align-center w-100 pl-sm-10 pr-xl-10 pr-md-8 pr-sm-6 pr-xs-4"
      style="padding-left: 32px"
    >
      <div class="card">
        <div class="photo" :class="canEdit ? 'hover' : ''">
          <label v-if="avatar" class="avatar" for="file-input">
            <NuxtImg
              class="img"
              provider="strapi"
              :src="avatar.url"
              :alt="fullname"
              placeholder
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
            v-if="canEdit && avatar && updateProfilePicture"
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
              {{ fullname }}
            </span>
            <span class="social">@{{ username }} </span>
          </div>

          <span class="role">
            {{
              isProfessor
                ? $t('pages.profile.teacher')
                : $t('pages.profile.student')
            }}
          </span>
        </div>
      </div>

      <v-icon
        v-if="canEdit"
        @click="emit('display:settings')"
        class="mr-4 mr-md-3 mr-sm-3 mr-xs-2"
        color="#6E7A87"
        >mdi-cog-outline</v-icon
      >
    </div>
    <div class="menu d-flex">
      <span
        v-for="(link, index) in links"
        :class="selectedOption === index ? 'selected' : ''"
        @click="emit('selected:option', index)"
      >
        {{ link }}
      </span>

      <v-spacer />
      <div v-if="coverPlaceholder">
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
          @click="emi('alternative:settings')"
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
  'selected:option',
  'alternative:settings',
  'display:settings',
]);
const { updateImage, uploadImage, removeImage } = useUploadedImage();
const client = useStrapiClient();

const props = defineProps({
  coverPicture: {
    type: Object as PropType<{ url: string; id: number } | null>,
    required: true,
  },

  profilePicture: {
    type: Object as PropType<{ url: string; id: number } | null>,
    required: true,
  },

  updateProfilePicture: {
    type: Boolean,
    default: false,
  },

  settingsPlaceholder: {
    type: String,
  },

  coverPlaceholder: {
    type: String,
  },

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

const avatar = ref<{ id: number; url: string } | null>(props.profilePicture);
const cover = ref<{ id: number; url: string } | null>(props.coverPicture);

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

async function uploadProfilePicture(event: any) {
  if (avatar.value) {
    const { updatedAt } = await updateImage(event, avatar.value.id);

    const url = avatar.value.url?.split('?');
    if (url) avatar.value.url = url[0] + '?' + updatedAt;
  } else {
    const temp = await uploadImage(event);
    avatar.value = { url: temp[0].url, id: temp[0].id };

    await client(`/users/${props.userId}`, {
      method: 'PUT',
      body: { avatar: temp[0].id },
    });
  }
}

async function removeProfilePicture() {
  if (!avatar.value) return;
  await removeImage(avatar.value.id);
  avatar.value = null;
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
</style>
