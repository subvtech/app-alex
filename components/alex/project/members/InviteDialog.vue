<template>
  <alex-custom-dialog v-model="dialogModel" :title="dialogTitle" activator="parent" no-footer>
    <div class="d-flex flex-column gap-4">
      <span v-if="disableInvite" class="text-body-1 text-warning-0">
        {{ $t('components.learningPlan.projects.invite.disabled') }}
      </span>

      <div v-else>
        <div class="d-flex tw-justify-between tw-items-center w-100">
          <div class="d-flex gap-4">
            <alex-custom-button icon="mdi-attachment" variant="secondary" size="large" />
            <div class="d-flex flex-column">
              <span class="text-body-4">{{ $t('components.learningPlan.projects.invite.subtitle') }}</span>
              <span class="text-body-5">{{ $t('components.learningPlan.projects.invite.description') }}</span>
            </div>
          </div>
          <alex-custom-dropdown :items="dropdownItems">
            <template #activator="{ props: dropdownProps }">
              <alex-custom-button
                v-bind="dropdownProps"
                prepend-icon="mdi-pencil-outline"
                variant="secondary"
                size="large"
                >{{ inviteTypeCapitalised }}</alex-custom-button
              >
            </template>
          </alex-custom-dropdown>
        </div>
        <alex-learningplan-invites
          full-width
          :duration="invitationDuration"
          :url="plainLink"
          :course-id="learningPlanId"
          :invite-id="activeInviteId"
          :invite-link-expires-at="inviteLinkExpiresAtRef"
          @update:link="updateLink"
          @link:expired="plainLink = null"
        />
      </div>

      <div class="d-flex w-100 tw-justify-between align-center gap-4">
        <alex-inputs-users-autocomplete
          v-if="!noSelectUsers"
          v-model="membersToInvite"
          class="w-100"
          name="members"
          :label="$t('components.learningPlan.projects.invite.people')"
          :placeholder="$t('components.learningPlan.projects.invite.search')"
          :no-data-text="$t('components.learningPlan.projects.invite.noData')"
          :ignore-user-ids="ignoreUserIds"
          :ignore-emails="ignoreUserEmails"
          :submit-button-text="$t('components.learningPlan.projects.invite.submit')"
          :disable-submit-button="disableSubmit"
          show-submit-button
          required
          thicker-label
          @click:button="inviteMembers"
        >
          <template #item="{ props: propsItem, item, index }">
            <alex-custom-list-item-user
              v-bind="propsItem"
              :key="index"
              :user="{
                email: item.raw.email,
                name: item.raw.fullname,
                image: item.raw.avatar?.formats?.small?.url || item.raw.avatar?.url,
              }"
              no-delete
              no-checkbox
            /> </template
        ></alex-inputs-users-autocomplete>
      </div>
    </div>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
import { AlexDropdownItem } from '../../custom/Dropdown.vue';
import { MemberRoles, UserSimple } from '#imports';

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
  disableInvite?: boolean;
  ignoreUserEmails?: string[];
}
const { t } = useI18n();
const { setMessage } = useMessageStore();
const { generateUrl } = useInvitationLink();
const { create } = useStrapi();
const emit = defineEmits(['action', 'click:filter', 'update:search', 'update:members']);
const props = withDefaults(defineProps<InviteDialogProps>(), {
  ignoreUserEmails: () => [],
  ignoreUserIds: () => [],
  activeInviteId: null,
  inviteLinkHash: null,
  inviteLinkExpiresAt: null,
});

const { inviteLinkHash, inviteLinkExpiresAt } = toRefs(props);

const inviteLinkExpiresAtRef = ref<Date | null>(props.inviteLinkExpiresAt);

const plainLink = ref<string | null>(props.inviteLinkHash ? generateUrl(props.inviteLinkHash) : null);

const membersToInvite = ref<UserSimple[]>([]);
const dialogModel = defineModel<boolean>({ required: true });

const inviteType = ref<MemberRoles.COLLABORATOR | MemberRoles.STUDENT>(MemberRoles.STUDENT);

const dropdownItems: AlexDropdownItem[] = [
  {
    text: t('components.appGeneralBoxes.students.singular'),
    onClick: () => (inviteType.value = MemberRoles.STUDENT),
  },
  {
    text: t('components.learningPlan.projects.collaborator'),
    onClick: () => (inviteType.value = MemberRoles.COLLABORATOR),
  },
];

const inviteTypeCapitalised = computed(() => capitalize(inviteType.value));

const disableSubmit = computed(() => membersToInvite.value.length === 0);

const inviteMembers = async () => {
  const successfulInvitations: number[] = [];
  const failedInvitations: { id: number; error: any }[] = [];
  try {
    await Promise.all(
      membersToInvite.value.map(async (member) => {
        const data = {
          user: member.id,
          email: member.email,
          status: MemberStatus.PENDING_INVITATION,
          joined_at: new Date(),
          learningplan: props.learningPlanId,
          role: inviteType.value,
        };

        try {
          await create('learning-plan-members', data);
          successfulInvitations.push(member.id);
        } catch (error: any) {
          console.error(`Error inviting member ${member.id}:`, error);
          failedInvitations.push({ id: member.id, error: error.message });
        }
      }),
    );
  } catch (error) {
    console.error('Error during bulk invitation:', error);
  } finally {
    dialogModel.value = false;
    membersToInvite.value = [];
    if (successfulInvitations.length > 0) {
      setMessage(t('components.learningPlan.projects.invite.added'), 'green', true);
    } else setMessage(t('components.learningPlan.projects.invite.duplicated'), 'red', true);
    emit('update:members');
  }
};

const updateLink = (data) => {
  const { url, expiresAt } = data;

  plainLink.value = url;
  inviteLinkExpiresAtRef.value = expiresAt;
};

watch([inviteLinkHash], () => {
  if (inviteLinkHash.value) {
    plainLink.value = generateUrl(inviteLinkHash.value);
  }
});

watch([inviteLinkExpiresAt], () => {
  inviteLinkExpiresAtRef.value = inviteLinkExpiresAt.value;
});
</script>
