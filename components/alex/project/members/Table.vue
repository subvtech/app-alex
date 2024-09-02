<template>
  <div class="d-flex flex-column w-100">
    <alex-learningplan-class-section-card-header
      v-model:dialog-model="dialogModelValue"
      v-model:search-model="searchModel"
      action-icon="mdi-account"
      :action-text="$t('components.learningPlan.projects.invite.label')"
      :dialog-title="$t('components.learningPlan.projects.invite.title')"
      :dialog-action-text="$t('components.learningPlan.projects.invite.label')"
      :dialog-action-disabled="false"
      :dialog-action-loading="false"
      :search-placeholder="
        $t('components.learningPlan.projects.searchPlaceholder')
      "
      use-mobile-breakpoint
      @click:filter="emit('toggle:drawer')"
    />

    <v-data-iterator
      v-model:search="searchModel"
      v-model:page="page"
      :items="data"
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
                  :text="item.role"
                  :status="
                    item.role === MemberRoles.STUDENT ? 'secondary' : 'primary'
                  "
                />
              </td>
              <td>
                <alex-custom-chip :text="item.status" :status="'blue'" />
              </td>

              <div
                class="d-flex flex-grow-1 h-100 w-100 justify-center align-center mt-2"
              >
                <alex-custom-dropdown :items="items">
                  <template #activator="{ props: activeProps }">
                    <alex-custom-button
                      v-bind="activeProps"
                      icon="mdi-dots-vertical"
                      variant="text"
                    />
                  </template>
                </alex-custom-dropdown>
              </div>
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
export interface TableCardProps {
  showPositions?: boolean;
  data: LearningPlanMemberSimple[];
  search: string;
  canEdit?: boolean;
}

const props = withDefaults(defineProps<TableCardProps>(), {});
const emit = defineEmits(['update:search', 'toggle:drawer']);
const { t } = useI18n();
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

const items = computed(() => {
  const temp = [
    {
      text: t('components.learningPlan.projects.profile'),
      icon: 'mdi-account-outline',
      onClick: () => {
        console.log('see profile');
      },
    },
  ];
  if (props.canEdit)
    temp.push({
      text: t('components.learningPlan.projects.delete'),
      icon: 'mdi-trash-can-outline',
      onClick: () => {
        console.log('delete ');
      },
    });

  return temp;
});

const dialogModelValue = ref(false);

const searchModel = computed({
  get() {
    return props.search;
  },
  set(value) {
    emit('update:search', value);
  },
});
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
</script>
