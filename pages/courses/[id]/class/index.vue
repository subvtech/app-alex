<template>
  <div>
    <alex-learningplan-class-section-card
      v-model:search="searchGroups"
      v-model:dialog-model="dialogGroup"
      :title="$t('pages.classes.cardTitle')"
      :loading="learningPlanStore.loading"
      :items="learningPlanStore.learningPlan?.classes"
      :show-empty-state="!learningPlanStore.learningPlan?.classes?.length"
      empty-state-image="/svg/no-group-members.svg"
      image-height="200px"
      image-width="250px"
      :empty-state-message="$t('pages.classes.emptyClasses')"
      :search-placeholder="$t('pages.classes.findClasses')"
      :action-text="$t('pages.classes.createClass')"
      action-icon="mdi-account-multiple-plus-outline"
      colored-background
      :dialog-action-text="dialogGroupActionText"
      :dialog-title="dialogGroupTitle"
      :filter-keys="['name']"
      :show-action="learningPlanStore.userIsFacilitator"
      :dialog-action-loading="creatingGroup"
      :dialog-action-disabled="!formAddGroup.meta.value.valid"
      empty-state-object-name="pages.classes.participant"
      @action="!editing ? onCreateGroup() : onUpdateGroup(editingGroupId)"
    >
      <template #item="{ item }">
        <alex-learningplan-class-card
          :title="item?.name"
          :in-charge-member="{
            name: item?.in_charge_member?.user.fullname,
            image: item?.in_charge_member?.user.avatar,
          }"
          :class-members="getGroupMembersInfo(item?.learning_plan_members)"
          :no-options="!learningPlanStore.userIsFacilitator"
          :can-delete="!item.learning_plan_members.length"
          @delete="() => deleteClass(item.id)"
          @edit="
            () => setUpdatedValues(item.id, item.title, item.group_members)
          "
          @open="() => openCard(item)"
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
            :items="learningPlanStore.activeMembers"
            return-object
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
            :items="learningPlanStore.activeMembers || []"
            :custom-filter="searchGroupMembers"
            return-object
            multiple
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
            @delete="() => removeSelectedGroupMember(member.id)"
          >
            <template
              v-if="member.id === selectedInChargeGroupMember?.id"
              #chip
            >
              <alex-custom-chip
                status="dark"
                size="small"
                :text="$t('pages.classes.responsible')"
              />
            </template>
          </alex-custom-list-item-user>
        </v-form>
      </template>
    </alex-learningplan-class-section-card>
    <alex-learningplan-dialogs-alert
      v-model="dialogConfirmDeleteClass"
      variant="error"
      :image="{ src: '/svg/exclusionImage.svg', width: 120, height: 100 }"
      :title="$t('pages.classes.wantDeleteGroup')"
      :subtitle="$t('pages.classes.deleteGroupSubtitle')"
      :submit-button-text="$t('pages.classes.delete')"
      @cancel="dialogConfirmDeleteClass = false"
      @submit="() => onDeleteClass(removingClassId)"
    />
  </div>
</template>
<script setup lang="ts">
import { useForm } from 'vee-validate';
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
const dialogConfirmDeleteClass = ref(false);
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
const classStore = useClassStore();
const route = useRoute();
const learningPlanId = computed(() => parseInt(route.params?.id.toString()));
const sendingInvites = ref(false);
const creatingGroup = ref(false);
// Remove

// const removingGroup = ref(false);
const removingClassId = ref(0);
//
const groupTitle = ref('');
const headerStore = usePageHeaderStore();

const selectedInChargeGroupMember = ref<LearningPlanMemberSimple | null>(null);
const selectedGroupMembers = ref<LearningPlanMemberSimple[]>([]);

function removeSelectedGroupMember(id: number) {
  if (selectedInChargeGroupMember?.value?.id === id) {
    formAddGroup.setFieldError(
      'members',
      t('pages.classes.cantRemoveResponsible'),
    );
    setTimeout(() => {
      formAddGroup.setFieldError('members', undefined);
    }, 2000);
  }
  selectedGroupMembers.value = selectedGroupMembers.value.filter(
    (member) => member.id !== id,
  );
}

async function onCreateGroup() {
  const { valid } = await formAddGroup.validate();
  if (!valid) {
    return;
  }
  try {
    creatingGroup.value = true;

    const members = selectedGroupMembers.value?.map(
      (member: LearningPlanMemberSimple) => {
        const role =
          member.id === selectedInChargeGroupMember.value?.id
            ? 'in_charge'
            : 'standard';
        return { role, member_id: member.id };
      },
    );

    const data = {
      title: groupTitle.value,
      learningplan: learningPlanId.value,
      group_members: members,
    };

    await strapi.create('learnin-plan-groups', data);
    setMessage('Grupo criado com sucesso!', 'green', true);
    learningPlanStore.loadLearningPlan(learningPlanId.value);
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
async function onDeleteClass(id: number) {
  const { valid } = await formAddGroup.validate();
  if (!valid) {
    return;
  }
  try {
    await strapi.delete('classes', id);
    setMessage(t('pages.classes.deleteSucess'), 'green', true);
    learningPlanStore.loadLearningPlan(learningPlanId.value);
  } catch (_) {
    setMessage('Erro ao excluir grupo!', 'red', true);
  } finally {
    dialogConfirmDeleteClass.value = false;
  }
}
async function onUpdateGroup(id: number) {
  const { valid } = await formAddGroup.validate();
  if (!valid) {
    return;
  }
  try {
    const group =
      learningPlanStore.learningPlan?.groups.filter(
        (group) => group.id === id,
      ) || [];
    const groupMembers = group[0]?.group_members
      ?.filter((groupMember) => {
        return selectedGroupMembers.value
          .map((member) => member.id)
          .includes(groupMember.student_member.id);
      })
      .map((member) => {
        const role =
          member.student_member.id === selectedInChargeGroupMember.value?.id
            ? 'in_charge'
            : 'standard';
        return { id: member.id, role };
      });
    const data = {
      title: groupTitle.value,
      learningplan: learningPlanId.value,
      group_members: groupMembers,
    };

    await strapi.update('learnin-plan-groups', id, data);
    setMessage('Grupo atualizado com sucesso!', 'green', true);
    learningPlanStore.loadLearningPlan(learningPlanId.value);
  } catch (_) {
    setMessage('Erro ao atualizar o grupo!', 'red', true);
  }
}
function setUpdatedValues(
  id: number,
  title: string,
  groupMembers: LearningPlanGroupMemberSimple[],
) {
  dialogGroupTitle.value = 'Editar Grupo ';
  dialogGroupActionText.value = 'Atualizar Grupo';
  dialogGroup.value = true;
  editingGroupId.value = id;
  editing.value = true;
  groupTitle.value = title;
  const selectedMembersList =
    (learningPlanStore?.activeMembers?.filter((activeMember) =>
      groupMembers
        .map((member) => member.student_member.id)
        .includes(activeMember.id),
    ) as LearningPlanMemberSimple[]) || [];
  formAddGroup.setFieldValue('members', selectedMembersList);
  selectedGroupMembers.value = selectedMembersList;
  const leader = filterMembersByRole('IN_CHARGE', groupMembers);
  const leaderId = leader ? leader[0]?.student_member?.id : undefined;
  const selectedLeader =
    selectedMembersList.filter((member) => member.id === leaderId)[0] ||
    undefined;
  selectedInChargeGroupMember.value = selectedLeader;
  formAddGroup.setFieldValue('leader', selectedLeader);
}
function getGroupMembersInfo(members: LearningPlanMemberSimple[]) {
  return members?.map((member) => {
    return {
      name: member.user?.fullname || '',
      image: member.user?.avatar
        ? { url: member.user?.avatar?.url, alt: member.user?.avatar?.name }
        : undefined,
    };
  });
}

function searchGroupMembers(_itemTitle: string, queryText: string, item: any) {
  return (
    item.raw.user.fullname.toLowerCase().includes(queryText) ||
    item.raw.user.email.toLowerCase().includes(queryText)
  );
}
function filterMembersByRole(
  role: keyof typeof learningPlanGroupMemberRolesSimple,
  members?: LearningPlanGroupMemberSimple[],
) {
  return members?.filter(
    (member) => member.role === learningPlanGroupMemberRolesSimple[role],
  );
}
function openCard(item: ClassSimple) {
  navigateTo(`/courses/${learningPlanStore.learningPlan?.id}/class/${item.id}`);
}
function deleteClass(id: number) {
  removingClassId.value = id;
  dialogConfirmDeleteClass.value = true;
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
          title: 'Meus Cursos',
          to: '/courses/me',
        },
        {
          title: learningPlanStore.learningPlan
            ? learningPlanStore.learningPlan.title
            : 'Curso',
          to: `/courses/${learningPlanId.value}`,
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
      selectedGroupMembers.value = [
        selectedInChargeGroupMember.value,
        ...selectedGroupMembers.value,
      ];
    }
  },
);

watch(dialogGroup, (value) => {
  if (!value) {
    groupTitle.value = '';
    selectedGroupMembers.value = [];
    selectedInChargeGroupMember.value = null;
    formAddGroup.resetForm();
    editing.value = false;
    dialogGroupTitle.value = 'Criar Grupo ';
    dialogGroupActionText.value = 'Criar Grupo';
    editing.value = false;
  }
});
</script>
