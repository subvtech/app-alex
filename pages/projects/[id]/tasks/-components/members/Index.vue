<template>
  <v-data-iterator
    :search="search"
    :page="page"
    :items="members"
    :items-per-page="itemsPerPage"
    class="members"
    :loading="loadingGroup"
    :filter-keys="['student_member.user.email', 'student_member.user.username', 'student_member.user.fullname']"
  >
    <!-- Header -->
    <template #header>
      <div class="header d-flex tw-align-center py-4 px-2">
        <alex-inputs-text-field
          v-model="search"
          name="member"
          class="w-100 tw-mr-4"
          :placeholder="$t('components.learningPlan.members.search')"
          prepend-inner-icon="mdi-magnify"
          density="compact"
          clearable
        />

        <AddMemberDialog
          v-model="addMemberDialog"
          :learningplan-id="learningplanId"
          :default-members="members"
          :group-id="group?.id"
          @add-click="addMember"
        />

        <alex-custom-button class="tw-ml-auto" variant="secondary" prepend-icon="mdi-plus" @click="handleAddMember">{{
          $t('components.learningPlan.members.add.label')
        }}</alex-custom-button>
      </div>
    </template>
    <!-- Cards -->
    <template #default="{ items }">
      <Card
        v-for="member in items"
        :key="member.raw.id"
        :member="{
          name: member.raw.student_member.user.fullname,
          image:
            member.raw.student_member.user?.avatar?.formats?.small?.url || member.raw.student_member.user?.avatar?.url,
          responsable: member.raw.role === learningPlanGroupMemberRolesSimple.IN_CHARGE,
          email: member.raw.student_member.user.email,
        }"
        :raw="member"
        no-checkbox
        @toggle-responsible-click="(value, inCharge) => handleUpdateMember(value?.raw, inCharge)"
        @remove-click="(value) => handleRemoveMember(value.raw)"
      />
    </template>
    <template #no-data>
      <div class="d-flex align-center justify-center flex-column ga-4 text-center">
        <img
          class="no-members-svg"
          src="/svg/no-members.svg"
          :alt="$t('components.learningPlan.members.missing.member')"
          role="no-members"
        />
        <p class="text-body-3 text-gray-400">
          {{ $t('components.learningPlan.members.missing.member') }}
        </p>
      </div>
    </template>
    <template #loader>
      <div class="tw-flex tw-items-center tw-justify-center">
        <v-progress-circular color="secondary-0" indeterminate></v-progress-circular>
      </div>
    </template>
    <template #footer="{ pageCount, groupedItems }">
      <div v-if="groupedItems.length && members.length > itemsPerPage" class="d-flex align-center ga-2 pa-6">
        <span class="flex-1-1">
          {{ showingData(members, groupedItems as any[], search, pageCount) }}
        </span>
        <alex-custom-pagination v-model="page" :length="pageCount" :total-visible="3" class="extra-mb" />
      </div>
    </template>
  </v-data-iterator>
</template>

<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query';
import { MemberItem, useGetLearningGroup, useRemoveMember, useUpdateMember } from '../../-composables/useMember';
import AddMemberDialog from './AddMemberDialog.vue';
import Card from './Card.vue';
interface MembersProps {
  startAt?: string | null;
  finishAt?: string | null;
  blockDelete?: boolean;
  edit?: boolean;
  taskId?: number;
  learningplanId?: number;
}

const props = withDefaults(defineProps<MembersProps>(), {
  startAt: null,
  finishAt: null,
  blockDelete: false,
  edit: true,
  taskId: undefined,
  learningplanId: undefined,
  students: () => [],
});

type Emits = {
  'change-members': [];
  'set-members': [value: LearningPlanMemberSimple[]];
};
const emit = defineEmits<Emits>();
// refs
const itemsPerPage = 12;
const addMemberDialog = ref(false);
const page = ref<number>(1);
const search = ref('');
const strapi = useStrapi();

const { setMessage } = useMessageStore();
const { t } = useI18n();

const taskIdValue = toRef(props, 'taskId');
const enabledGetMembers = computed(() => !!taskIdValue.value);
const { data: group, isPending: loadingGroup } = useGetLearningGroup(taskIdValue, enabledGetMembers);
const { mutateAsync: removeMember } = useRemoveMember();
const { mutateAsync: updateMember } = useUpdateMember();
const members = computed(() => group.value?.group_members || []);
const queryClient = useQueryClient();
// methods
const showingData = (items: any[], pageItems: any[], search: string, pageCount: number) => {
  const itemsPerPageCalc = search ? itemsPerPage : pageItems.length;
  const range = pageItems.length < itemsPerPage ? 2 : 1;
  const from = itemsPerPageCalc === 1 ? items.length : (page.value - 1) * itemsPerPageCalc + range;
  const to = page.value === pageCount ? items.length : page.value * itemsPerPageCalc;
  const total = items.length;
  const message = t('pages.courses.showingData', {
    from,
    to,
    total,
    entity: t('components.learningPlan.drawer.students'),
  });

  return message;
};

const addMember = async (groupId: number, newMembers: MemberItem[]) => {
  try {
    const newMembersValue = newMembers.map((member) => ({ member_id: member.id, role: member.role }));
    const newResponsable = newMembersValue.find((member) => member.role === 'in_charge');
    const oldMembers = members.value.map((member) => ({
      member_id: member.student_member.id,
      role: !newResponsable ? member.role : 'standard',
    }));
    await strapi.update('/learnin-plan-groups', groupId, { members: oldMembers.concat(newMembersValue) });
    queryClient.invalidateQueries({ queryKey: ['learning-group', taskIdValue.value] });
    emit('change-members');
  } catch (error) {
    setMessage(t('components.learningPlan.drawer.task.errors.addMember'), 'error', true);
  }
};

const handleAddMember = () => {
  addMemberDialog.value = true;
};
const handleRemoveMember = async (member: LearningPlanGroupMemberSimple) => {
  if (member.role === 'in_charge') {
    setMessage(t('pages.projects.tasks.cant_remove_in_charge'), 'error', true);
    return;
  }
  await removeMember({ id: member.id });
  queryClient.invalidateQueries({ queryKey: ['learning-group', taskIdValue.value] });
  emit('change-members');
};
const handleUpdateMember = async (member?: LearningPlanGroupMemberSimple, inCharge?: boolean) => {
  if (!member) {
    return;
  }
  const oldInCharge = members.value.find((oldMember) => oldMember.role === 'in_charge');
  if (oldInCharge) {
    await updateMember({ id: oldInCharge.id, role: 'standard' });
  }
  await updateMember({ id: member.id, role: inCharge ? 'in_charge' : 'standard' });
  queryClient.invalidateQueries({ queryKey: ['learning-group', taskIdValue.value] });
};
</script>

<style>
.no-members-svg {
  opacity: 0.6;
  mix-blend-mode: luminosity;
  width: 150px;
  height: 111.829px;
}
.members .v-input__details {
  display: none !important;
}
.add-member-enter-active {
  transition: all 0.5s ease-in-out;
}
.add-member-enter-from,
.add-member-leave-to {
  opacity: 0;
}
</style>
