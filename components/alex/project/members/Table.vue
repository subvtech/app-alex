<template>
  <div class="d-flex flex-column w-100">
    <alex-learningplan-class-section-card-header
      v-model:search-model="searchModel"
      action-icon="mdi-account"
      :action-text="$t('components.learningPlan.projects.invite.label')"
      :search-placeholder="
        $t('components.learningPlan.projects.searchPlaceholder')
      "
      :hide-action="!canEdit"
      use-mobile-breakpoint
      use-custom-dialog
      @click:filter="emit('toggle:drawer')"
    >
      <template #custom-dialog
        ><alex-project-members-invite-dialog
          v-model:dialog-model="dialogModelValue"
          :dialog-title="$t('components.learningPlan.projects.invite.title')"
          :dialog-action-text="
            $t('components.learningPlan.projects.invite.label')
          "
          :learning-plan-id="learningPlanId"
          :invite-link-hash="inviteLinkHash"
          :invitation-duration="invitationDuration"
          :invite-link-expires-at="inviteLinkExpiresAt"
          :disable-invite="disableInvite"
          :dialog-action-disabled="false"
          :dialog-action-loading="false"
          @update:members="updateMembers"
      /></template>
    </alex-learningplan-class-section-card-header>

    <div v-if="activeFilters.length > 0" class="d-flex gap-2">
      <alex-custom-chip
        v-for="(filter, index) in activeFilters"
        :key="index"
        :text="filter"
        status="secondary"
        variant="outlined"
        clickable
        closable
        @click:close="emit('remove:filter', filter)"
      />
    </div>
    <v-data-iterator
      v-model:page="page"
      :items="dataRef"
      :items-per-page="12"
      :filter-keys="['name', 'email']"
      class="position-relative w-100"
      style="flex: 1; max-height: min-content"
    >
      <template #default="{ items: iterateItems }">
        <v-data-table
          variant="outline"
          :headers="headers"
          :items="setTableData(iterateItems)"
          item-value="name"
          no-data-text="No data"
          fixed-header
          sort-asc-icon="mdi-swap-vertical"
          sort-desc-icon="mdi-swap-vertical"
          :header-props="{
            class: 'text-body-2 font-weight-bold text-gray-600 w-100',
          }"
          :height="300"
          :width="'100%'"
        >
          <template #item="{ item }">
            <tr class="text-body-3 text-gray w-100">
              <td class="text-center">
                <alex-project-members-user-card
                  :name="item.user.fullname"
                  :email="item.email"
                  :avatar="item.user.avatar"
                />
              </td>
              <td>
                <alex-custom-chip
                  :text="capitalize(item.role)"
                  :status="
                    item.role === MemberRoles.STUDENT ? 'secondary' : 'primary'
                  "
                />
              </td>
              <td>
                <alex-custom-chip
                  :text="capitalize(item.status)"
                  :status="
                    item.status === MemberStatus.JOINED ? 'green' : 'secondary'
                  "
                />
              </td>

              <td>
                <alex-custom-dropdown
                  :items="dropdownItems(item.user.username, item.id, item.role)"
                >
                  <template #activator="{ props: activeProps }">
                    <alex-custom-button
                      v-bind="activeProps"
                      icon="mdi-dots-vertical"
                      variant="text"
                    />
                  </template>
                </alex-custom-dropdown>
              </td>
            </tr>
          </template>
          <template #bottom="{ pageCount, groupedItems }">
            <div
              class="d-flex w-100 justify-space-between align-center pa-6 pb-0 flex-column flex-sm-row ga-3 footer mt-6"
            >
              <p class="show-cardlist text-body-3 text-gray-600">
                {{ showingData(groupedItems) }}
              </p>
              <alex-custom-pagination
                v-if="pageCount > 1"
                v-model="page"
                :length="pageCount"
                :total-visible="5"
                class="extra-mb"
              />
            </div>
          </template>
        </v-data-table>
      </template>
    </v-data-iterator>
  </div>
</template>

<script setup lang="ts">
import { AlexDropdownItem } from '../../custom/Dropdown.vue';
import { MemberRoles } from '#imports';

export interface TableCardProps {
  showPositions?: boolean;
  data: LearningPlanMemberSimple[];
  learningPlanId: string;
  activeInviteId?: number | null;
  invitationDuration: number;
  inviteLinkHash?: string | null;
  inviteLinkExpiresAt?: Date | null;
  search: string;
  canEdit?: boolean;
  disableInvite?: boolean;
  activeFilters?: string[];
}
const { delete: _delete } = useStrapi();
const { find } = useStrapiUtils();
const props = withDefaults(defineProps<TableCardProps>(), {
  activeFilters: () => [],
  activeInviteId: null,
  inviteLinkHash: null,
  inviteLinkExpiresAt: null,
});

const { data } = toRefs(props);
const dataRef = ref(props.data);

const emit = defineEmits(['update:search', 'toggle:drawer', 'remove:filter']);
const { t } = useI18n();
const { setMessage } = useMessageStore();

const page = ref(1);

const headers = computed(() => {
  const indexCol = props.showPositions
    ? [{ title: 'Index', key: 'index' }]
    : [];

  return [
    ...indexCol,
    { title: t('components.learningPlan.projects.user'), key: 'user.fullname' },
    { title: t('components.learningPlan.projects.role'), key: 'role' },
    { title: t('components.learningPlan.projects.status'), key: 'status' },
    { title: '' },
  ];
});

const dropdownItems = (username, id, role: MemberRoles) => {
  const temp: AlexDropdownItem[] = [
    {
      text: t('components.learningPlan.projects.profile'),
      icon: 'mdi-account-outline',
      onClick: () => navigateTo(`/users/${username}`),
    },
  ];
  if (props.canEdit && role !== MemberRoles.FACILITATOR)
    temp.push({
      text: t('components.learningPlan.projects.delete'),
      icon: 'mdi-trash-can-outline',
      warning: true,
      onClick: async () => {
        await _delete('learning-plan-members', id);
        dataRef.value = dataRef.value.filter((item) => item.id !== id);
        setMessage(
          t('components.learningPlan.projects.invite.deleted'),
          'green',
          true,
        );
      },
    });

  return temp;
};

const dialogModelValue = ref(false);

const searchModel = computed({
  get() {
    return props.search;
  },
  set(value) {
    emit('update:search', value);
  },
});

const updateMembers = async () => {
  const newMembers = (
    await find<LearningPlanMemberSimple>('learning-plan-members', {
      filters: {
        learningplan: props.learningPlanId,
      },
      populate: ['user'],
    })
  ).data;

  dataRef.value = newMembers;

  // dataRef.value = data.value.concat(newMembers.data);
};

const setTableData = (items): readonly LearningPlanMemberSimple[] =>
  items.map((item) => item.raw);

const showingData = (groupedItems) => {
  const itemsPerPage = searchModel.value === '' ? 12 : groupedItems.length;

  const from = (page.value - 1) * itemsPerPage + 1;
  const to =
    page.value * itemsPerPage > props.data.length
      ? props.data.length
      : page.value * itemsPerPage;
  const total = props.data.length;
  const message = t('components.learningPlan.projects.showingData', {
    from,
    to,
    total,
    entity: t('components.learningPlan.projects.members'),
  });
  if (to === 0) {
    return t('pages.classes.noData');
  }
  return message;
};

watch(data, () => {
  dataRef.value = data.value;
});
</script>
