<template>
  <div
    class="info-block d-flex w-100"
    :class="[
      floatBeneath
        ? 'float-beneath w-100 pl-6 pl-sm-8 pr-xl-10 pr-md-8 pr-sm-6 pr-xs-4  '
        : 'float-cover  h-100 pb-4 px-6 mt-4 mt-sm-6',
      darkerBackground && floatBeneath ? 'darker-bg rounded-t-0' : '',
      isMaxWidthReached ? 'breakpoint' : '',
    ]"
    data-testid="info"
  >
    <span
      v-if="!titleAbove && title"
      class="font-weight-bold text-h3 text-md-h2 mb-6"
      :class="[
        !floatBeneath ? (darkerBackground ? 'darker-bg' : '') : '',
        
      ]"
      :style="[titleStyle ?? 'color: white;', floatBeneath && (startDate || endDate) ? 'margin-top: -25px; !important' : '',]"
      >{{ title }}</span
    >
    <div
      class="card d-flex flex-row justify-space-between w-100"
      :class="[canEdit && userId ? 'hover' : '']"
      style="position: relative; background-color: transparent"
    >
      <div
        class="d-flex flex-row align-center"
        :class="[
          biggerImage ? 'resize' : '',
          !floatBeneath ? (darkerBackground ? 'darker-bg' : '') : '',
        ]"
        style="align-self: flex-start"
        :style="floatBeneath ? `max-height: ${profilePictureSize / 3}px` : ''"
      >
        <app-user-avatar
          v-if="showProfilePicture"
          :show-border="showBorder"
          :profile-picture="profilePicture"
          :can-edit="userId ? canEdit : false"
          :can-delete="canDelete"
          :size="profilePictureSize"
          :user-id="userId ?? -1"
          :placeholder="fullname ?? ''"
          :style="[
            floatBeneath ? `transform: translateY(-${translateY}px);` : '',
            avatarBlockStyle ?? '',
          ]"
        />
        <div class="info" :class="[distribution, wrap ? 'flex-wrap' : '']">
          <span
            v-if="titleAbove && title"
            class="font-weight-bold text-h3 text-md-h2 ml-2"
            :style="titleStyle ?? 'color: white;'"
            >{{ title }}</span
          >

          <div class="d-flex" :class="wrap ? 'flex-wrap' : ''">
            <span
              v-if="fullname"
              class="font-weight-normal ml-2 text-h5 text-sm-h4 text-md-h3"
              style="letter-spacing: 0.8"
              :style="fullnameStyle ?? 'color: white;'"
            >
              {{ fullname }}
            </span>
            <span
              v-if="username"
              class="username ml-2 text-h6 text-sm-h5 text-md-h4"
              :style="usernameStyle ?? 'color: white;'"
              >@{{ username }}
            </span>
          </div>

          <span
            v-if="showRole"
            class="role ml-2 text-h6 text-sm-h5 text-md-h4"
            :style="roleStyle ?? 'color: white;'"
            role="role"
          >
            {{
              isProfessor
                ? $t('pages.profile.teacher')
                : $t('pages.profile.student')
            }}
          </span>
        </div>
      </div>
      <div class="d-flex flex-column">
        <div
          v-if="startDate || endDate"
          class="date d-flex py-1 py-sm-2 px-2 px-sm-4 rounded-lg ml-4 ml-sm-6"
          style="gap: 8px"
          :style="[
            !floatBeneath
              ? darkerBackground
                ? 'background-color: rgba(0, 0, 0, 0.5); color: white'
                : 'background-color: white; color: #232b32'
              : '',
          ]"
        >
          <div
            v-if="startDate"
            class="d-flex flex-column justify-center align-end"
            :class="startDate && endDate ? 'mr-2 mr-sm-4' : ''"
            :style="startDateStyle ?? ''"
          >
            <span style="font-size: 14px; letter-spacing: 0.28px">
              {{ $t('pages.profile.startDate') }}</span
            >
            <span class="font-weight-bold" style="white-space: nowrap">{{
              startDate
            }}</span>
          </div>
          <v-divider
            v-if="startDate && endDate"
            class="vertical"
            vertical
          ></v-divider>
          <v-divider
            v-if="startDate && endDate"
            class="horizontal"
            style="display: none"
          ></v-divider>
          <div
            v-if="endDate"
            class="d-flex flex-column justify-center align-start"
            :class="startDate && endDate ? 'ml-2 ml-sm-4' : ''"
            :style="endDateStyle ?? ''"
          >
            <span style="font-size: 14px; letter-spacing: 0.28px">
              {{ $t('pages.profile.endDate') }}</span
            ><span class="font-weight-bold" style="white-space: nowrap">{{
              endDate
            }}</span>
          </div>
        </div>

        <div
          v-if="code"
          class="d-flex align-center py-1 py-sm-2 px-2 px-sm-4 mt-2 rounded-lg ml-4 ml-sm-6"
          :class="
            !floatBeneath ? (darkerBackground ? 'darker-bg' : 'white-bg') : ''
          "
          style="gap: 8px; cursor: pointer; align-self: flex-end"
          :style="codeStyle ?? ''"
          @click="copyToClipboard(code)"
        >
          <v-icon style="flex-grow: 0" size="20">mdi-content-copy</v-icon>
          <span style="flex-grow: 0">{{ code }}</span>
        </div>
      </div>

      <div
        v-if="canEdit && showSettings"
        class="settings mx-1 py-1 px-1 mx-xs-2"
        :class="darkerBackground ? 'darker-bg' : ''"
        style="height: min-content; color: #6e7a87"
        role="settings"
      >
        <v-icon @click="emit('display:settings')">mdi-cog-outline</v-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['display:settings']);
const props = defineProps({
  profilePicture: {
    type: Object as PropType<{ url: string; id: number } | null>,
  },

  userId: {
    type: Number,
  },

  showProfilePicture: {
    type: Boolean,
    default: false,
  },

  showBorder: {
    type: Boolean,
    default: false,
  },

  showSettings: { type: Boolean, default: false },

  floatBeneath: {
    type: Boolean,
    default: false,
  },

  resize: {
    type: Boolean,
    default: false,
  },

  profilePictureSize: {
    type: Number,
    default: 160,
  },

  showRole: {
    type: Boolean,
    default: false,
  },

  titleAbove: {
    type: Boolean,
    default: false,
  },

  darkerBackground: {
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

  codeStyle: {
    type: String,
  },

  avatarBlockStyle: {
    type: String,
  },

  startDateStyle: {
    type: String,
  },
  endDateStyle: {
    type: String,
  },
  fullnameStyle: {
    type: String,
  },

  usernameStyle: {
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

  code: {
    type: String,
  },
  username: {
    type: String,
  },

  isProfessor: { type: Boolean, default: false },
  canEdit: { type: Boolean, default: false },
  canDelete: { type: Boolean, default: false },
});

const biggerImage = computed(() => {
  return props.resize && props.profilePictureSize > 100;
});

const translateY = computed(() => {
  let profilePictureSize, ratio;
  if (props.profilePictureSize >= 160) {
    profilePictureSize = 160;
  } else {
    profilePictureSize = props.profilePictureSize;
  }

  ratio = (100 * profilePictureSize) / (60 + profilePictureSize);

  return (profilePictureSize * ratio) / profilePictureSize;
});

const currentWidth = ref(window.innerWidth);

// Update the currentWidth when the window is resized
window.addEventListener('resize', () => {
  currentWidth.value = window.innerWidth;
});

const isMaxWidthReached = computed(() => {
  const { profilePictureSize } = props;

  let temp = 550;
  if (profilePictureSize < 10) {
    temp = profilePictureSize * 40 + 250;
  } else if (profilePictureSize < 20) {
    temp = profilePictureSize * 20 + 250;
  } else if (profilePictureSize < 50) {
    temp = profilePictureSize * 10 + 250;
  } else if (profilePictureSize < 100) {
    temp = profilePictureSize * 5 + 200;
  } else if (profilePictureSize < 160) {
    temp = profilePictureSize * 3 + 250;
  }
  return currentWidth.value < temp;
});

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
}
</script>

<style scoped lang="scss">
.darker-bg {
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white !important;
}

.white-bg {
  background-color: white;
  color: #232b32;
}

.breakpoint {
  .float-beneath {
    .resize {
      display: flex;
      align-items: center;

      .avatar-block {
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

  .date {
    flex-direction: column;
    .d-flex {
      margin-right: 0px !important;
      align-items: flex-end !important;
      justify-content: flex-end !important;
    }
    .horizontal {
      display: flex !important;
    }
    .vertical {
      display: none !important;
    }
  }
}

.float-beneath {
  flex-direction: column-reverse !important;
  gap: 8px;
  .font-weight-bold.text-h3 {
    margin-top: -60px;
  }
  .d-flex {
    .d-flex.flex-row {
      width: 100%;
    }
  }

  .card {
    margin-block: 16px;
    flex-direction: column;
    align-self: start !important;

    .d-flex.flex-row {
      align-items: flex-start !important;
    }
  }
}
.float-cover {
  position: absolute;
  top: 0px;
  width: 100%;
  display: flex;
  flex-direction: row;
  transition: all ease-in-out 1s;
  gap: 8px;
  .darker-bg {
    padding-inline: 8px;
    padding-block: 16px;
  }

  .font-weight-bold.text-h3 {
    position: absolute;
    bottom: 68px;
  }
  .card {
    .d-flex.flex-row {
      .info {
        padding-left: 0px !important;
      }
    }
  }
  .avatar-block {
    position: relative;
  }
}
.info-block {
  display: flex;
  flex-direction: row;

  transition: all ease-in-out 1s;

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
        align-items: flex-start !important;
        justify-content: center !important;
      }
    }

    .info {
      display: flex;

      padding-left: 8px;
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
@media (max-width: 900px) {
  .card {
    .username-role-fullname.flex-wrap {
      align-items: baseline;
      justify-content: flex-start;

      .d-flex {
        align-items: flex-start !important;
        justify-content: flex-start !important;
      }
    }

    .single-row.flex-wrap,
    .fullname-username-role {
      justify-content: flex-start !important;

      .d-flex.flex-wrap {
        align-items: center !important;
        justify-content: flex-start !important;
      }
    }

    .username-fullname-role.flex-wrap {
      align-items: flex-start !important;
      justify-content: flex-start !important;
      .d-flex.flex-wrap {
        align-items: baseline !important;
        justify-content: flex-end !important;
      }
    }

    .single-column.flex-wrap,
    .fullname-role-username.flex-wrap {
      .d-flex.flex-wrap {
        align-items: flex-start !important;
        justify-content: flex-start !important;
      }
    }
  }
}

@media (max-width: 480px) {
  .float-beneath {
    .card {
      .resize {
        display: flex;
        align-items: center;

        .avatar-block {
          align-items: center;
        }

        .info {
          margin-left: -80px !important;
        }
      }
    }
  }

  .float-cover {
    padding-inline: 8px !important;
    .card {
      gap: 4px;

      .date {
        padding-inline: 4px !important;
      }
    }
  }

  .font-weight-bold.text-h3 {
    font-size: 1rem !important;
  }
}

@media (max-width: 370px) {
  .float-cover {
    .card {
      .date {
        margin-left: 0px !important;
      }
    }

    .settings {
      position: absolute;
      bottom: 140px;
      right: 8px;
    }
  }
}

@media (max-width: 310px) {
  .card {
    flex-wrap: wrap;
    justify-content: center !important;
    align-items: start !important;
    align-self: start;
    gap: 8px;
    .date {
      flex-direction: row;
      margin-left: 0px !important;
      .vertical {
        display: block !important;
      }

      .horizontal {
        display: none !important;
      }
    }
  }
}

@media (max-height: 740px) {
  .float-beneath {
    .avatar-block {
      align-items: center;
    }
  }

  @media (max-width: 520px) {
    .float-beneath {
      .resize {
        display: flex;
        align-items: center;

        .avatar-block {
          align-items: center;
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
          align-items: center;
        }

        .info {
          margin-left: 0px !important;
        }
      }
    }
  }
}
</style>
