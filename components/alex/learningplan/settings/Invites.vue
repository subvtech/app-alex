<template>
  <alex-custom-card :title="$t('components.courses.settings.invite.title')">
    <template #content>
      <div class="d-flex flex-column w-100">
        <div class="d-flex flex-column border-bottom">
          <span class="header-h5">{{
            $t('components.courses.settings.invite.label')
          }}</span>

          <v-switch
            v-model="myInviteEnabled"
            :label="$t('components.courses.settings.invite.link')"
            color="accent"
            @change="toggleInviteEnabled"
          />
          <div v-if="myInviteEnabled" class="d-flex flex-row align-center w-100 gap-4">
            <alex-inputs-select
              v-model="selectedTime"
              name="duration"
              class="min-width"
              :label="$t('components.courses.settings.invite.linkDuration')"
              density="comfortable"
              required
              :items="timeOptions"
              :info="$t('components.courses.settings.invite.tooltip')"
            />

            <div class="w-100">
              <span class="py-2">
                {{ t('components.courses.settings.invite.linkAddress') }}
              </span>
              <alex-learningplan-invites
                href=""
                no-header
                smaller
                class="mt-2 w-full"
                :enable-invites="myInviteEnabled"
                :duration="selectedTime"
                :course-id="learningPlanId"
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
        <v-divider :thickness="1" class="border-opacity-100 w-100" />

        <div class="">
          <span class="header-h5 text-invite">{{
            t('components.courses.settings.invite.email')
          }}</span>
          <alex-inputs-text-field
            v-model="myMessage"
            name="message"
            :label="$t('components.courses.settings.invite.message')"
            :hint="$t('components.courses.settings.invite.hint')"
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
    </template>
  </alex-custom-card>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const { update } = useStrapi();

import { InvitationLinkType } from '@/components/alex/learningplan/Invites.vue';

const props = defineProps({
  learningPlanId: {
    type: Number,
    required: true,
  },
  invitationLink: {
    type: Object as PropType<InvitationLinkType | null>,
    default: null,
  },
  inviteEnabled: {
    type: Boolean,
    default: false,
  },
  invitationDuration: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const myMessage = toRef(props.message);
const myInviteEnabled = toRef(props.inviteEnabled);

const toggleInviteEnabled = async () => {

  await update(`learningplans/${props.learningPlanId}`, {
    invite_enabled: !myInviteEnabled.value,
  });

  myInviteEnabled.value = !myInviteEnabled.value;
};

const selectedTime = ref();
const timeOptions = ref([
  { title: t('components.courses.settings.invite.fiveMinutes'), value: 300000 },
  {
    title: t('components.courses.settings.invite.fifteenMinutes'),
    value: 900000,
  },
  {
    title: t('components.courses.settings.invite.thirtyMinutes'),
    value: 1800000,
  },
  { title: t('components.courses.settings.invite.oneHour'), value: 3600000 },
  { title: t('components.courses.settings.invite.twoHours'), value: 7200000 },
  {
    title: t('components.courses.settings.invite.eightHours'),
    value: 28800000,
  },
  {
    title: t('components.courses.settings.invite.twentyFourHours'),
    value: 86400000,
  },
]);

const plainLink = ref();
</script>
<style scoped lang="scss">

</style>
