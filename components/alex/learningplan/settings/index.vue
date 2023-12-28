<template>
  <alex-custom-card
    :title="$t('components.courses.settings.title')"
    :show-icon="false"
    :align-content="'align-center'"

  >
    <template #content>
      <div class="d-flex flex-column  w-100 gap-6 justify-center w-201">
        <alex-learningplan-settings-banner
          :cover="coverImage"
          :learning-plan-id="learningPlan.id"
          @update="uploadCoverImage"
          @delete="removeCoverImage"
          outline
          full-width
        />
        <alex-learningplan-settings-general
          :title="learningPlan.title"
          :startDate="learningPlan.start_date"
          :endDate="learningPlan.end_date"
          :slug="learningPlan.slug"
          :learning-plan-id="learningPlan.id"
          @update="(data) => emit('update', data)"
          outline
          full-width
        />
        <alex-learningplan-meetings
          can-edit
          is-facilitator
          :learning-plan-id="learningPlan.id"
          :data="schedules"
          :end-date="new Date(learningPlan.end_date)"
          variant="editing"
          outline
        />

        <alex-learningplan-settings-invites
          :learning-plan-id="learningPlan.id"
          :invite-enabled="learningPlan.invite_enabled"
          :invitation-link="invitationLink"
          :invitation-duration="learningPlan.invitation_duration"
          :message="'sdasds'"
          outline
        />
        <alex-learningplan-settings-visibility
          :isHidden="learningPlan.hidden"
          @update="updateVisibility"
          outline
        />
        <alex-learningplan-settings-delete outline />
      </div>
    </template>
  </alex-custom-card>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';


import { BannerImageType } from '@/components/alex/custom/Banner.vue';

import { LearningPlanType } from '~/pages/courses/[id]/index.vue';
import { InvitationLinkType } from '../Invites.vue';

const { t } = useI18n();
const { find, update } = useStrapi();
const { setMessage } = useMessageStore();
const { uploadImage, removeImage } = useUploadedImage();

const props = defineProps({
  learningPlan: {
    type: Object as PropType<LearningPlanType>,
    required: true,
  },
  schedules: {
    type: Array as PropType<any[]>,
    required: true,
  },
  invitationLink: {
    type: Object as PropType<InvitationLinkType | null>,
    default: null,
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

const emit = defineEmits(['update']);

const updateVisibility = async (data) => {
  await update('learningplans', props.learningPlan.id, { ...data });
  setMessage(t('components.courses.settings.visibility.update'), 'green', true);
};

async function uploadCoverImage(event: any) {
  const newImage = await uploadImage(event);
  coverImage.value = { url: newImage[0].url, id: newImage[0].id };

  await update('learningplans', props.learningPlan.id, {
    cover_image: coverImage.value.id,
  });
  emit('update', t('components.courses.settings.cover.update'));
}

async function removeCoverImage() {
  if(!coverImage.value) return;
  await removeImage(coverImage.value.id);
  coverImage.value = undefined;
  emit('update', t('components.courses.settings.cover.update'));
}
</script>
<style scoped lang="scss">
.w-201{
  max-width: 804px;
}

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

.noShow {
  display: none;
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
