<template>
  <div
    class="info-block d-flex justify-space-between align-center w-100"
    :class="
      floatBeneath
        ? 'float-beneath pl-6 pl-sm-8 pr-xl-10 pr-md-8 pr-sm-6 pr-xs-4  '
        : 'float-cover pt-6 pb-4 px-6'
    "
  >
    <div
      class="w-100 h-100"
      style="top: 0; left: 0; opacity: 0.1; height: auto; position: absolute"
      :style="
        showShade
          ? 'background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.24) 53.12%, rgba(0, 0, 0, 0.3) 61.46%, rgba(0, 0, 0, 0.6) 93.75%);'
          : ''
      "
    ></div>
    <div
      class="card d-flex flex-column w-100"
      :class="[canEdit ? 'hover' : '']"
      style="position: relative; background-color: transparent"
    >
      <span
        v-if="!biggerImage"
        class="title-cover font-weight-bold text-h3 text-md-h2"
        style="display: none"
        :style="titleStyle ? titleStyle : 'color: white;'"
        >{{ title }}</span
      >

      <div
        class="d-flex flex-row align-center"
        :class="biggerImage ? 'resize' : ''"
      >
        <app-user-avatar
          show-border
          :profile-picture="profilePicture"
          :can-edit="canEdit"
          :size="biggerImage ? 160 : 80"
          :user-id="userId"
          :placeholder="fullname ?? ''"
        />

        <div class="info" :class="[distribution, wrap ? 'flex-wrap' : '']">
          <span
            class="title-beneath font-weight-bold text-h3 text-md-h2 ml-2"
            :style="[
              biggerImage ? '' : 'display: none',
              titleStyle ? titleStyle : 'color: white;',
            ]"
            >{{ title }}</span
          >
          <div class="d-flex" :class="wrap ? 'flex-wrap' : ''">
            <span
              v-if="fullname"
              class="font-weight-normal ml-2 text-h5 text-sm-h4 text-md-h3"
              style="letter-spacing: 0.8"
              :style="fullnameStyle"
            >
              {{ fullname }}
            </span>
            <span
              v-if="username"
              class="username ml-2 text-h6 text-sm-h5 text-md-h4"
              :style="roleStyle"
              >@{{ username }}
            </span>
          </div>

          <span v-if="showRole" class="role ml-2 text-h6 text-sm-h5 text-md-h4">
            {{
              isProfessor
                ? $t('pages.profile.teacher')
                : $t('pages.profile.student')
            }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/*
 <div class="card">


      <div class="info">
        <div class="d-flex">
          <span v-if="showFullname" class="fullname">
            {{ fullname }}
          </span>
          <span v-if="showUsername" class="username">@{{ username }} </span>
        </div>

        <span v-if="showRole" class="role">
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


*/
const emit = defineEmits(['alternative:settings', 'display:settings']);
const client = useStrapiClient();
const { updateImage, uploadImage, removeImage } = useUploadedImage();
const props = defineProps({
  profilePicture: {
    type: Object as PropType<{ url: string; id: number } | null>,
    required: true,
  },

  userId: {
    type: Number,
    required: true,
  },

  floatBeneath: {
    type: Boolean,
    default: false,
  },

  showShade: {
    type: Boolean,
    default: false,
  },

  resize: {
    type: Boolean,
    default: false,
  },

  showRole: {
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

  wrap: {
    type: Boolean,
    default: true,
  },

  updateProfilePicture: {
    type: Boolean,
    default: false,
  },

  fullname: {
    type: String,
  },

  fullnameStyle: {
    type: String,
  },

  titleStyle: {
    type: String,
  },

  roleStyle: {
    type: String,
  },

  title: {
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
    required: true,
  },
  size: {
    type: Number,
    default: 150,
  },

  isProfessor: { type: Boolean, default: false },
  canEdit: { type: Boolean, required: true },
});

const biggerImage = computed(() => {
  return props.resize && props.size > 100;
});
</script>

<style scoped lang="scss">
.float-beneath {
  .avatar-block {
    position: absolute;
    top: -90px;
  }
  .d-flex {
    .info {
      margin-left: 152px;
      margin-block: 16px;
    }
  }

  .title-beneath {
    display: flex !important;
  }
}
.float-cover {
  position: absolute;
  bottom: 60px;
  .avatar-block {
    position: relative;
  }
  .title-cover {
    display: flex !important;
  }
}
.info-block {
  display: flex;
  flex-direction: row;
  width: 100%;
  transition: all ease-in-out 1s;
  gap: 12px;

  .card {
    .single-row {
      justify-content: center;
      align-items: center;

      .d-flex {
        align-items: center !important;
        justify-content: center !important;
      }
    }

    .single-column {
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;

      .d-flex {
        align-items: flex-start !important;
        justify-content: center !important;
        flex-direction: column;
      }
    }

    .fullname-username-role {
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;

      .d-flex {
        align-items: baseline !important;
        justify-content: center !important;
      }
    }

    .fullname-role-username {
      flex-direction: row;
      justify-content: center;
      align-items: baseline;

      .d-flex {
        flex-direction: column;
        align-items: flex-start !important;
        justify-content: center !important;
        gap: 0px;
      }
    }

    .username-fullname-role {
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;

      .d-flex {
        flex-direction: row-reverse;
        align-items: baseline !important;
        justify-content: center !important;
      }
    }

    .username-role-fullname {
      flex-direction: row;
      justify-content: center;
      align-items: baseline;

      .d-flex {
        flex-direction: column-reverse;
        align-items: center !important;
        justify-content: center !important;
      }
    }

    .info {
      display: flex;

      padding-left: 16px;
      transition: all ease-in-out 1s;

      .d-flex {
        .fullname {
          color: #0d4173;
          font-size: 24px;
          font-style: normal;
          font-weight: bold;
          line-height: 28px;
        }

        .username {
          color: #abb2b9;
          font-weight: 400;
          line-height: 28px;
        }
      }

      .role {
        color: #abb2b9;

        font-weight: 400;
        letter-spacing: 0.8px;
      }
    }
  }
}
@media (max-width: 700px) {
  .card {
    .info {
      .d-flex.flex-wrap {
        justify-content: flex-start !important;
      }
    }
  }
}

@media (max-width: 469px) {
  .float-beneath {
    .resize {
      display: flex;
      align-items: center;

      .avatar-block {
        margin-top: 35px;
        align-items: center;
      }

      .info {
        margin-left: 100px !important;
      }
    }
  }

  .float-cover {
    .resize {
      .avatar-block {
        .avatar {
          .img {
            width: 80px !important;
            height: 80px !important;
          }
        }
      }
    }
  }
}

@media (max-width: 403px) {
  .float-beneath {
    .resize {
      display: flex;
      align-items: center;

      .avatar-block {
        margin-top: -5px;
        align-items: center;
      }

      .info {
        margin-left: 0px !important;
      }
    }
  }
}

@media (max-height: 740px) {
  .float-beneath {
    .avatar-block {
      margin-top: 30px;
      align-items: center;
    }
    .info {
      margin-left: 118px !important;
    }
  }

  @media (max-width: 469px) {
    .float-beneath {
      .resize {
        display: flex;
        align-items: center;

        .avatar-block {
          margin-top: 50px;
          align-items: center;
        }

        .info {
          margin-left: 98px !important;
        }
      }
    }
  }

  @media (max-width: 404px) {
    .float-beneath {
      .resize {
        display: flex;
        align-items: center;

        .avatar-block {
          margin-top: 0px;
          align-items: center;
        }

        .info {
          margin-left: 0px !important;
        }
      }
    }
  }
}

/*

@media (max-width: 450px) {
  .usedr-block {
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

        .username {
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
  .car9d {
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

      .username {
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
}*/
</style>
