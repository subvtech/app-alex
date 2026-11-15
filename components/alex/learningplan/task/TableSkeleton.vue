<template>
  <div v-for="i in 3" :key="i" class="w-100 rounded accordion pa-4">
    <alex-custom-skeleton color="gray-300" class="width-39 height-7 ml-2 mb-4" />
    <v-data-table
      class="w-100 height-56 rounded-lg border-sm mb-4 text-gray-300 text-body-3 table-skeleton"
      :headers="header"
      :style="{ '--fixed-columns-width': compactDelivery ? '520px' : '640px' }"
    >
      <template #body>
        <tr v-for="table in 3" :key="table">
          <td class="width-170">
            <alex-custom-skeleton color="gray-300" class="w-100 height-5" />
          </td>
          <td>
            <alex-custom-skeleton color="gray-300" class="w-100 height-8 rounded-lg" />
          </td>
          <td>
            <alex-custom-skeleton color="gray-300" class="w-100 height-5" />
          </td>
          <td>
            <div class="d-flex align-center ml-2">
              <alex-custom-skeleton
                v-for="circle in 4"
                :key="circle"
                color="gray-300"
                class="width-7 height-7 rounded-circle alex-avatar-group-border alex-avatar-group-margin"
              />
            </div>
          </td>
          <td v-if="!compactDelivery">
            <alex-custom-skeleton color="gray-300" class="w-100 height-7" />
          </td>
          <td class="max-w-40 width-30">
            <div class="d-flex ga-5">
              <alex-custom-skeleton color="gray-300" class="width-9 height-7 ml-2" />
              <alex-custom-skeleton color="gray-300" class="width-5 height-7" />
            </div>
          </td>
        </tr>
      </template>
      <template #bottom></template>
    </v-data-table>
    <alex-custom-skeleton v-if="i === 1" color="gray-200" class="w-100 height-11 rounded-lg" />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ compactDelivery?: boolean }>(), {
  compactDelivery: false,
});

const { t } = useI18n();

const header = [
  {
    title: t('pages.task.table.header.title'),
    key: 'name',
    sortable: false,
    minWidth: 220,
  },
  {
    title: t('pages.task.table.header.deadline_at'),
    key: 'deadline',
    sortable: false,
    width: 140,
    minWidth: '150',
  },
  {
    title: t('pages.task.table.header.type'),
    key: 'type',
    sortable: false,
    width: 140,
    minWidth: '100',
  },
  {
    title: t('pages.task.table.header.students'),
    key: 'students',
    sortable: false,
    width: 140,
    minWidth: '150',
  },
  {
    title: t('pages.task.table.header.delivered'),
    key: 'delivered',
    width: 120,
    minWidth: '120',
  },
  { title: '', key: 'actions', sortable: false, width: 100 },
].filter(({ key }) => !props.compactDelivery || key !== 'delivered');
</script>

<style scoped>
:global(.table-skeleton table) {
  table-layout: fixed;
  width: 100%;
  min-width: calc(var(--fixed-columns-width) + 220px);
}

:global(.table-skeleton th:first-child) {
  width: calc(100% - var(--fixed-columns-width)) !important;
  min-width: 220px !important;
}

.accordion {
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
}

.alex-avatar-group-border {
  border: 2px solid rgb(var(--v-theme-white)) !important;
}

.alex-avatar-group-margin {
  margin-inline-start: -0.75rem;
}
</style>
