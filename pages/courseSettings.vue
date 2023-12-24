<template>
  <div class="container d-flex flex-column">
    <div class="config config-title">
      <p>
        <span class="header-h4">{{
          t('pages.courseSettings.config.title')
        }}</span>
      </p>
    </div>
    <div class="config">
      <div class="content-area">
        <div class="card-title">
          <p>
            <span class="header-h4">{{
              t('pages.courseSettings.config.coverTitle')
            }}</span>
          </p>
        </div>
        <div class="content-body">
          <div
            v-if="selectedFile"
            class="filePreview"
            :style="{
              backgroundImage: 'url(' + preview + ')',
              backgroundSize: 'cover',
            }"
          ></div>
          <div v-else class="empty-state mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="57"
              height="57"
              viewBox="0 0 57 57"
              fill="none"
            >
              <path
                d="M54.0571 9H47.9971V2.94C47.9971 1.32 46.6771 0 45.0571 0H44.9671C43.3171 0 41.9971 1.32 41.9971 2.94V9H35.9671C34.3471 9 33.0271 10.32 32.9971 11.94V12.03C32.9971 13.68 34.3171 15 35.9671 15H41.9971V21.03C41.9971 22.65 43.3171 24 44.9671 23.97H45.0571C46.6771 23.97 47.9971 22.65 47.9971 21.03V15H54.0571C55.6771 15 56.9971 13.68 56.9971 12.06V11.94C56.9971 10.32 55.6771 9 54.0571 9ZM38.9971 21.03V18H35.9671C34.3771 18 32.8771 17.37 31.7371 16.26C30.6271 15.12 29.9971 13.62 29.9971 11.94C29.9971 10.86 30.2971 9.87 30.8071 9H5.99707C2.69707 9 -0.00292969 11.7 -0.00292969 15V51C-0.00292969 54.3 2.69707 57 5.99707 57H41.9971C45.2971 57 47.9971 54.3 47.9971 51V26.16C47.0971 26.67 46.0771 27 44.9371 27C43.3614 26.9843 41.8551 26.3493 40.7437 25.2322C39.6323 24.1152 39.0049 22.6058 38.9971 21.03ZM38.8771 51H8.99707C8.7185 51 8.44544 50.9224 8.20847 50.776C7.97151 50.6295 7.78001 50.42 7.65543 50.1708C7.53085 49.9217 7.47811 49.6427 7.50313 49.3653C7.52815 49.0878 7.62993 48.8229 7.79707 48.6L13.7371 40.71C14.3671 39.87 15.5971 39.93 16.1971 40.77L20.9971 48L28.8271 37.56C29.4271 36.78 30.5971 36.75 31.1971 37.53L40.0471 48.57C40.8271 49.56 40.1371 51 38.8771 51Z"
                fill="#A0A8B1"
              />
            </svg>
            <p class="text-center">
              <span class="header-h5 text--secondary">{{
                t('pages.courseSettings.config.addCover')
              }}</span>
              <br />
              <span class="subtitle text--secondary">{{
                t('pages.courseSettings.config.formats')
              }}</span>
            </p>
          </div>
          <span class="action-content">
            <alex-custom-button
              class="button"
              prepend-icon="mdi-cloud-upload-outline"
              variant="secondary"
              @click="$refs.fileInput.click()"
              >{{
                t('pages.courseSettings.config.uploadButton')
              }}</alex-custom-button
            >
            <input
              ref="fileInput"
              type="file"
              accept=".jpeg, .png, .wav, .mp4, .jpg"
              style="display: none"
              @change="handleFileUpload($event)"
            />
          </span>
        </div>
      </div>
      <div class="content-area">
        <div class="card-title">
          <p>
            <span class="header-h4">{{
              t('pages.courseSettings.config.generalTitle')
            }}</span>
          </p>
        </div>
        <div class="content-body">
          <alex-inputs-text-field
            id="courseName"
            v-model="course.title"
            :label="$t('pages.courseSettings.config.courseName')"
            name=""
            class="w-100"
            required
          ></alex-inputs-text-field>
          <div class="container-date">
            <div class="datePickers">
              <alex-inputs-date
                v-model="course.start_date"
                name="startDate"
                :label="t('pages.courseSettings.config.startDate')"
                required
                class="w-100"
              />

              <alex-inputs-date
                v-model="course.end_date"
                name="endDate"
                :label="t('pages.courseSettings.config.endDate')"
                required
                class="w-100"
              />
            </div>
          </div>
          <alex-inputs-text-field
            id="acronym"
            v-model="course.slug"
            :label="$t('pages.courseSettings.config.courseAcronym')"
            name=""
            class="w-100"
            required
          />
        </div>
        <div class="footer-content">
          <span class="action-content-two">
            <alex-custom-button class="button" variant="secondary">{{
              t('pages.courseSettings.config.cancelButton')
            }}</alex-custom-button>
            <alex-custom-button
              class="button"
              variant="primary"
              @click="
                () =>
                  update(`learningplans/${course.id}`, {
                    title: course.title,
                    start_date: course.start_date,
                    end_date: course.end_date,
                    slug: course.slug,
                  })
              "
              >{{
                t('pages.courseSettings.config.saveButton')
              }}</alex-custom-button
            >
          </span>
        </div>
      </div>
      <div class="content-area meetings">
        <div class="card-title">
          <p>
            <span class="header-h4">{{
              t('pages.courseSettings.config.syncMeetingsTitle')
            }}</span>
          </p>
        </div>
        <div class="content-body">
          <div class="meetings d-flex flex-column w-100">
            <div v-if="meetings">
              <course-meeting
                v-for="item in meetings"
                :key="item.id"
                :date="new Date(item.attributes.date)"
                :frequency="item.attributes.schedule.data.attributes.frequency"
                :start-hour="
                  format(
                    new Date(
                      item.attributes.schedule.data.attributes.startDate,
                    ),
                    'HH:mm',
                  )
                "
                :end-hour="
                  format(
                    new Date(item.attributes.schedule.data.attributes.endDate),
                    'HH:mm',
                  )
                "
                :interval="item.attributes.schedule.data.attributes.interval"
                :variant="'editing'"
                :dropdown-props="[
                  {
                    onClick: () => (editData = true),
                    text: 'Editar',
                    icon: 'mdi-pencil',
                  },
                  {
                    onClick: () => (dialogMeetingExclusion = true),
                    text: 'Apagar',
                    icon: 'mdi-trash-can-outline',
                    warning: true,
                  },
                ]"
              />

              <alex-custom-dialog
                :model-value="dialogMeetingExclusion"
                title=""
                body-classes="criticalAttention"
                width="520px"
                :scrollable="false"
                max-height="500px"
              >
                <template #header>
                  <alex-custom-dialog-header title="" class="noShow"
                /></template>
                <div class="criticalAttention">
                  <div class="exclusionBody">
                    <span class="exclusionIMG">
                      <img
                        src="@/assets/svg/exclusionImage.svg"
                        alt="attention image"
                      />
                    </span>
                    <p>
                      <span class="header-h4">{{
                        t(
                          'pages.courseSettings.config.deleteMeetingConfirmation',
                        )
                      }}</span>
                      <br />
                      <span class="body-p1">{{
                        t(
                          'pages.courseSettings.config.deleteMeetingDescription',
                        )
                      }}</span>
                    </p>
                  </div>
                  <div class="exclusionFooter">
                    <alex-custom-button
                      class="button"
                      :text="$t('pages.courseSettings.config.cancelButton')"
                      variant="secondary"
                      @click="dialogMeetingExclusion = false"
                    />
                    <alex-custom-button
                      class="button"
                      :text="$t('pages.courseSettings.config.deleteWord')"
                      variant="error"
                      @click="removeSelf('')"
                    />
                  </div>
                </div>
                <template #footer>
                  <alex-custom-dialog-footer class="noShow" /></template
              ></alex-custom-dialog>
            </div>
            <div v-else class="no-encounters mb-4">
              <p>
                <span class="body-p1">{{
                  t('pages.courseSettings.config.noSyncMeetings')
                }}</span>
              </p>
            </div>
            <span class="action-content">
              <alex-custom-button
                class="button"
                prepend-icon="mdi-plus"
                variant="primary"
                >{{ t('pages.courseSettings.config.createSyncMeetingButton') }}

                <alex-learningplan-dialogs-schedule
                  v-model="createScheduleModal"
                  v-model:data="editData"
                  :data="item"
                  @submit="
                    (values) =>
                      !editData ? addMeeting(values) : editMeeting(values)
                  "
                />
              </alex-custom-button>
            </span>
          </div>
        </div>
      </div>
      <div class="d-flex content-area invites">
        <div class="card-title">
          <p>
            <span class="header-h4">{{
              t('pages.courseSettings.config.inviteSettingsTitle')
            }}</span>
          </p>
        </div>
        <div class="d-flex content-body">
          <div class="container-invite border-bottom">
            <span class="header-h5 text-invite">{{
              t('pages.courseSettings.config.linkInvitation')
            }}</span>

            <v-switch
              v-model="inviteEnabled"
              :defaults-target="course.invite_enabled"
              :label="$t('pages.courseSettings.config.inviteLink')"
              color="accent"
              @change="
                update(`learningplans/${course.id}`, {
                  invite_enabled: inviteEnabled,
                })
              "
            />
            <div v-if="inviteEnabled" class="inviteLinks d-flex flex-row">
              <div class="">
                <alex-inputs-select
                  v-model="selectedTime"
                  name="duration"
                  :label="$t('pages.courseSettings.config.linkDuration')"
                  density="comfortable"
                  required
                  :items="timeOptions"
                  :info="$t('pages.courseSettings.config.inviteTooltip')"
                />
              </div>
              <div class="w-3/4">
                <span class="body-p1 py-2">
                  {{ t('pages.courseSettings.config.linkAddress') }}
                </span>
                <alex-learningplan-invites
                  v-if="canEdit"
                  href=""
                  no-header
                  class="mt-2 w-full"
                  :enable-invites="course.invite_enabled"
                  :duration="selectedTime"
                  :course-id="course.id"
                  :data="invitationLink"
                  @update:link="
                    (data) => {
                      plainLink = data.url;
                    }
                  "
                />
              </div>
            </div>
          </div>
          <div class="container-invite">
            <span class="header-h5 text-invite">{{
              t('pages.courseSettings.config.mailInvite')
            }}</span>
            <alex-inputs-text-area
              v-model="invitationMessage"
              name="message"
              :label="$t('pages.courseSettings.config.inviteMessage')"
              :hint="$t('pages.courseSettings.config.inviteHint')"
              persistent-hint
              class="w-100"
              density="comfortable"
            >
              <template #append-inner>
                <alex-custom-tooltip
                  text="Restaurar mensagem padrão"
                  attach="append-inner-icon"
                >
                  <template #content>
                    <v-icon
                      class="mdi mdi-cached"
                      color="primary"
                      @click="restoreDefaultMessage"
                    />
                  </template>
                </alex-custom-tooltip>
              </template>
            </alex-inputs-text-area>
          </div>
        </div>
        <div class="footer-content">
          <span class="action-content-two">
            <alex-custom-button
              class="button"
              :text="$t('pages.courseSettings.config.cancelButton')"
              variant="secondary"
            />
            <alex-custom-button
              class="button"
              :text="$t('pages.courseSettings.config.saveButton')"
              variant="primary"
              @click="setNewInvitationMessage(invitationMessage)"
            />
          </span>
        </div>
      </div>
      <div class="content-area course-visibility">
        <div class="card-title">
          <p>
            <span class="header-h4">
              {{ t('pages.courseSettings.config.courseVisibilityTitle') }}</span
            >
          </p>
        </div>
        <div class="content-body">
          <div class="container-radio">
            <div class="radioButtons">
              <alex-inputs-radio-button
                v-model="activeButton"
                :buttons="firstButton"
                :text="t('pages.courseSettings.config.showButton')"
              />
              <alex-inputs-radio-button
                v-model="activeButton"
                :buttons="secondButton"
              />
            </div>
          </div>
        </div>
        <div class="footer-content">
          <span class="action-content-two">
            <alex-custom-button
              class="button"
              :text="$t('pages.courseSettings.config.cancelButton')"
              variant="secondary"
              @click="console.log('Cancelar')"
            />
            <alex-custom-button
              class="button"
              :text="$t('pages.courseSettings.config.saveButton')"
              variant="primary"
              @click="
                update(`learningplans/${course.id}`, {
                  hidden: activeButton,
                })
              "
            />
          </span>
        </div>
      </div>
      <div class="content-area delete">
        <div class="card-title">
          <p>
            <span class="header-h4">{{
              t('pages.courseSettings.config.deleteCourseTitle')
            }}</span>
          </p>
        </div>
        <div class="content-body">
          <p>
            {{ t('pages.courseSettings.config.deleteCourseDescription') }}
          </p>
        </div>
        <div class="footer-content">
          <span class="action-content">
            <alex-custom-button
              class="button"
              prepend-icon="mdi-trash-can-outline"
              variant="error"
              @click="openDialog = true"
            >
              {{ t('pages.courseSettings.config.deleteButton') }}
              <alex-custom-dialog
                :model-value="openDialog"
                title=""
                body-classes="criticalAttention"
                width="520px"
                :scrollable="false"
                max-height="500px"
              >
                <template #header>
                  <alex-custom-dialog-header title="" class="noShow"
                /></template>
                <div class="criticalAttention">
                  <div class="exclusionBody">
                    <span class="exclusionIMG">
                      <img
                        src="@/assets/svg/exclusionImage.svg"
                        alt="attention image"
                      />
                    </span>
                    <p>
                      <span class="header-h4">{{
                        t('pages.courseSettings.config.deleteConfirmation')
                      }}</span>
                      <br />
                      <span class="body-p1">{{
                        t('pages.courseSettings.config.deleteDescription')
                      }}</span>
                    </p>
                    <div class="label d-flex flex-start w-100">
                      <label for="exclusionLabel" class="body-p1">
                        {{ t('pages.courseSettings.config.deleteLabel') }}
                        <strong>{{
                          t('pages.courseSettings.config.deleteWord')
                        }}</strong>
                      </label>
                    </div>
                    <alex-inputs-text-field
                      id="exclusionLabel"
                      name="placeholder"
                      class="w-100"
                      required
                      :placeholder="
                        $t('pages.courseSettings.config.deletePlaceholder')
                      "
                    />
                  </div>
                  <div class="exclusionFooter">
                    <alex-custom-button
                      class="button"
                      :text="$t('pages.courseSettings.config.cancelButton')"
                      variant="secondary"
                      @click="openDialog = false"
                    />
                    <alex-custom-button
                      class="button error"
                      :text="$t('pages.courseSettings.config.deleteWord')"
                      variant="error"
                      @click="openDialog = false"
                    />
                  </div>
                </div>
                <template #footer>
                  <alex-custom-dialog-footer class="noShow"
                /></template>
              </alex-custom-dialog>
            </alex-custom-button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { format } from 'date-fns';
import { Meeting } from '@/components/alex/learningplan/dialogs/Schedule.vue';

const canEdit = ref(true);

const { t } = useI18n();
const { find, update } = useStrapi();
const { generateUrl } = useInvitationLink();
const invitationLink = ref();
const plainLink = ref<string | null>(null);
const course = ref<any>({});
const emit = defineEmits(['update:modelValue']);
const editData = ref<Meeting | null>(null);

// upload file - erro 403
const selectedFile = ref(null);
const preview = ref(null);
const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    preview.value = e.target.result;
  };
  reader.readAsDataURL(selectedFile.value);
  onSelectFile(selectedFile.value);
};
const onSelectFile = async (selectedFile) => {
  try {
    const formData = new FormData();

    if (selectedFile.url instanceof File) {
      formData.append('files', selectedFile.url);
    } else if (
      typeof selectedFile.url === 'string' &&
      selectedFile.url.startsWith('data:')
    ) {
      const base64Data = selectedFile.url.split(',')[1];
      const binaryString = window.atob(base64Data);
      const byteArray = new Uint8Array(binaryString.length);

      for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
      }

      let mimeType = 'image/png';
      if (selectedFile.url.startsWith('data:image/jpeg')) {
        mimeType = 'image/jpeg';
      }

      const blob = new Blob([byteArray], { type: mimeType });
      const imageFile = new File([blob], 'image', { type: mimeType });
      formData.append('files', imageFile);
    }

    const response = await fetch(`http://localhost:1337/api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Erro ao enviar a imagem: ${response.statusText}`);
    }

    const responseData = await response.json();
    const imageUrl = responseData[0].url;

    update(`learningplans/${course.value.id}`, {
      cover_image: imageUrl,
    });
  } catch (error) {
    console.error('Erro ao enviar a imagem:', error);
  }
};

// general info
const getCourseInfo = async () => {
  try {
    const result = await find<any>(`learningplans`, {
      filters: { id: { $containsi: 1 } },
      populate: 'schedules',
    });
    const id = result.data[0].id;
    const data = result.data[0].attributes;
    if (data) {
      course.value = {
        ...course.value,
        id,
        invite_enabled: data.invite_enabled,
        title: data.title,
        start_date: data.start_date,
        end_date: data.end_date,
        slug: data.slug,
        invitation_message: data.invitation_message,
        invitation_duration: data.invitation_duration,
      };
      invitationLink.value = generateUrl(id);
      await updateMeetings(data.schedules.data);
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
};

const startDate = ref();
const endDate = ref();

// invites
let invitationMessage = ref(
  `Olá, {{ Usuário }}, tudo bem? Você foi convidado para participar do curso de {{ course.title }} por {{ Integrante }}. Para acessar o curso, basta clicar no link abaixo: {{ invitationLink }}`,
);

const setNewInvitationMessage = (message) => {
  invitationMessage.value = message;
};

const restoreDefaultMessage = () => {
  invitationMessage.value = `Olá, {{ Usuário }}, tudo bem? Você foi convidado para participar do curso de {{ course.title }} por {{ Integrante }}. Para acessar o curso, basta clicar no link abaixo: {{ invitationLink }}`;
};

const inviteEnabled = computed({
  get: () => course.value.invite_enabled,
  set: (value) => {
    course.value.invite_enabled = value;
  },
});
const selectedTime = ref();
const timeOptions = ref([
  { title: t('pages.courseSettings.config.fiveMinutes'), value: 300000 },
  { title: t('pages.courseSettings.config.fifteenMinutes'), value: 900000 },
  { title: t('pages.courseSettings.config.thirtyMinutes'), value: 1800000 },
  { title: t('pages.courseSettings.config.oneHour'), value: 3600000 },
  { title: t('pages.courseSettings.config.twoHours'), value: 7200000 },
  { title: t('pages.courseSettings.config.eightHours'), value: 28800000 },
  { title: t('pages.courseSettings.config.twentyFourHours'), value: 86400000 },
]);

// sync meetings - modal de edição não quer abrir, na criação data não seleciona...

const createScheduleModal = ref(false);
const meetings = ref<any>();

const updateMeetings = async (schedules) => {
  meetings.value = (
    await find('learning-plan-meetings', {
      filters: {
        schedule: {
          id: {
            $in: schedules.map((item) => item.id),
          },
        },
        isExpired: false,
      },
      populate: 'schedule',
      sort: 'date:asc',
    })
  ).data.splice(0, 2);
};

const removeSelf = (id: string) => {
  meetings.value = meetings.value.filter((item) => item.id !== id);
};

const addMeeting = (values: Meeting) => {
  meetings.value.push({ ...values, id: crypto.randomUUID() });
};

const editMeeting = (values: Meeting) => {
  const updatedSchedules = meetings.value.map((meeting) => {
    if (meeting.id === values.id) {
      return { ...meeting, ...values };
    }
    return meeting;
  });
  meetings.value = updatedSchedules;
};

// course visibility

const firstButton = ref([
  {
    label: t('pages.courseSettings.config.showCourseTitle'),
    hint: t('pages.courseSettings.config.showCourseHint'),
    value: 'false',
  },
]);

const secondButton = ref([
  {
    label: t('pages.courseSettings.config.hideCourseTitle'),
    hint: t('pages.courseSettings.config.hideCourseHint'),
    value: 'true',
  },
]);

const activeButton = computed({
  get() {
    if (course.value.hidden) {
      return 'true';
    } else {
      return 'false';
    }
  },
  set(value) {
    if (value === 'true') {
      course.value.hidden = true;
      emit('update:modelValue', true);
    } else {
      course.value.hidden = false;
      emit('update:modelValue', false);
    }
  },
});

// delete course

const dialogMeetingExclusion = ref(false);
const openDialog = ref(false);

onBeforeMount(async () => {
  await getCourseInfo();
});
</script>
<style scoped lang="scss">
.container {
  display: flex;
}
.config {
  display: flex;
  padding: 24px;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: center !important;
  align-self: stretch;
  width: 100%;
  background-color: #fff;
}

.config-title {
  height: 70px;
  width: 100%;
  flex-wrap: nowrap;
  align-items: flex-start;
  padding: 24px;
  align-self: stretch;
  border-bottom: 1px solid var(--cinza-cinza-100, #ebedef);
}

.content-area {
  display: flex;
  max-width: 850px;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  border-radius: 8px !important;
  border: 1px solid var(--cinza-cinza-200, #d2d6da) !important;
  background: var(--principais-branco, #fff);
  margin-top: 24px;
}

.content-body {
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
}
.card-title {
  display: flex;
  height: 72px;
  padding: 16px 18px 16px 24px;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  border-bottom: 1px solid var(--cinza-cinza-100, #ebedef);
}
.empty-state {
  display: flex;
  height: 250px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid var(--cinza-cinza-100, #ebedef);
  background: var(--cinza-cinza-azulado, #f1f5f9);
}

.filePreview {
  display: flex;
  height: 250px;
  padding: 5.072px;
  align-items: center;
  gap: 5.072px;
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid var(--cinza-cinza-100, #ebedef);
}

.action-content {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 24px;
  align-self: stretch;
}

.action-content-two {
  display: flex;
  height: 76px;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  align-self: stretch;
}

p {
  color: var(--cinza-cinza-400, #a0a8b1);
  text-align: center;
  font-family: Sen;
}

.header-h4 {
  color: var(--cinza-cinza-800, #454d54);
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.2px;
}
.header-h5 {
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.36px;
}
.body-p3 {
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 135%;
  letter-spacing: 0.28px;
}

.footer-content {
  display: flex;
  padding: 16px 24px;
  justify-content: flex-end;
  align-items: center !important;
  gap: 16px;
  align-self: stretch;
  border-top: 1px solid var(--cinza-cinza-100, #ebedef);
}

.no-encounters {
  display: flex;
  padding: 24px 0px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid var(--cinza-cinza-100, #ebedef);
}

.body-p1 {
  font-size: 16px !important;
  font-style: normal !important;
  font-weight: 400 !important;
  line-height: 135%;
  letter-spacing: 0.32px;
  color: var(--cinza-cinza-800, #454d54) !important;
}
.button {
  text-transform: none;
}

.text-invite {
  color: var(--cinza-cinza-800, #454d54);
}
.radioButtons {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex: 1 0 0;
}

.container-radio {
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: flex-end;
  gap: 24px;
  align-self: stretch;
}

.container-date {
  display: flex;
  align-items: center;
  gap: 24px;
  align-self: stretch;
}

.datePickers {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 8px;
  flex: 1 0 0;
}

.criticalAttention {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  justify-content: center;
}

.noShow {
  display: none;
}
.exclusionBody {
  display: flex;
  min-height: 300px;
  padding: var(--40px, 40px) 24px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  align-self: stretch;
}

.exclusionFooter {
  display: flex;
  min-height: 76px;
  padding: 16px 24px;
  justify-content: center;
  align-items: center;
  gap: 16px;
  align-self: stretch;
  border-top: 1px solid var(--cinza-cinza-100, #ebedef);
}

.button.error {
  color: #fff !important;
}

.container-invite {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
}

.border-bottom {
  border-bottom: 1px solid var(--cinza-cinza-100, #ebedef);
}
.inviteLinks {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  align-items: baseline;
  gap: 24px;
  align-content: center;
  justify-content: flex-start;
}

.inviteTooltip {
  text-align: center !important;
  padding: 6.5px 16px;
  justify-content: center;
  align-items: center;
}

.meetings {
  display: flex !important;
  flex-direction: column !important;
  gap: 16px !important;
}
.test {
  display: flex !important;
  justify-content: space-between !important;
  border-radius: 8px;
  border: 1px solid var(--Cinza-Cinza-azulado, #f1f5f9);
  padding: 12px 16px;
  align-self: stretch;
  flex-wrap: wrap;
  margin-bottom: 8px;
}
</style>
