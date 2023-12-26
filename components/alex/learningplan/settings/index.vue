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
      <alex-learningplan-settings-banner
        :cover="coverImage"
        :learning-plan-id="learningPlan.id"
        @update="(data) => emit('update', data)"
      />
      <alex-learningplan-settings-general
        :title="learningPlan.title"
        :startDate="learningPlan.start_date"
        :endDate="learningPlan.end_date"
        :slug="learningPlan.slug"
        :learning-plan-id="learningPlan.id"
        @update="(data) => emit('update', data)"
      />
      <alex-learningplan-meetings
        can-edit
        is-facilitator
        :learning-plan-id="learningPlan.id"
        :data="schedules"
        :end-date="new Date(learningPlan.end_date)"
        variant="editing"
      />

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
            <alex-inputs-text-field
              v-model="course.message"
              name="Mensagem"
              :label="$t('pages.courseSettings.config.inviteMessage')"
              :hint="$t('pages.courseSettings.config.inviteHint')"
              persistent-hint
              class="w-100"
              required
              density="comfortable"
              append-inner-icon="mdi-cached"
            >
            </alex-inputs-text-field>
          </div>
          <alex-custom-tooltip
            text="Restaurar mensagem padrão"
            attach="append-inner-icon"
          ></alex-custom-tooltip>
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
            />
            <alex-custom-button
              class="button"
              :text="$t('pages.courseSettings.config.saveButton')"
              variant="primary"
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

import { useField } from 'vee-validate';

import { BannerImageType } from '@/components/alex/custom/Banner.vue';

import { LearningPlanType } from '~/pages/courses/[id]/index.vue';

const { t } = useI18n();
const { find, update } = useStrapi();
const { generateUrl } = useInvitationLink();

const props = defineProps({
  learningPlan: {
    type: Object as PropType<LearningPlanType>,
    required: true,
  },
  schedules: {
    type: Array as PropType<any[]>,
    required: true,
  },
});

const coverImage = ref<BannerImageType | undefined>(
  props.learningPlan.cover_image.data
    ? {
        id: props.learningPlan.cover_image.data.id,
        url: props.learningPlan.cover_image.data.attributes.url,
      }
    : undefined,
);

const invitationLink = ref();
const plainLink = ref<string | null>(null);
const course = ref<any>({});
const emit = defineEmits(['update']);
const canEdit = ref(true);

// invites
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

// sync meetings

// course visibility

const firstButton = ref([
  {
    label: t('pages.courseSettings.config.showCourseTitle'),
    hint: t('pages.courseSettings.config.showCourseHint'),
    value: '1',
  },
]);

const secondButton = ref([
  {
    label: t('pages.courseSettings.config.hideCourseTitle'),
    hint: t('pages.courseSettings.config.hideCourseHint'),
    value: '2',
  },
]);

const activeButton = ref('1');

// delete course

const dialogMeetingExclusion = ref(false);
const openDialog = ref(false);
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
