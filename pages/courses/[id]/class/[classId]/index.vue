<template>
  <div>
    <alex-learningplan-class-section-card
      v-model:search="searchMembers"
      v-model:dialog-model="dialogAddMember"
      :title="
        $t('pages.classes.classMembers', {
          class: classStore?.currentClass?.name,
        })
      "
      :loading="learningPlanStore.loading"
      :show-empty-state="!classStore?.activeMembers?.length"
      :items="classStore.activeMembers || []"
      empty-state-image="/svg/no-team-members.svg"
      image-height="250px"
      image-width="335px"
      :empty-state-message="$t('pages.classes.emptyStateMemberClass')"
      :search-placeholder="$t('pages.classes.findMember')"
      :action-text="$t('pages.classes.invites')"
      action-icon="mdi-email-outline"
      :dialog-title="$t('pages.classes.courseInvites')"
      :filter-keys="['user.fullname', 'email']"
      :hide-action="!userIsCourseFacilitator"
      :dialog-action-text="$t('pages.classes.sendInvites')"
      :dialog-action-loading="sendingInvites"
      :dialog-action-disabled="!usersToInvite.length"
      entity="member"
      @action="onClickSendInvites"
    >
      <template #item="{ item }">
        <alex-learningplan-class-member-card
          :name="item?.user?.fullname"
          :email="item.email"
          :avatar-image="item?.user?.avatar?.url"
          :cover-image="item?.user?.cover"
          :role="item?.role"
          :no-options="!classStore.userCanEdit"
          @delete="() => deleteParticipant(item.id)"
        />
      </template>
      <template #dialog-content>
        <alex-inputs-users-autocomplete
          v-model="usersToInvite"
          name="usersToInvite"
          class="w-100 mb-4"
          hide-details="auto"
          :ignore-user-ids="ignoreUserIds"
          :ignore-emails="ignoreUserEmails"
          :label="$t('components.learningPlan.dialogs.whoParticipate')"
          :placeholder="$t('components.learningPlan.dialogs.searchMember')"
          :no-data-text="$t('components.usersAutocomplete.searchUserToCourse')"
        />
        <p class="text-body-4 text-gray-900">
          {{ $t('components.learningPlan.dialogs.pendingInvites') }}
        </p>
        <alex-custom-list-item-user
          v-for="(member, i) in classStore.pendingMembers"
          :key="`pending-member-${i}`"
          :user="{
            name: member.user?.fullname,
            email: member.email,
            image: member.user?.avatar?.url,
          }"
          remove-selection
          :loading-delete="removingMember && removingMemberId === member.id"
          :loading-second-button="resendingInviteMember && resendingInviteMemberId === member.id"
          @delete="onDeleteParticipant(member.id)"
          @second-button-action="onResendInvite(member)"
          ><template #secondButton="{ loading, click }">
            <alex-custom-button icon="mdi-cached" variant="text" :loading="loading" @click="click" /> </template
        ></alex-custom-list-item-user>
      </template>
    </alex-learningplan-class-section-card>
    <alex-learningplan-class-section-card
      v-model:search="searchGroups"
      v-model:dialog-model="dialogGroup"
      :title="$t('pages.classes.membersGroup')"
      :loading="learningPlanStore.loading"
      :items="classStore.currentClass?.learning_plan_groups"
      :show-empty-state="!classStore.currentClass?.learning_plan_groups?.length"
      empty-state-image="/svg/no-group-members.svg"
      image-height="200px"
      image-width="250px"
      :empty-state-message="$t('pages.classes.emptyGroupsMessage')"
      :search-placeholder="$t('pages.classes.findGroup')"
      :action-text="$t('pages.classes.createGroup')"
      action-icon="mdi-account-multiple-plus-outline"
      colored-background
      :dialog-action-text="dialogGroupActionText"
      :dialog-title="dialogGroupTitle"
      :filter-keys="['title']"
      :hide-action="!canCreateGroup"
      :dialog-action-loading="creatingGroup"
      :dialog-action-disabled="generateRandomGroups ? !canGenerateRandomGroups : !formAddGroup.meta.value.valid"
      empty-state-object-name="pages.classes.participant"
      entity="group"
      @action="!editing ? onCreateGroup() : onUpdateGroup(editingGroupId)"
    >
      <template #item="{ item }">
        <alex-learningplan-class-group-card
          :title="item?.title"
          :members="getGroupMembersInfo(item.group_members)"
          :no-options="!canManageGroup(item.group_members)"
          @delete="() => deleteGroupCard(item.id)"
          @edit="() => setUpdatedValues(item.id, item.title, item.group_members)"
          @open="() => openGroupCard(item)"
        />
      </template>
      <template #dialog-content>
        <v-form>
          <alex-inputs-text-field
            v-model="groupTitle"
            :schema="createGroupRules.groupTitle"
            :label="$t('pages.classes.whatGroupName')"
            :placeholder="$t('pages.classes.textGroupName')"
            name="groupTitle"
            density="comfortable"
            :disabled="generateRandomGroups"
          />
          <alex-inputs-autocomplete
            v-model="selectedInChargeGroupMember"
            :schema="createGroupRules.leader"
            :label="$t('pages.classes.whoAreGroupResponsible')"
            :placeholder="$t('pages.classes.selectGroupResponsible')"
            name="leader"
            variant="outlined"
            density="comfortable"
            item-title="user.fullname"
            :custom-filter="searchGroupMembers"
            :items="classStore.activeMembers"
            return-object
            :disabled="generateRandomGroups"
          >
            <template #item="{ props: propsItem, item, index }">
              <alex-custom-list-item-user
                v-bind="propsItem"
                :key="index"
                :user="{
                  email: item.raw.user.email,
                  name: item.raw.user.fullname,
                }"
                no-delete
              />
            </template>
          </alex-inputs-autocomplete>
          <alex-inputs-autocomplete
            v-model="selectedGroupMembers"
            :label="$t('pages.classes.whoAreGroupMembers')"
            :schema="createGroupRules.members"
            :placeholder="$t('pages.classes.selectGroupMembers')"
            name="members"
            variant="outlined"
            density="comfortable"
            item-title="user.fullname"
            :items="classStore.activeMembers || []"
            :custom-filter="searchGroupMembers"
            return-object
            multiple
            :disabled="generateRandomGroups"
          >
            <template #selection>
              <span></span>
            </template>
            <template #item="{ props: propsItem, item, index }">
              <alex-custom-list-item-user
                v-bind="propsItem"
                :key="index"
                :user="{
                  email: item.raw.user.email,
                  name: item.raw.user.fullname,
                  image: item.raw.user?.avatar?.url,
                }"
              />
            </template>
          </alex-inputs-autocomplete>
          <alex-custom-list-item-user
            v-for="(member, i) in selectedGroupMembers"
            :key="`group-member-${i}`"
            :user="{
              email: member?.user?.email || '',
              name: member?.user?.fullname || '',
              image: member?.user?.avatar?.url || '',
            }"
            remove-selection
            :no-delete="generateRandomGroups"
            @delete="() => removeSelectedGroupMember(member.id)"
          >
            <template v-if="member.id === selectedInChargeGroupMember?.id" #chip>
              <alex-custom-chip status="primary" size="small" :text="$t('pages.classes.responsible')" />
            </template>
          </alex-custom-list-item-user>
          <template v-if="!editing && userIsCourseFacilitator">
            <alex-inputs-checkbox
              v-model:model-value="generateRandomGroups"
              :label="$t('pages.classes.generateRandomGroups')"
              class="random-groups-checkbox ml-n2 mb-2"
            />
            <template v-if="generateRandomGroups">
              <div class="random-groups-fields">
                <alex-inputs-text-field
                  :model-value="studentsToUse"
                  :label="$t('pages.classes.studentsToUse')"
                  :placeholder="$t('pages.classes.studentsToUsePlaceholder')"
                  name="studentsToUse"
                  density="comfortable"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  :error="randomGroupValidation?.field === 'students' || randomGroupValidation?.field === 'both'"
                  :error-messages="randomGroupValidation?.field === 'students' ? randomGroupValidation.message : undefined"
                  @update:model-value="updateStudentsToUse"
                />
                <p
                  class="text-body-2 text-gray-600 mb-4"
                  :class="{ 'mt-n4': randomGroupValidation?.field !== 'students' }"
                >
                  {{ $t('pages.classes.studentsToUseHint') }}
                </p>
                <alex-inputs-text-field
                  :model-value="peoplePerGroup"
                  :label="$t('pages.classes.peoplePerGroup')"
                  :placeholder="$t('pages.classes.peoplePerGroupPlaceholder')"
                  name="peoplePerGroup"
                  density="comfortable"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  :error="randomGroupValidation?.field === 'groupSize' || randomGroupValidation?.field === 'both'"
                  :error-messages="randomGroupValidation?.field === 'groupSize' || randomGroupValidation?.field === 'both' ? randomGroupValidation.message : undefined"
                  @update:model-value="updatePeoplePerGroup"
                />
                <p v-if="randomGroupCount !== null" class="text-body-2 text-gray-600 mt-n4 mb-4">
                  {{ $t('pages.classes.randomGroupsCount', { count: randomGroupCount }) }}
                </p>
              </div>
            </template>
          </template>
        </v-form>
      </template>
    </alex-learningplan-class-section-card>
    <alex-learningplan-class-participants-details-dialog
      v-model="dialogShowGroup"
      :show-values-group="showValuesGroup"
    />
    <alex-custom-confirm-dialog
      v-model="dialogConfirmDeleteGroup"
      variant="error"
      :image="{ src: '/svg/exclusionImage.svg', width: 120, height: 100 }"
      :title="$t('pages.classes.wantDeleteGroup')"
      :subtitle="$t('pages.classes.deleteGroupSubtitle')"
      :submit-button-text="$t('pages.classes.delete')"
      :cancel-button-text="$t('components.courses.settings.meetings.delete.cancel')"
      @cancel="dialogConfirmDeleteGroup = false"
      @submit="() => onDeleteGroup(removingGroupId)"
    />
    <alex-custom-confirm-dialog
      v-model="confirmDeleteMember"
      variant="error"
      :image="{ src: '/svg/exclusionImage.svg', width: 120, height: 100 }"
      :title="$t('pages.classes.wantDeleteMember')"
      :subtitle="$t('pages.classes.deleteMemberSubtitle')"
      :submit-button-text="$t('pages.classes.delete')"
      no-input-confirmation
      :cancel-button-text="$t('components.courses.settings.meetings.delete.cancel')"
      @submit="() => onDeleteParticipant(removingMemberId)"
      @cancel="confirmDeleteMember = false"
    />
  </div>
</template>
<script setup lang="ts">
import { useForm } from 'vee-validate';
import { buildRandomGroupDefinitions } from '~/utils/randomGroupGeneration';
const { t } = useI18n();
const { setMessage } = useMessageStore();
const { createGroupRules } = useFormRules();
const strapi = useStrapi();
const formAddGroup = useForm();
const editing = ref(false);
const editingGroupId = ref(0);
// Dialog
const dialogAddMember = ref(false);
const dialogGroup = ref(false);
const dialogShowGroup = ref(false);
const dialogConfirmDeleteGroup = ref(false);
const dialogGroupTitle = ref(t('pages.classes.createGroup'));
const dialogGroupActionText = ref(t('pages.classes.createGroup'));
//
const showValuesGroup = ref<{
  title: string;
  members: LearningPlanGroupMemberSimple[];
}>();

// Filters
const searchMembers = ref('');
const searchGroups = ref('');
//
const usersToInvite = ref([]);
const learningPlanStore = useLearningPlanStore();
const viewModeStudentStore = useViewModeStudentStore();
const classStore = useClassStore();
const currentUser = useStrapiUser();
const currentUserClassMemberId = computed(
  () =>
    classStore.activeMembers.find(
      (member) => member.user?.id === currentUser.value?.id,
    )?.id,
);

const route = useRoute();
const learningPlanId = computed(() => parseInt(route.params?.id.toString()));
const effectiveUserIsFacilitator = computed(() => {
  return !viewModeStudentStore.viewAsStudent && learningPlanStore.userIsFacilitator;
});
const userIsCourseFacilitator = computed(() => effectiveUserIsFacilitator.value);
const canCreateGroup = computed(
  () => userIsCourseFacilitator.value || currentUserClassMemberId.value !== undefined,
);
const sendingInvites = ref(false);
const creatingGroup = ref(false);
// Remove
const confirmDeleteMember = ref(false);
const removingMember = ref(false);
const removingMemberId = ref(0);
// const removingGroup = ref(false);
const removingGroupId = ref(0);
//
const groupTitle = ref('');
const generateRandomGroups = ref(false);
const studentsToUse = ref('');
const peoplePerGroup = ref('');
const invalidStudentsToUse = ref(false);
const invalidPeoplePerGroup = ref(false);
const ungroupedActiveMembers = computed(() => {
  const groupedStudentIds = new Set(
    (classStore.currentClass?.learning_plan_groups || []).flatMap(
      (group) =>
        group.group_members?.map((groupMember) => groupMember.student_member?.id) ??
        [],
    ),
  );
  return classStore.activeMembers.filter((member) => !groupedStudentIds.has(member.id));
});
type RandomGroupValidation = {
  field: 'students' | 'groupSize' | 'both';
  message: string;
};
const randomGroupValidation = computed<RandomGroupValidation | null>(() => {
  if (!generateRandomGroups.value) {
    return null;
  }

  const availableStudentCount = ungroupedActiveMembers.value.length;
  if (availableStudentCount === 0) {
    return {
      field: 'students',
      message: t('pages.classes.randomGroupsNoStudents'),
    };
  }

  if (invalidStudentsToUse.value) {
    return {
      field: 'students',
      message: t('pages.classes.randomGroupsInvalidInteger'),
    };
  }

  const studentCount =
    studentsToUse.value === '' ? availableStudentCount : Number(studentsToUse.value);
  if (!Number.isSafeInteger(studentCount) || studentCount <= 0) {
    return {
      field: 'students',
      message: t('pages.classes.randomGroupsInvalidInteger'),
    };
  }
  if (studentCount > availableStudentCount) {
    return {
      field: 'students',
      message: t('pages.classes.randomGroupsStudentCountExceedsTotal', {
        total: availableStudentCount,
      }),
    };
  }

  const groupSize = Number(peoplePerGroup.value);
  if (
    invalidPeoplePerGroup.value ||
    !peoplePerGroup.value ||
    !Number.isSafeInteger(groupSize) ||
    groupSize <= 0
  ) {
    return {
      field: 'groupSize',
      message: t('pages.classes.randomGroupsInvalidInteger'),
    };
  }
  if (studentCount % groupSize !== 0) {
    return {
      field: 'both',
      message: t('pages.classes.randomGroupsNotDivisible'),
    };
  }

  return null;
});
const randomGroupCount = computed<number | null>(() => {
  if (!generateRandomGroups.value || randomGroupValidation.value) {
    return null;
  }

  const studentCount =
    studentsToUse.value === ''
      ? ungroupedActiveMembers.value.length
      : Number(studentsToUse.value);
  return studentCount / Number(peoplePerGroup.value);
});
const canGenerateRandomGroups = computed(() => !randomGroupValidation.value && !creatingGroup.value);
const headerStore = usePageHeaderStore();
const resendingInviteMember = ref(false);
const resendingInviteMemberId = ref(0);
const selectedInChargeGroupMember = ref<LearningPlanMemberSimple | null>(null);
const selectedGroupMembers = ref<LearningPlanMemberSimple[]>([]);
const ignoreUserIds = computed(() => {
  return learningPlanStore.learningPlan?.members?.map((m) => m.user?.id) || [];
});

const ignoreUserEmails = computed(() => {
  return learningPlanStore.learningPlan?.members?.map((m) => m.email) || [];
});

function removeSelectedGroupMember(id: number) {
  if (selectedInChargeGroupMember?.value?.id === id) {
    formAddGroup.setFieldError('members', t('pages.classes.cantRemoveResponsible'));
    setTimeout(() => {
      formAddGroup.setFieldError('members', undefined);
    }, 2000);
  }
  selectedGroupMembers.value = selectedGroupMembers.value.filter((member) => member.id !== id);
}

function normalizeIntegerInput(value: string | number | null, previousValue: string) {
  const input = String(value ?? '');
  const isIntegerInput = /^\d*$/.test(input);
  return {
    value: isIntegerInput ? input : previousValue,
    isIntegerInput,
  };
}

function updateStudentsToUse(value: string | number | null) {
  const normalized = normalizeIntegerInput(value, studentsToUse.value);
  studentsToUse.value = normalized.value;
  invalidStudentsToUse.value = !normalized.isIntegerInput;
}

function updatePeoplePerGroup(value: string | number | null) {
  const normalized = normalizeIntegerInput(value, peoplePerGroup.value);
  peoplePerGroup.value = normalized.value;
  invalidPeoplePerGroup.value = !normalized.isIntegerInput;
}

async function onClickSendInvites() {
  if (!userIsCourseFacilitator.value) {
    setMessage('Apenas facilitadores do curso podem convidar participantes para a turma.', 'red', true);
    return;
  }

  if (!usersToInvite.value.length) {
    return;
  }

  try {
    sendingInvites.value = true;

    await strapi.update<ClassSimple>('classes', classStore.currentClass?.id || 0, {
      learning_plan_members: usersToInvite.value,
    });

    usersToInvite.value = [];

    setMessage('Convites enviados com sucesso!', 'green', true);

    await classStore.reloadClass();
  } catch (error) {
    setMessage('Erro ao enviar convites!', 'red', true);
  } finally {
    sendingInvites.value = false;
  }
}

async function onCreateGroup() {
  if (!canCreateGroup.value) {
    setMessage(t('pages.classes.groupCreationPermissionError'), 'red', true);
    return;
  }

  if (generateRandomGroups.value) {
    if (!userIsCourseFacilitator.value) {
      setMessage(t('pages.classes.randomGroupGenerationPermissionError'), 'red', true);
      return;
    }

    await onCreateRandomGroups();
    return;
  }

  const { valid } = await formAddGroup.validate();
  if (!valid) {
    return;
  }
  try {
    creatingGroup.value = true;

    const members = selectedGroupMembers.value?.map((member: LearningPlanMemberSimple) => {
      const role = member.id === selectedInChargeGroupMember.value?.id ? 'in_charge' : 'standard';
      return { role, member_id: member.id };
    });

    const data = {
      title: groupTitle.value,
      learningplan: learningPlanId.value,
      learning_class: classStore.currentClass?.id || 0,
      group_members: members,
    };

    await strapi.create('learnin-plan-groups', data);
    setMessage('Grupo criado com sucesso!', 'green', true);
    await classStore.reloadClass();
    selectedGroupMembers.value = [];
    selectedInChargeGroupMember.value = null;
    formAddGroup.resetForm();
    dialogGroup.value = false;
  } catch (_) {
    setMessage('Erro ao criar grupo!', 'red', true);
  } finally {
    creatingGroup.value = false;
  }
}

async function onCreateRandomGroups() {
  if (!canGenerateRandomGroups.value) {
    return;
  }

  const availableMembers = ungroupedActiveMembers.value;
  const studentCount =
    studentsToUse.value === '' ? availableMembers.length : Number(studentsToUse.value);
  const groupSize = Number(peoplePerGroup.value);
  const existingTitles =
    classStore.currentClass?.learning_plan_groups?.map((group) => group.title) || [];
  const groups = buildRandomGroupDefinitions(
    availableMembers,
    studentCount,
    groupSize,
    existingTitles,
  );
  let createdCount = 0;

  creatingGroup.value = true;
  try {
    try {
      for (const group of groups) {
        const groupMembers = group.members.map((member) => ({
          member_id: member.id,
          role: member.id === group.responsible.id ? 'in_charge' : 'standard',
        }));

        await strapi.create('learnin-plan-groups', {
          title: group.title,
          learningplan: learningPlanId.value,
          learning_class: classStore.currentClass?.id || 0,
          group_members: groupMembers,
        });
        createdCount++;
      }
    } catch {
      if (createdCount === 0) {
        setMessage(t('pages.classes.randomGroupsCreateError'), 'red', true);
        return;
      }

      try {
        await classStore.reloadClass();
        setMessage(
          t('pages.classes.randomGroupsPartialError', {
            created: createdCount,
            total: groups.length,
          }),
          'red',
          true,
        );
      } catch {
        setMessage(
          t('pages.classes.randomGroupsPartialReloadError', {
            created: createdCount,
            total: groups.length,
          }),
          'red',
          true,
        );
      }
      dialogGroup.value = false;
      return;
    }

    try {
      await classStore.reloadClass();
    } catch {
      setMessage(t('pages.classes.randomGroupsReloadError', { count: createdCount }), 'red', true);
      dialogGroup.value = false;
      return;
    }

    setMessage(t('pages.classes.randomGroupsCreated', { count: createdCount }), 'green', true);
    dialogGroup.value = false;
  } finally {
    creatingGroup.value = false;
  }
}

async function onDeleteGroup(id: number) {
  const group = classStore.currentClass?.learning_plan_groups?.find((item) => item.id === id);
  if (!group || !canManageGroup(group.group_members)) {
    setMessage(t('pages.classes.groupManagementPermissionError'), 'red', true);
    dialogConfirmDeleteGroup.value = false;
    return;
  }

  try {
    await strapi.delete('learnin-plan-groups', id);
    setMessage('Grupo excluido com sucesso!', 'green', true);
    await classStore.reloadClass();
  } catch (_) {
    setMessage('Erro ao excluir grupo!', 'red', true);
  } finally {
    dialogConfirmDeleteGroup.value = false;
  }
}

async function onUpdateGroup(id: number) {
  const classGroup = classStore.currentClass?.learning_plan_groups?.find((item) => item.id === id);
  if (!classGroup || !canManageGroup(classGroup.group_members)) {
    setMessage(t('pages.classes.groupManagementPermissionError'), 'red', true);
    return;
  }

  const { valid } = await formAddGroup.validate();
  if (!valid) {
    return;
  }
  try {
    const group = learningPlanStore.learningPlan?.groups.find((group) => group.id === id);
    if (!group) {
      return;
    }
    const groupMembers = selectedGroupMembers.value.map((member) => {
      const role = member.id === selectedInChargeGroupMember.value?.id ? 'in_charge' : 'standard';
      return { member_id: member.id, role };
    });
    const data = {
      title: groupTitle.value,
      learningplan: learningPlanId.value,
      members: groupMembers,
    };
    await strapi.update('learnin-plan-groups', id, data);
    setMessage('Grupo atualizado com sucesso!', 'green', true);
    await classStore.reloadClass();
  } catch (_) {
    setMessage('Erro ao atualizar o grupo!', 'red', true);
  }
}

function setUpdatedValues(id: number, title: string, groupMembers: LearningPlanGroupMemberSimple[]) {
  if (!canManageGroup(groupMembers)) {
    setMessage(t('pages.classes.groupManagementPermissionError'), 'red', true);
    return;
  }

  generateRandomGroups.value = false;
  studentsToUse.value = '';
  peoplePerGroup.value = '';
  dialogGroupTitle.value = t('pages.classes.editGroup');
  dialogGroupActionText.value = t('pages.classes.editGroup');
  dialogGroup.value = true;
  editingGroupId.value = id;
  editing.value = true;
  groupTitle.value = title;
  const selectedMembersList =
    (learningPlanStore?.activeMembers?.filter((activeMember) =>
      groupMembers.map((member) => member.student_member.id).includes(activeMember.id),
    ) as LearningPlanMemberSimple[]) || [];
  formAddGroup.setFieldValue('members', selectedMembersList);
  selectedGroupMembers.value = selectedMembersList;
  const leader = filterMembersByRole('IN_CHARGE', groupMembers);
  const leaderId = leader ? leader[0]?.student_member?.id : undefined;
  const selectedLeader = selectedMembersList.filter((member) => member.id === leaderId)[0] || undefined;
  selectedInChargeGroupMember.value = selectedLeader;
  formAddGroup.setFieldValue('leader', selectedLeader);
}

function getGroupMembersInfo(groupMembers: LearningPlanGroupMemberSimple[]) {
  return (
    groupMembers?.map((groupMember) => {
      return {
        name: groupMember.student_member?.user?.fullname || '',
        image: groupMember.student_member?.user?.avatar
          ? {
              url: groupMember.student_member?.user?.avatar?.url || '',
              alt: groupMember.student_member?.user?.avatar?.name || '',
            }
          : undefined,
        role: groupMember.role,
      };
    }) || []
  );
}

async function onResendInvite(member: LearningPlanMemberSimple) {
  try {
    resendingInviteMemberId.value = member.id;
    resendingInviteMember.value = true;

    const data = {
      learningplan: learningPlanId.value,
      duration: 259200,
      emails_to_send: member.email,
      role: member.role,
      learninng_class: classStore.classId,
    };

    await strapi.create('invitation-links', data);
    setMessage('Convite reenviado com sucesso!', 'green', true);
  } catch (error) {
    setMessage('Não foi possivel reenviar o convite!', 'red', true);
  } finally {
    resendingInviteMember.value = false;
  }
}

async function onDeleteParticipant(id: number) {
  try {
    removingMember.value = true;
    removingMemberId.value = id;

    const response = await strapi.delete('learning-plan-members', id);
    if (response.data.id) {
      await classStore.reloadClass();
      setMessage('Participante removido com sucesso!', 'green', true);
    }
  } catch (error) {
    setMessage('Erro ao remover participante!', 'red', true);
  } finally {
    removingMember.value = false;
    confirmDeleteMember.value = false;
  }
}

function deleteParticipant(id: number) {
  removingMemberId.value = id;
  confirmDeleteMember.value = true;
}

function searchGroupMembers(_itemTitle: string, queryText: string, item: any) {
  return (
    item.raw.user.fullname.toLowerCase().includes(queryText) || item.raw.user.email.toLowerCase().includes(queryText)
  );
}

function filterMembersByRole(
  role: keyof typeof learningPlanGroupMemberRolesSimple,
  members?: LearningPlanGroupMemberSimple[],
) {
  return members?.filter((member) => member.role === learningPlanGroupMemberRolesSimple[role]);
}

function openGroupCard(item: any) {
  dialogShowGroup.value = true;
  showValuesGroup.value = {
    title: item.title,
    members: item.group_members,
  };
}

function deleteGroupCard(id: number) {
  const group = classStore.currentClass?.learning_plan_groups?.find((item) => item.id === id);
  if (!group || !canManageGroup(group.group_members)) {
    setMessage(t('pages.classes.groupManagementPermissionError'), 'red', true);
    return;
  }

  removingGroupId.value = id;
  dialogConfirmDeleteGroup.value = true;
}

function canManageGroup(groupMembers: LearningPlanGroupMemberSimple[]) {
  if (userIsCourseFacilitator.value) {
    return true;
  }

  const currentMemberId = currentUserClassMemberId.value;
  if (currentMemberId !== undefined) {
    return groupMembers.some(
      (groupMember) =>
        groupMember.student_member?.id === currentMemberId &&
        groupMember.role?.toLowerCase() === learningPlanGroupMemberRolesSimple.IN_CHARGE,
    );
  }

  return !viewModeStudentStore.viewAsStudent && classStore.userCanEdit;
}

onBeforeMount(() => (headerStore.showHeader = true));

watch(
  () => learningPlanStore.loading,
  () => {
    if (!learningPlanStore.loading) {
      headerStore.title = t('pages.classes.breadcrumbs.myCourses');
      headerStore.items = [
        {
          title: 'Home',
          to: '/',
          disabled: true,
        },
        {
          title: t('pages.classes.breadcrumbs.myCourses'),
          to: '/courses/me',
        },
        {
          title: learningPlanStore.learningPlan ? learningPlanStore.learningPlan.title : 'Curso',
          to: `/courses/${learningPlanId.value}`,
        },
        {
          title: t('pages.classes.breadcrumbs.classes'),
          to: `/courses/${learningPlanId.value}/class`,
        },
        {
          title: classStore.currentClass?.name || '',
          to: '',
        },
      ];
    }
  },
);

watch(
  () => [selectedGroupMembers.value, selectedInChargeGroupMember.value],
  () => {
    const alreadyHasLeader = selectedGroupMembers.value.filter(
      (member) => member.id === selectedInChargeGroupMember?.value?.id,
    );
    if (selectedInChargeGroupMember.value && !alreadyHasLeader.length) {
      selectedGroupMembers.value = [selectedInChargeGroupMember.value, ...selectedGroupMembers.value];
    }
  },
);

watch(dialogGroup, (value) => {
  if (!value) {
    groupTitle.value = '';
    generateRandomGroups.value = false;
    studentsToUse.value = '';
    peoplePerGroup.value = '';
    invalidStudentsToUse.value = false;
    invalidPeoplePerGroup.value = false;
    selectedGroupMembers.value = [];
    selectedInChargeGroupMember.value = null;
    formAddGroup.resetForm();
    editing.value = false;
    dialogGroupTitle.value = t('pages.classes.createGroup');
    dialogGroupActionText.value = t('pages.classes.createGroup');
    editing.value = false;
  }
});

watch(generateRandomGroups, (enabled) => {
  if (!enabled) {
    invalidStudentsToUse.value = false;
    invalidPeoplePerGroup.value = false;
  }
});
</script>

<style scoped>
.random-groups-checkbox :deep(.text-container.no-hint) {
  margin-bottom: 19px !important;
  margin-left: 3px;
}

.random-groups-fields {
  margin-top: -1rem;
}
</style>
