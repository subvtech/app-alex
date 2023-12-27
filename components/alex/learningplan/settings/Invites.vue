<template>
  <alex-custom-card
    :title="$t('components.courses.settings.invite.title')"
    :show-icon="false"
  >
    <template #content>
      <div class="d-flex flex-column w-100">
        <div class="d-flex flex-column border-bottom">
          <span class="header-h5 title">{{
            $t('components.courses.settings.invite.label')
          }}</span>

          <v-switch
            v-model="myInviteEnabled"
            :label="$t('components.courses.settings.invite.link')"
            color="accent"
            @change="toggleInviteEnabled"
          />
          <div
            v-if="myInviteEnabled"
            class="d-flex flex-row align-center w-100 gap-4"
          >
            <alex-inputs-select
              v-model="selectedTime"
              name="duration"
              :label="$t('components.courses.settings.invite.linkDuration')"
              density="comfortable"
              class="duration"
              value="first"
              required
              :items="timeOptions"
              :info="$t('components.courses.settings.invite.tooltip')"
            />
            <div
              class="d-flex flex-column w-100 align-self-center"
              :class="invitationLink ? '' : 'mt-3'"
            >
              <span class="description">
                {{ t('components.courses.settings.invite.linkAddress') }}
              </span>
              <alex-learningplan-invites
                href=""
                no-header
                smaller
                class="py-2 w-full"
                :enable-invites="myInviteEnabled"
                :duration="selectedTime"
                :course-id="learningPlanId"
                :data="invitationLink"
                @update:link="
                  (data) => {
                    plainLink = data.url;
                  }
                "
                @link:expired="invitationLink = null"
              />
            </div>
          </div>
        </div>
        <v-divider :thickness="1" class="bg-white w-100 my-6" />

        <div class="d-flex flex-column gap-6">
          <span class="header-h5 title">{{
            t('components.courses.settings.invite.email')
          }}</span>
          <alex-inputs-text-area
            v-model="myMessage"
            name="message"
            class="max-width w-100"
            :label="$t('components.courses.settings.invite.message')"
            :hint="$t('components.courses.settings.invite.hint')"
            persistent-hint
            required
            density="comfortable"
            append-inner-icon="mdi-cached"
          />
        </div>
        <alex-custom-tooltip
          text="Restaurar mensagem padrão"
          attach="append-inner-icon"
        ></alex-custom-tooltip>
      </div>

      <div class="d-flex w-100 pt-6 justify-end gap-4">
        <alex-custom-button
          class="button"
          :text="$t('components.courses.settings.invite.cancel')"
          variant="secondary"
        />
        <alex-custom-button
          class="button"
          :text="$t('components.courses.settings.invite.save')"
          variant="primary"
        />
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
  console.log({ myInviteEnabled: myInviteEnabled.value });

  myInviteEnabled.value = !myInviteEnabled.value;
};

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
const selectedTime = ref(timeOptions.value[0].value);

const plainLink = ref();
</script>
<style scoped lang="scss">
.duration {
  display: flex;
  flex-direction: column;
  min-width: max-content;
}
.description {
  color: var(--Cinza-Cinza-800, #454d54);

  /* Body/P1 */
  font-family: Sen;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 135%; /* 21.6px */
  letter-spacing: 0.32px;
}
.title {
  color: var(--Cinza-Cinza-800, #454d54);

  /* Header/H5 */
  font-family: Sen;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.36px;
}
</style>
