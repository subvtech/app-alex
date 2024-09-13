<template>
  <alex-custom-dialog
    v-model="dialogModel"
    :title="dialogTitle"
    activator="parent"
    no-footer
  >
    <div class="d-flex flex-column gap-4">
      <div class="d-flex tw-justify-between tw-items-center w-100">
        <div class="d-flex gap-4">
          <alex-custom-button
            icon="mdi-attachment"
            variant="secondary"
            size="large"
          />
          <div class="d-flex flex-column">
            <span class="text-body-4">{{
              $t('components.learningPlan.projects.invite.subtitle')
            }}</span>
            <span class="text-body-5">{{
              $t('components.learningPlan.projects.invite.description')
            }}</span>
          </div>
        </div>
        <alex-custom-dropdown :items="dropdownItems">
          <template #activator="{ props: dropdownProps }">
            <alex-custom-button
              v-bind="dropdownProps"
              prepend-icon="mdi-pencil-outline"
              variant="secondary"
              size="large"
              >{{
                $t('components.appGeneralBoxes.students.singular')
              }}</alex-custom-button
            >
          </template>
        </alex-custom-dropdown>
      </div>
      <alex-learningplan-invites
        full-width
        :duration="invitationDuration"
        :url="plainLink"
        :invite-link-expires-at="inviteLinkExpiresAtRef"
        @update:link="updateLink"
        @link:expired="plainLink = null"
      />
      <div class="d-flex w-100 tw-justify-between align-center gap-4">
        <alex-inputs-users-autocomplete
          v-if="!noSelectUsers"
          v-model="members"
          class="w-100"
          name="members"
          :label="$t('components.learningPlan.projects.invite.people')"
          :placeholder="$t('components.learningPlan.projects.invite.search')"
          :no-data-text="$t('components.learningPlan.projects.invite.noData')"
          :ignore-user-ids="ignoreUserIds"
          :ignore-emails="ignoreUserEmails"
          required
          thicker-label
        >
          <template #item="{ props: propsItem, item, index }">
            <alex-custom-list-item-user
              v-bind="propsItem"
              :key="index"
              :user="{
                email: item.raw.email,
                name: item.raw.fullname,
                image:
                  item.raw.avatar?.formats?.small?.url || item.raw.avatar?.url,
              }"
              no-delete
              no-checkbox
            /> </template
        ></alex-inputs-users-autocomplete>
        <alex-custom-button size="large">{{
          $t('components.appGeneralBoxes.students.singular')
        }}</alex-custom-button>
      </div>
      <pre>{{
        {
          plainLink,
          invitationDuration,
          inviteLinkHash,
          inviteLinkExpiresAtRef,
        }
      }}</pre>
    </div>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
import { AlexDropdownItem } from '../../custom/Dropdown.vue';

export interface InviteDialogProps {
  dialogTitle: string;
  dialogActionText: string;
  dialogActionLoading?: boolean;
  dialogActionDisabled?: boolean;
  invitationDuration: number;
  inviteLinkHash?: string | null;
  inviteLinkExpiresAt?: Date | null;

  learningPlanId: number;
  activeInviteId?: number | null;
  noSelectUsers?: boolean;
  ignoreUserIds?: number[];
  ignoreUserEmails?: string[];
}
const { t } = useI18n();
const { generateUrl, generateNewInvite, calcRemainingTime } =
  useInvitationLink();

const emit = defineEmits(['action', 'click:filter', 'update:search']);
const props = withDefaults(defineProps<InviteDialogProps>(), {
  ignoreUserEmails: () => [],
  ignoreUserIds: () => [],
  activeInviteId: null,
  inviteLinkHash: null,
  inviteLinkExpiresAt: null,
});

const { inviteLinkHash, inviteLinkExpiresAt } = toRefs(props);

const inviteLinkExpiresAtRef = ref<Date | null>(props.inviteLinkExpiresAt);

const plainLink = ref<string | null>(
  props.inviteLinkHash ? generateUrl(props.inviteLinkHash) : null,
);

const members = ref([]);
const dialogModel = defineModel<boolean>({ required: true });

const dropdownItems: AlexDropdownItem[] = [
  {
    text: t('components.appGeneralBoxes.students.singular'),
    onClick: () =>
      console.log(t('components.appGeneralBoxes.students.singular')),
  },
  {
    text: t('components.learningPlan.projects.collaborator'),
    onClick: () =>
      console.log(t('components.learningPlan.projects.collaborator')),
  },
];

const updateLink = async (classId) => {
  const result = await generateNewInvite(
    props.activeInviteId,
    props.invitationDuration,
    props.learningPlanId,
    classId,
  );
  console.log('updateLink');

  plainLink.value = generateUrl(result.data.attributes.hash);
  inviteLinkExpiresAtRef.value = result.data.attributes.expires_at;
};

watch([inviteLinkHash], () => {
  if (inviteLinkHash.value) {
    plainLink.value = generateUrl(inviteLinkHash.value);
  }
});

watch([inviteLinkExpiresAt], () => {
  console.log({
    inviteLinkExpiresAt: inviteLinkExpiresAt.value,
    inviteLinkExpiresAtRef: inviteLinkExpiresAtRef.value,
  });
  inviteLinkExpiresAtRef.value = inviteLinkExpiresAt.value;
});
</script>
