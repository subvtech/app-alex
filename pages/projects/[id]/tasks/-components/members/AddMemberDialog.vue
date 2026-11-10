<template>
  <div class="inline-member-picker">
    <v-select
      v-if="availableClasses.length"
      v-model="selectedClassId"
      :items="availableClasses"
      item-title="name"
      item-value="id"
      :label="$t('components.learningPlan.drawer.task.dialog.addAllClassMembers')"
      density="comfortable"
      hide-details
      clearable
      class="tw-mb-4"
    />
    <div v-if="filteredMembers.length" class="select-all-control mb-2">
      <alex-inputs-checkbox
        class="select-all-checkbox checkbox"
        :model-value="selectAllStatus === 1"
        :indeterminate="selectAllStatus === -1"
        @click.stop="toggleSelectAll"
      />
      <span class="text-body-3 text-gray-700 select-all-label">Selecionar todos</span>
    </div>
    <template v-if="filteredMembers.length">
      <Card
        v-for="member in filteredMembers"
        :key="member.raw.id"
        v-model="selectedMembers"
        :member="{
          name: member.raw.user.fullname,
          image: member.raw.user?.avatar?.formats?.small?.url || member.raw.user?.avatar?.url,
          responsable: member.role === learningPlanGroupMemberRolesSimple.IN_CHARGE,
          email: member.raw.email,
        }"
        :raw="member"
        no-delete
        @toggle-responsible-click="handleUpdateResponsible"
      />
    </template>
    <template v-else>
      <div class="d-flex align-center justify-center flex-column ga-4 text-center">
        <img
          class="no-members-svg"
          src="/svg/no-members.svg"
          :alt="$t('pages.projects.tasks.all_members_added')"
          role="no-members"
        />
        <p class="text-body-3 text-gray-400">
          {{ $t('pages.projects.tasks.all_members_added') }}
        </p>
      </div>
    </template>
    <alex-custom-button
      class="tw-mt-4"
      variant="secondary"
      prepend-icon="mdi-plus"
      :disabled="(!hasSelectedMembers && !selectedClassId) || (hasSelectedMembers && !hasResponsable)"
      @click="handleSubmit"
    >
      {{ $t('components.learningPlan.drawer.task.dialog.add') }}
    </alex-custom-button>
  </div>
</template>

<script setup lang="ts">
import type { ClassSimple } from '@/models/simple/classSimple.model';
import { useQueryClient } from '@tanstack/vue-query';
import { useGetProjectMembers } from '../../-composables/useMember';
import type { MemberItem } from '../../-composables/useMember';
import Card from './Card.vue';

interface AddMemberDialog {
  learningplanId?: number;
  groupId?: number;
  availableClasses?: ClassSimple[];
  defaultMembers?: LearningPlanGroupMemberSimple[];
  search?: string;
}
const props = withDefaults(defineProps<AddMemberDialog>(), {
  learningplanId: undefined,
  groupId: undefined,
  availableClasses: () => [],
  defaultMembers: () => [],
  search: '',
});
type Emits = {
  'add-click': [groupId: number, members: MemberItem[], classId: number | null];
};
const emit = defineEmits<Emits>();
// refs
const { setMessage } = useMessageStore();
const { t } = useI18n();
const learningplanValue = toRef(props, 'learningplanId');
const selectedMembers = ref<(MemberItem & { responsable: boolean })[]>([]);
const selectedClassId = ref<number | null>(null);

// computed
const enabledGetMembers = computed(() => !!learningplanValue.value);
const hasSelectedMembers = computed(() => !!selectedMembers.value.length);
const hasResponsable = computed(
  () =>
    !!selectedMembers.value.find((member) => member.role === 'in_charge') ||
    !!props.defaultMembers.find((member) => member.role === 'in_charge'),
);
const filteredAlreadyMembers = computed(
  () =>
    members.value?.filter((member) => {
      const alreadyMember = props.defaultMembers?.find(
        (alreadyMember) => alreadyMember.student_member.id === member.id,
      );
      return !alreadyMember;
    }),
);
const filteredMembers = computed(
  () =>
    filteredAlreadyMembers.value?.filter(
      (member) =>
        contains(member.raw.user.fullname, props.search) ||
        contains(member.raw.user.email, props.search) ||
        contains(member.raw.user.username, props.search),
    ),
);
const selectAllStatus = computed(() => {
  const selectedIds = new Set(selectedMembers.value.map((member) => member.id));
  const selectedCount = filteredMembers.value?.filter((member) => selectedIds.has(member.id)).length || 0;
  if (!selectedCount) return 0;
  return selectedCount === filteredMembers.value.length ? 1 : -1;
});
const toggleSelectAll = () => {
  const availableMembers = filteredMembers.value || [];
  const visibleIds = new Set(availableMembers.map((member) => member.id));
  const selectedIds = new Set(selectedMembers.value.map((member) => member.id));
  const allVisibleSelected =
    availableMembers.length > 0 && availableMembers.every((member) => selectedIds.has(member.id));

  if (allVisibleSelected) {
    selectedMembers.value = selectedMembers.value.filter((member) => !visibleIds.has(member.id));
    return;
  }
  selectedMembers.value = [
    ...selectedMembers.value,
    ...availableMembers.filter((member) => !selectedIds.has(member.id)),
  ];
};
//
const { data: members } = useGetProjectMembers(learningplanValue, enabledGetMembers);
const queryClient = useQueryClient();

// Methods
const handleSubmit = () => {
  if (!props.groupId) {
    setMessage(t('components.learningPlan.drawer.task.errors.missingDefaultGroup'), 'error', true);
    return;
  }
  emit('add-click', props.groupId, selectedMembers.value, selectedClassId.value);
  selectedMembers.value = [];
  selectedClassId.value = null;
  queryClient.setQueryData<MemberItem[]>(['project-members', learningplanValue], (oldData) => {
    if (!oldData) {
      return oldData;
    }
    return oldData.map((oldMember) => {
      return { ...oldMember, role: 'standard' };
    });
  });
};
const handleUpdateResponsible = (member: MemberItem | null, inCharge: boolean) => {
  selectedMembers.value = selectedMembers.value.map((oldMember) => {
    if (member?.id === oldMember.id && inCharge) {
      return { ...oldMember, role: 'in_charge' };
    }
    return { ...oldMember, role: 'standard' };
  });
  queryClient.setQueryData<MemberItem[]>(['project-members', learningplanValue], (oldData) => {
    if (!oldData) {
      return oldData;
    }
    return oldData.map((oldMember) => {
      if (member?.id === oldMember.id && inCharge) {
        return { ...oldMember, role: 'in_charge' };
      }
      return { ...oldMember, role: 'standard' };
    });
  });
};
watch(
  () => props.groupId,
  () => {
    selectedMembers.value = [];
    selectedClassId.value = null;
  },
);
</script>

<style lang="scss">
.select-all-control {
  display: flex;
  align-items: center;
  gap: 2px;
}

.select-all-checkbox.container {
  width: 30px !important;
  max-width: 30px !important;
  gap: 0 !important;
}

.select-all-label {
  margin-left: 0;
}
</style>
