<template>
  <div class="avatar-block" role="avatar">
    <label
      class="avatar"
      :class="[userIdCanEdit ? 'hover' : '']"
      :for="userIdCanEdit ? 'file-input' : ''"
      :style="[avatarStyle ?? '', showBorder ? '' : 'border-width: 0px']"
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
      <v-avatar v-else class="img" :size="size" color="accent">
        <span class="text-white text-h5">{{ userInitials }}</span>
      </v-avatar>

      <div v-if="userIdCanEdit" class="edit" role="edit">
        <v-icon
          v-if="avatar"
          class="d-none"
          :size="small ? 'small' : 'x-large'"
          color="#fff"
          >mdi-pencil-outline</v-icon
        >
        <v-icon v-else class="d-none" size="x-large" color="#fff"
          >mdi-plus</v-icon
        >
        <input
          id="file-input"
          class="d-none"
          accept="image/png, image/jpeg"
          type="file"
          role="input"
          @input="uploadProfilePicture"
        />
      </div>
    </label>

    <alex-custom-button
      v-if="userIdCanEdit && canDelete && avatar"
      role="delete"
      class="delete d-flex justify-center align-center"
      variant="error"
      :loading="isLoading"
      :class="[
        xlarge
          ? 'x-large'
          : large
          ? 'large'
          : small
          ? 'small'
          : xsmall
          ? 'x-small'
          : 'xx-small',
      ]"
      @click="removeProfilePicture"
    >
      <img src="/svg/trash.svg" width="20" height="20" />
    </alex-custom-button>
  </div>
</template>
<script setup lang="ts">
/*
  This is a description
*/
export interface ProfilePictureItemType {
  url: string;
  id: number;
}

export interface AppUserAvatarComponentType {
  userId?: number; // user id
  placeholder?: string;
  avatarStyle?: string;
  showBorder?: boolean;
  canEdit?: boolean;
  trackCurrentUser?: boolean;
  canDelete?: boolean;
  size?: number;
  profilePicture?: ProfilePictureItemType | null;
}
const userStore = useUserStore();

const props = withDefaults(defineProps<AppUserAvatarComponentType>(), {
  userId: undefined,
  avatarStyle: undefined,
  placeholder: '',
  showBorder: false,
  canDelete: false,
  canEdit: false,
  size: 30,
  profilePicture: null,
});

const avatar = computed<ProfilePictureItemType | null | undefined>(() =>
  props.trackCurrentUser && userStore.user
    ? userStore.user?.avatar
    : props.profilePicture,
);

const fullname = computed<string | null | undefined>(() =>
  props.trackCurrentUser && userStore.user
    ? userStore.user?.fullname
    : props.placeholder,
);
const { uploadProfilePicture, removeProfilePicture, isLoading } =
  useProfilePicture(avatar, props.userId);

const userInitials = computed(() => {
  return getFullnameInitials(
    props.trackCurrentUser
      ? userStore.user?.fullname ?? ''
      : fullname.value ?? '',
  );
});

const userIdCanEdit = computed(() => props.canEdit && props.userId);

const getFullnameInitials = (fullname = '') => {
  const names = fullname.split(' ');
  const getInitial = (name) => (name ? name[0].toUpperCase() : '');

  const firstLetter = getInitial(names[0]);
  const secondLetter = getInitial(names[1]);

  return `${firstLetter}${secondLetter}`;
};

const xsmall = computed(() => {
  return props.size > 45;
});

const small = computed(() => {
  return props.size > 60;
});

const large = computed(() => {
  return props.size > 95;
});

const xlarge = computed(() => {
  return props.size > 130;
});
</script>

<style scoped lang="scss">
.avatar-block {
  position: relative;
  width: min-content;
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
    position: absolute;
    max-width: 32px;
    padding: 0px !important;
    min-width: 20px;
    border-radius: 8px;

    display: flex;
    justify-content: center;
    align-items: center;
    vertical-align: middle;
    background: #e9494a;
    cursor: pointer;

    bottom: 15px;
    right: 0px;
    &.x-large {
      width: 32px;
      height: 32px;
      bottom: 15px;
      img {
        width: 22px;
        height: 22px;
      }
    }

    &.large {
      width: 28px;
      height: 28px;

      img {
        width: 20px;
        height: 20px;
      }
    }

    &.small {
      width: 24px;
      height: 24px;

      img {
        width: 18px;
        height: 18px;
      }
    }

    &.x-small {
      width: 20px;
      height: 20px;

      img {
        width: 16px;
        height: 16px;
      }
    }

    &.xx-small {
      width: 16px;
      height: 16px;

      img {
        width: 12px;
        height: 12px;
      }
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
        &.x-large {
          width: 28px;
          height: 28px;

          img {
            width: 20px;
            height: 20px;
          }
        }

        &.large {
          width: 26px;
          height: 26px;
          right: -2px;
          img {
            width: 18px;
            height: 18px;
          }
        }
      }
    }
  }
}

@media (max-width: 404px) {
  .resize {
    .avatar-block {
      position: relative;
      .avatar {
        .img {
          max-width: 75px !important;
          max-height: 75px !important;
        }
      }
      .delete {
        right: 0px;
        bottom: 5px !important;

        width: 24px !important;
        height: 24px !important;

        img {
          width: 16px !important;
          height: 16px !important;
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
          max-width: 60px !important;
          max-height: 60px !important;
        }
      }
      .delete {
        right: 0px;
        bottom: 0px !important;

        width: 20px !important;
        height: 20px !important;

        img {
          width: 16px !important;
          height: 16px !important;
        }
      }
    }
  }
}
</style>
