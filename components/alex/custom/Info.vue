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
      class="title font-weight-bold text-h2 mb-4 mb-sm-6"
      :class="[
        !floatBeneath ? (darkerBackground ? 'darker-bg' : '') : '',
        startDateOrEndDate ? 'wrap' : '',
      ]"
      :style="[titleStyle ?? 'color: white;']"
      >{{ title }}</span
    >
    <div
      class="card d-flex flex-row justify-space-between w-100"
      :class="[
        canEdit && userId ? 'hover' : '',
        startDateOrEndDate ? 'wrap' : '',
      ]"
      style="position: relative; background-color: transparent"
    >
      <div
        class="d-flex flex-row align-center"
        :class="[
          biggerImage ? 'resize' : '',
          !floatBeneath ? (darkerBackground ? 'darker-bg' : '') : '',
        ]"
        style="align-self: flex-start"
        :style="
          floatBeneath && profilePictureSize
            ? `max-height: ${profilePictureSize / 3}px`
            : ''
        "
      >
        <app-user-avatar
          v-if="showProfilePicture"
          :show-border="showBorder"
          :profile-picture="profilePicture"
          :can-edit="userId ? canEdit : false"
          :can-delete="canDelete"
          :size="profilePictureSize"
          :avatar-style="avatarStyle"
          :user-id="userId ?? -1"
          :placeholder="fullname ?? ''"
          :style="[
            floatBeneath ? `transform: translateY(-${translateY}px);` : '',
          ]"
          :class="startDate || endDate ? 'absolute' : ''"
        />
        <div class="info" :class="[distribution, wrap ? 'flex-wrap' : '']">
          <span
            v-if="titleAbove && title"
            class="title mt-0 font-weight-bold text-h2 ml-2"
            :style="titleStyle ?? 'color: white;'"
            role="above"
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
      <div class="extra d-flex">
        <div class="block d-flex flex-column">
          <div
            v-if="startDateOrEndDate"
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
              :class="startDateAndEndDate ? 'mr-2 mr-sm-4' : ''"
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
              v-if="startDateAndEndDate"
              class="vertical"
              vertical
            ></v-divider>
            <v-divider
              v-if="startDateAndEndDate"
              class="horizontal"
              style="display: none"
            ></v-divider>
            <div
              v-if="endDate"
              class="d-flex flex-column justify-center align-start"
              :class="startDateAndEndDate ? 'ml-2 ml-sm-4' : ''"
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
            :class="[
              !floatBeneath
                ? darkerBackground
                  ? 'darker-bg'
                  : 'white-bg'
                : '',
              !titleAbove && title ? 'wrap' : '',
            ]"
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
          <v-icon @click="emit('display:settings')">{{ settingsIcon }}</v-icon>
        </div>
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
  settingsIcon: {
    type: String,
    default: 'mdi-cog-outline',
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

  avatarStyle: {
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

const startDateAndEndDate = computed(() => {
  return props.startDate && props.endDate;
});

const startDateOrEndDate = computed(() => {
  return props.startDate || props.endDate;
});

const isMaxWidthReached = computed(() => {
  const { profilePictureSize } = props;

  let temp = 500;
  if (profilePictureSize < 10) {
    temp = profilePictureSize * 40 + 250;
  } else if (profilePictureSize < 20) {
    temp = profilePictureSize * 20 + 250;
  } else if (profilePictureSize < 50) {
    temp = profilePictureSize * 13 + 300;
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
  &.float-beneath {
    .resize {
      display: flex;
      align-items: center;

      .avatar-block {
        align-items: center;
      }
    }
  }

  &.float-cover {
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
    .card {
      .extra {
        .d-flex.flex-column {
          .date {
            flex-direction: column;
            .d-flex {
              margin-right: 0px !important;
              align-items: center !important;
              justify-content: center !important;
            }
            .horizontal {
              display: flex !important;
            }
            .vertical {
              display: none !important;
            }
          }
        }
      }
    }
  }
}

.float-beneath {
  flex-direction: column-reverse !important;
  gap: 8px;

  .title {
    margin-top: -60px;
    &.wrap {
      margin-top: -25px;
    }
  }
  .d-flex {
    .d-flex.flex-row {
      width: 100%;
    }
  }

  .card {
    flex-direction: column;
    align-self: start !important;
    padding-block: 16px;

    .d-flex.flex-row {
      align-items: flex-start !important;

      .avatar-block.absolute {
        position: absolute;
        top: -50px;
      }
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

  .title {
    position: absolute;
    bottom: 62px;
  }
  .card {
    .d-flex.flex-row {
      .info {
        padding-left: 0px !important;
      }
    }

    .extra {
      align-items: flex-start;
      flex-direction: row;
      justify-content: flex-end;
      flex-wrap: wrap-reverse;
      align-self: flex-start;
      gap: 4px;

      .settings {
        align-self: flex-end;
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

@media (max-width: 520px) {
  .float-beneath {
    .card.wrap {
      flex-wrap: wrap;
      .info {
        margin-right: 40px;
      }

      .extra {
        width: 100%;
        align-items: center;
        justify-content: center;
      }

      .extra {
        justify-content: flex-end;
        .date {
          position: absolute;
          top: -300px;
          right: 0px;
        }

        .d-flex.mt-2.align-center.wrap {
          position: absolute;
          bottom: -35px;
          right: 8px;

          span {
            display: none;
          }
        }
      }

      .settings {
        position: absolute;
        right: 4px;
        top: 12px;
      }
    }
  }
}

@media (max-width: 480px) {
  .float-beneath {
    .card {
      .d-flex.flex-row {
        .avatar-block.absolute {
          top: -30px !important;
        }
      }

      &.wrap {
        .extra {
          justify-content: flex-end;

          .d-flex.mt-2.align-center.wrap {
            bottom: -10px;
          }
        }
      }

      .resize {
        display: flex;
        align-items: center;
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

  .title {
    font-size: 1rem !important;
  }
}

@media (max-width: 450px) {
  .float-beneath {
    .title.wrap {
      margin-top: 0px;
      margin-right: 30px;
    }
    .card {
      .d-flex.flex-row {
        max-height: unset !important;

        .info {
          margin-left: 0px !important;
        }

        .avatar-block.absolute {
          top: -20px !important;
        }

        .avatar-block {
          align-items: center;
          position: absolute;
          top: -15px;
        }
      }
      &.wrap {
        .extra {
          .d-flex.mt-2.align-center.wrap {
            bottom: -35px;
          }
        }
      }
    }
  }

  .float-cover {
    .title {
      margin-right: 50px;
    }
  }
}

@media (max-width: 404px) {
  .float-beneath {
    .card {
      .d-flex.flex-row {
        .info {
          margin-left: 0px;
        }

        .avatar-block.absolute {
          top: 0px !important;
        }
      }
      .resize {
        .avatar-block {
          top: 10px;
        }
      }
    }
  }

  .float-cover {
    .card {
      flex-wrap: wrap;
      align-self: flex-start;
      .d-flex.flex-row.align-center {
        padding-left: 16px;
      }
      .extra {
        width: 100%;
        align-items: flex-end;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: wrap-reverse;

        gap: 4px;
      }
    }
  }
}

@media (max-width: 310px) {
  .card {
    flex-direction: row !important;
    align-items: flex-start;
    gap: 8px;

    .info {
      align-self: flex-start;
    }

    .settings {
      justify-self: flex-start;
    }
  }

  .float-beneath {
    .resize {
      .avatar-block {
        top: 0px !important;
      }
    }
  }
}
</style>
