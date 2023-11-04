<template>
  <div class="avatar-block">
    <label
      class="avatar"
      :class="[canEdit ? 'hover' : '']"
      :for="canEdit ? 'file-input' : ''"
    >
      <NuxtImg
        v-if="avatar"
        class="img"
        provider="strapi"
        :src="avatar.url"
        :width="size"
        :height="size"
        placeholder
      />
      <v-avatar class="img" v-else :size="size" color="accent">
        <span class="text-white text-h5">{{ userInitials }}</span>
      </v-avatar>

      <div class="edit" v-if="canEdit">
        <v-icon v-if="avatar" class="d-none" size="x-large" color="#fff"
          >mdi-pencil-outline</v-icon
        >
        <v-icon v-else class="d-none" size="x-large" color="#fff"
          >mdi-plus</v-icon
        >
        <input
          class="d-none"
          @input="uploadProfilePicture"
          accept="image/png, image/jpeg"
          id="file-input"
          type="file"
        />
      </div>
    </label>

    <div
      v-if="canEdit && avatar"
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
</template>
<script setup lang="ts">
const client = useStrapiClient();
const { updateImage, uploadImage, removeImage } = useUploadedImage();

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
  placeholder: {
    type: String,
    required: true,
  },
  showBorder: {
    type: Boolean,
    default: false,
  },
  canEdit: {
    type: Boolean,
    default: false,
  },
  size: { type: Number, default: 30 },

  profilePicture: {
    type: Object as PropType<{ url: string; id: number } | null>,
  },
});
console.log({ props });
console.log({ profilePicture: props.profilePicture });
const avatar = ref<{ id: number; url: string } | undefined | null>(
  props.profilePicture,
);

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
  console.log({ avatar: avatar.value });
  if (!avatar.value) return;
  await removeImage(avatar.value.id);
  avatar.value = null;
}

const userInitials = computed(() => {
  return getFullnameInitials(props.placeholder);
});
</script>

<style scoped lang="scss">
.avatar-block {
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

  .hover {
    &:hover {
      .edit {
        display: flex !important;
        position: absolute;
        i {
          display: flex !important;
        }
      }
      .img {
        filter: brightness(50%);
        i {
          display: none !important;
        }
      }
    }
  }

  .delete {
    right: -3px;
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

@media (max-height: 740px) {
  .resize {
    .avatar-block {
      position: relative;
      .avatar {
        .img {
          max-width: 120px;
          max-height: 120px;
          width: 120px !important;
          height: 120px !important;
        }
      }
      .delete {
        height: 24px;
        width: 24px;
        bottom: 15px !important;
      }
    }
  }
}

@media (max-width: 469px) {
  .resize {
    .avatar-block {
      position: relative;
      .avatar {
        .img {
          width: 100px !important;
          height: 100px !important;
        }
      }
      .delete {
        right: 0px;
        bottom: 5px;
        max-width: 20px;
        max-height: 20px;

        .normal-icon {
          display: none !important;
        }
        .small-icon {
          display: flex;
        }
      }
    }
  }
}

@media (max-width: 400px) {
  .resize {
    .avatar-block {
      position: relative;
      .avatar {
        .img {
          width: 70px !important;
          height: 70px !important;
        }
      }
      .delete {
        right: 0px;
        bottom: 5px !important;
        max-width: 20px;
        max-height: 20px;

        .normal-icon {
          display: none !important;
        }
        .small-icon {
          display: flex;
        }
      }
    }
  }
}
</style>
