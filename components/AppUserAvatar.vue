<template>
  <div class="avatar-block" role="avatar">
    <label
      class="avatar"
      :class="[canEdit ? 'hover' : '']"
      :for="canEdit ? 'file-input' : ''"
      :style="showBorder ? '' : 'border-width: 0px'"
    >
      <NuxtImg
        v-if="avatar"
        class="img"
        provider="strapi"
        :src="avatar.url"
        :width="size"
        :height="size"
        placeholder
        data-testid="img-avatar"
      />
      <v-avatar class="img" v-else :size="size" color="accent">
        <span class="text-white text-h5">{{ userInitials }}</span>
      </v-avatar>

      <div class="edit" v-if="canEdit" role="edit">
        <v-icon
          v-if="avatar"
          class="d-none"
          :size="smaller ? 'x-small' : 'x-large'"
          color="#fff"
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
          role="input"
        />
      </div>
    </label>

    <div
      v-if="canEdit && canDelete && avatar"
      role="delete"
      class="delete d-flex justify-center align-center"
      @click="removeProfilePicture"
      :style="
        smaller
          ? 'max-width: 18px !important; max-height: 18px !important; right: -8px; bottom: -5px;'
          : ''
      "
    >
      <NuxtImg src="/svg/trash.svg" width="20" height="20" placeholder />
    </div>
  </div>
</template>
<script setup lang="ts">
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
  canDelete: {
    type: Boolean,
    default: false,
  },
  size: { type: Number, default: 30 },

  profilePicture: {
    type: Object as PropType<{ url: string; id: number } | null>,
  },
});

const avatar = ref<{ id: number; url: string } | undefined | null>(
  props.profilePicture,
);

const { removeProfilePicture, uploadProfilePicture } = useProfilePicture(
  avatar,
  props.userId,
);

const userInitials = computed(() => {
  return getFullnameInitials(props.placeholder);
});

const getFullnameInitials = (fullname = '') => {
  const names = fullname.split(' ');
  const getInitial = (name) => (name ? name[0].toUpperCase() : '');

  const firstLetter = getInitial(names[0]);
  const secondLetter = getInitial(names[1]);

  return `${firstLetter}${secondLetter}`;
};

const smaller = computed(() => {
  return props.size < 100;
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
    cursor: pointer;
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
    vertical-align: middle;
    background: #e9494a;
    cursor: pointer;
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
        max-width: 14px;
        max-height: 14px;

        img {
          max-width: 14px;
          max-height: 14px;
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
          max-width: 70px !important;
          max-height: 70px !important;
        }
      }
      .delete {
        right: 0px;
        bottom: 5px !important;
        max-width: 14px;
        max-height: 14px;

        img {
          max-width: 12px;
          max-height: 12px;
        }
      }
    }
  }
}

@media (max-width: 350px) {
  .resize {
    .avatar-block {
      position: relative;
      .avatar {
        .img {
          max-width: 50px !important;
          max-height: 50px !important;
        }
      }
    }
  }
}
</style>
