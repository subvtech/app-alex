<template>
  <div
    class="info-block d-flex w-100"
    :class="[
      floatBeneath
        ? 'float-beneath pl-6 pl-sm-8 pr-xl-10 pr-md-8 pr-sm-6 pr-xs-4  '
        : 'float-cover flex-column h-100 pb-4 px-6 mt-4 mt-sm-6',
      darkerBackground && floatBeneath ? 'darker-bg rounded-t-0' : '',
      title && descriptionAbove ? 'hasTitle' : '',
    ]"
    data-testid="info"
  >
    <div
      class="card d-flex flex-row justify-space-between w-100 h-100 flex-wrap"
      :class="[
        canEdit && userId ? 'hover' : '',
        startDateOrEndDate ? 'wrap' : '',
      ]"
    >
      <div
        class="d-flex flex-column justify-space-between ga-2 title-container"
      >
        <div class="d-flex flex-column ga-2">
          <div
            v-if="title || subtitle"
            class="title-block d-flex flex-column"
            :class="[
              !floatBeneath ? (darkerBackground ? 'darker-bg' : '') : '',
            ]"
          >
            <span
              v-if="title"
              class="title font-weight-bold"
              :class="[startDateOrEndDate ? 'wrap' : '']"
              :style="[titleStyle ?? 'color: white;']"
              >{{ title }}</span
            >
            <span
              v-if="subtitle"
              class="subtitle font-weight-bold ellipsis lines-2"
              :class="[startDateOrEndDate ? 'wrap' : '']"
              :style="[subtitleStyle ?? 'color: white;']"
              >{{ subtitle }}</span
            >
          </div>

          <div
            class="d-flex flex-row align-center"
            :class="[
              biggerImage ? 'resize' : '',
              !floatBeneath ? (darkerBackground ? 'darker-bg' : '') : '',
            ]"
            style="align-self: flex-start"
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
              :style="
                floatBeneath && profilePictureSize && profilePictureSize < 160
                  ? `top: -${profilePictureSize / 3}px`
                  : ''
              "
              :class="startDate || endDate ? 'absolute' : ''"
            />
            <div
              class="info"
              :class="[
                distribution,
                wrap ? 'flex-wrap' : '',
                showProfilePicture ? 'absolute' : '',
              ]"
              :style="
                floatBeneath &&
                profilePictureSize &&
                profilePictureSize < 160 &&
                showProfilePictureAndProfilePicture
                  ? `margin-left: ${profilePictureSize}px`
                  : ''
              "
            >
              <div v-if="descriptionAbove" class="description-block">
                <span
                  v-if="description"
                  class="title amt-0 font-weight-bold text-h2"
                  :class="[floatBeneath ? 'ml-2' : '']"
                  :style="titleStyle ?? 'color: white;'"
                  role="above"
                  >{{ description }}</span
                >
              </div>

              <div class="d-flex" :class="wrap ? 'flex-wrap' : ''">
                <span
                  v-if="fullname"
                  class="fullname font-weight-normal ml-2"
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
        </div>
        <div v-if="!descriptionAbove" class="description-block">
          <span
            v-if="description"
            class="mt-0 font-weight-bold text-sm-h2 text-h3"
            :class="[floatBeneath ? 'ml-2' : '']"
            :style="titleStyle ?? 'color: white;'"
            role="below"
            >{{ description }}</span
          >
        </div>
      </div>
      <div class="extra d-flex" :class="[showSettings ? 'no-settings' : '']">
        <div class="block d-flex flex-column">
          <div
            v-if="startDateOrEndDate"
            class="date d-flex py-1 py-sm-2 px-2 px-sm-4 rounded-lg"
            :class="[
              !floatBeneath
                ? darkerBackground
                  ? 'darker-bg'
                  : 'white-bg'
                : darkerBackground
                ? 'darker-bg'
                : '',
            ]"
            style="gap: 8px"
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
          <!-- removido temporiariamente -->
          <!-- <div
            v-if="copyObject"
            class="code d-flex align-center py-1 py-sm-2 px-2 px-sm-4 rounded-lg ml-4 ml-sm-6"
            :class="[
              !floatBeneath
                ? darkerBackground
                  ? 'darker-bg'
                  : 'white-bg'
                : '',
              title ? 'absolute' : '',
            ]"
            style="gap: 8px; cursor: pointer; align-self: flex-end"
            :style="codeStyle ?? ''"
            @click="copyToClipboard(copyObject.copyText)"
          >
            <v-icon class="flex-grow-0" size="20">mdi-content-copy</v-icon>
            <span class="flex-grow-0">{{ copyObject.label }}</span>
          </div> -->
        </div>
        <alex-custom-tooltip
          v-if="canEdit && showSettings"
          :text="$t('components.card.settings')"
        >
          <template #content>
            <div
              class="settings mx-1 py-1 px-1 mx-xs-2"
              :class="[
                darkerBackground ? 'darker-bg' : '',
                showProfilePictureAndProfilePicture ? 'absolute' : '',
              ]"
              style="height: min-content; color: #6e7a87"
              role="settings"
            >
              <v-icon @click="emit('display:settings')">{{
                settingsIcon
              }}</v-icon>
            </div>
          </template>
        </alex-custom-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProfilePictureItemType } from '~/components/AppUserAvatar.vue';

const emit = defineEmits(['display:settings']);
interface MyProps {
  profilePicture?: ProfilePictureItemType | null;
  userId: number;
  showProfilePicture: boolean;
  showBorder: boolean;
  showSettings: boolean;
  floatBeneath: boolean;
  resize: boolean;
  profilePictureSize: number;
  showRole: boolean;
  settingsIcon: string;
  descriptionAbove: boolean;
  darkerBackground: boolean;
  distribution:
    | 'single-row'
    | 'single-column'
    | 'fullname-username-role'
    | 'fullname-role-username'
    | 'username-fullname-role'
    | 'username-role-fullname';
  wrap?: boolean;
  updateProfilePicture: boolean;
  fullname?: string;
  description?: string;
  codeStyle?: string;
  avatarStyle?: string;
  startDateStyle?: string;
  endDateStyle?: string;
  fullnameStyle?: string;
  usernameStyle?: string;
  titleStyle?: string;
  subtitleStyle?: string;
  roleStyle?: string;
  title?: string;
  subtitle?: string;
  startDate?: string;
  endDate?: string;
  copyObject?: { label: string; copyText: string };
  username?: string;
  isProfessor: boolean;
  canEdit: boolean;
  canDelete: boolean;
}
const props = withDefaults(defineProps<MyProps>(), {
  profilePicture: null,
  showProfilePicture: false,
  showBorder: false,
  showSettings: false,
  floatBeneath: false,
  resize: false,
  profilePictureSize: 160,
  showRole: false,
  settingsIcon: 'mdi-cog-outline',
  descriptionAbove: false,
  darkerBackground: false,
  distribution: 'fullname-username-role',
  wrap: true,
  updateProfilePicture: false,
  isProfessor: false,
  canEdit: false,
  canDelete: false,
  fullname: undefined,
  description: undefined,
  codeStyle: undefined,
  avatarStyle: undefined,
  startDateStyle: undefined,
  endDateStyle: undefined,
  fullnameStyle: undefined,
  usernameStyle: undefined,
  titleStyle: undefined,
  subtitleStyle: undefined,
  roleStyle: undefined,
  title: undefined,
  subtitle: undefined,
  startDate: undefined,
  endDate: undefined,
  copyObject: undefined,
  username: undefined,
});
// const { copyToClipboard } = useCopyText();
const biggerImage = computed(() => {
  return props.resize && props.profilePictureSize > 100;
});

const currentWidth = ref(window.innerWidth);
const showProfilePictureAndProfilePicture = computed(() => {
  return props.showProfilePicture && props.profilePicture;
});
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
</script>

<style scoped lang="scss">
.flex-grow-0 {
  flex-grow: 0;
}
.darker-bg {
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white !important;
}

.white-bg {
  background-color: white;
  color: #232b32;
}
.title-container {
  max-width: 80%;
}

.float-beneath {
  flex-direction: column-reverse !important;
  gap: 8px;

  &.hasTitle {
    flex-direction: column !important;
    margin-block: 0px !important;
    .title {
      margin-left: 180px;
    }
    .card {
      .d-flex.flex-row {
        margin-top: 10px;
        .avatar-block.absolute {
          position: absolute;
          top: -135px;
        }
      }
    }
  }

  .card {
    flex-direction: column;
    align-self: start !important;
    padding-block: 16px;
    position: relative;

    .d-flex.flex-row {
      align-items: flex-start !important;
      width: 100%;
      .avatar-block {
        position: absolute;

        top: -88px;
      }

      .info.absolute {
        margin-left: 156px;
      }
    }

    .extra {
      .code.absolute {
        position: absolute;
        bottom: 0px;
      }
    }
  }
}
.float-cover {
  position: absolute;
  top: 0px;
  max-height: 360px;
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 8px;
  .darker-bg {
    padding-inline: 16px;
    padding-block: 8px;
  }

  .description-block {
    position: absolute;
    bottom: 24px;
  }
  .title-block {
    .title.absolute {
      position: absolute;
      bottom: 62px;
    }
  }

  .card {
    .d-flex.flex-column.justify-space-between {
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

      .block {
        gap: 8px;
      }

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
  .card {
    position: relative;
    background-color: transparent;
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

      .d-flex {
        .fullname {
          color: #0d4173;
          font-size: 16px;
          font-style: normal;
          font-weight: bold;
          line-height: 28px;
          width: max-content;
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

  .title-block {
    .title {
      font-size: 16px;
    }
    .subtitle {
      font-size: 24px;
      word-wrap: break-word;
    }
  }
}

@media (max-height: 740px) {
  .float-beneath {
    .card {
      .d-flex.flex-column {
        .d-flex.flex-column {
          .info.absolute {
            margin-left: 124px;
          }
          .title-block {
            margin-left: 124px;
          }
        }
      }
      .d-flex.flex-row.resize {
        .avatar-block {
          top: -60px;
        }
      }
    }
  }

  @media (max-width: 480px) {
    .float-beneath {
      .card {
        .d-flex.flex-column {
          .info.absolute {
            margin-left: 96px;
          }
          .info {
            margin-left: 0px;
          }
          .title-block {
            margin-left: 0px;
          }
          .avatar-block.absolute {
            top: -105px;
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

        .extra {
          &.no-settings {
            .date {
              top: -360px !important;
            }

            .settings.absolute {
              position: absolute;
              top: -40px;
            }

            .code {
              position: absolute;
              bottom: 30px !important;
            }
          }
          .code {
            span {
              display: none;
            }
          }
        }

        .d-flex.flex-row.resize {
          display: flex;
          align-items: center;
        }
      }

      &.hasTitle {
        .card {
          .d-flex.flex-row {
            .avatar-block.absolute {
              top: -160px;
            }
          }
        }
      }
    }

    .float-cover {
      padding-inline: 8px !important;
      .card {
        gap: 4px;

        .extra {
          .block {
            .date {
              padding-inline: 4px !important;
            }
            .code {
              span {
                display: none;
              }
            }
          }
        }
      }
    }

    .title {
      font-size: 1rem !important;
    }
  }
}

@media (max-width: 900px) {
  .card {
    .extra {
      margin-top: 0px;
    }
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

@media (max-width: 700px) {
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

        .date {
          position: absolute;
          top: -360px;
          right: 0px;
          &.darker-bg {
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            right: 5px;
          }

          &.white-bg {
            background-color: white;
            color: #232b32;
          }
        }

        &.no-settings {
          .date {
            top: -290px !important;
          }

          .settings.absolute {
            position: absolute;
            top: 10px;
          }

          .code {
            position: absolute;
            bottom: 20px !important;
            right: 0px !important;
          }
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

      .settings.absolute {
        position: absolute;
        right: 0px;
        top: 12px;
      }
    }
  }
}

@media (max-width: 600px) {
  .float-cover {
    .card {
      .extra {
        .block {
          .date {
            flex-direction: row;
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

@media (max-width: 480px) {
  .float-beneath {
    .card {
      .d-flex.flex-column {
        .d-flex.flex-column {
          .info.absolute {
            margin-left: 99px;
          }
          .info {
            margin-left: 0px;
          }
          .title-block {
            margin-left: 99px !important;
          }
        }

        .avatar-block {
          top: -55px !important;
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

      .extra {
        &.no-settings {
          .date {
            top: -360px !important;
          }

          .settings.absolute {
            position: absolute;
            top: -40px;
          }

          .code {
            position: absolute;
            bottom: 30px !important;
          }
        }
        .code {
          span {
            display: none;
          }
        }
      }

      .d-flex.flex-row.resize {
        display: flex;
        align-items: center;
      }
    }

    &.hasTitle {
      .card {
        .d-flex.flex-row {
          .avatar-block.absolute {
            top: -160px;
          }
        }
      }
    }
  }

  .float-cover {
    padding-inline: 8px !important;
    .title-block {
      max-width: 350px;
    }
    .card {
      gap: 4px;
      flex-wrap: wrap;

      .extra {
        justify-content: flex-start;
        // margin-top: -50px; remove to avoid text above the image
        .block {
          flex-direction: row !important;

          .date {
            flex-direction: row;
            .d-flex {
              margin-right: 0px !important;
              align-items: center !important;
              justify-content: center !important;
            }
            .horizontal {
              display: none !important;
            }
            .vertical {
              display: flex !important;
            }
          }

          .code {
            span {
              display: none;
            }
          }
        }
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
      .d-flex.flex-column {
        .d-flex.flex-column {
          .info {
            margin-left: 0px !important;
          }
          .title-block {
            margin-left: 0px !important;
          }

          .description-block {
            margin-left: 0px !important;
          }
        }

        .avatar-block {
          top: -85px !important;
        }
      }
    }
  }

  .float-cover {
    .title-block {
      max-width: 300px !important;
    }
    .card {
      .d-flex.flex-row.align-center {
        padding-left: 16px;
      }
      .d-flex.flex-column.justify-space-between {
        padding-bottom: 0px;
      }

      .extra {
        width: 100%;

        flex-direction: row;
        flex-wrap: wrap-reverse;

        gap: 4px;
      }
    }
  }
}

@media (max-width: 365px) {
  .float-cover {
    .card {
      .description-block {
        bottom: 12px;
      }
      .extra {
        .block {
          .code {
            position: absolute;
            right: 0px;
            bottom: 12px;
          }
        }
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
    .card {
      .d-flex.flex-row.resize {
        .avatar-block {
          top: -80px !important;
        }
      }
    }
  }
}
</style>
