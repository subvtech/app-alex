<template>
  <div
    class="tw-relative tw-grid tw-grid-cols-[auto_1fr] tw-w-full tw-overflow-x-scroll"
  >
    <div
      class="flex tw-flex-col items-center tw-min-w-48 tw-sticky tw-top-0 tw-left-0 tw-z-10 bg-white tw-border-r-[1px] tw-border-b-[1px] tw-border-gray-100"
    >
      <div
        class="tw-h-[91px] tw-p-2 tw-border-b-[1px] tw-border-gray-10 tw-grid tw-place-items-center"
      >
        Tópicos
      </div>
    </div>
    <g-gantt-chart
      :chart-start="startDate"
      :chart-end="endDate"
      grid
      bar-start="barBeginDate"
      bar-end="barEndDate"
      font="sen"
      :row-height="32"
      :precision="precision"
      :width="width"
      :color-scheme="{
        background: '#fff',
        hoverHighlight: '#F1F5F9', // row hover
        primary: '#fff', // label-column bg and odd month columns
        secondary: '#fff', // even month columns
        ternary: '#fff', // first row and
        quartenary: '#fff', /// odd day columns and odd day rows
        markerCurrentTime: '#00B7CC', // ?
        text: '#30363B',
        toast: '#30363B',
      }"
      class="tw-max-h-[600px] tw-bg-white"
    >
      <template #bar-tooltip="{ bar }">
        {{ bar?.labelColumn }}
      </template>
      <template #upper-timeunit="{ value }">
        <div v-if="value">
          {{ formatToMonthYear(new Date(value)) }}
        </div></template
      >
      <template #timeunit="{ value }"
        ><div v-if="value" class="ellipsis lines-1 tw-w-full tw-text-center">
          {{ formatToDay(new Date(value)) }}
        </div></template
      >
      <template #label-column-row="{ label }">
        <div>{{ label }}</div>
      </template>
      <template v-for="row in rows" :key="row.ganttBarConfig.id">
        <g-gantt-row
          :label="row.labelColumn"
          :bars="[
            {
              barBeginDate: row.barBeginDate,
              barEndDate: row.barEndDate,
              labelColumn: row.labelColumn,
              ganttBarConfig: row.ganttBarConfig,
            },
          ]"
        >
          <!-- <template #bar-label="{ bar }">{{ bar.labelColumn }}</template> -->
        </g-gantt-row>
      </template>
    </g-gantt-chart>
  </div>
</template>

<script setup lang="ts">
import { GanttBarObject } from '@infectoone/vue-ganttastic';
// Array<GanttBarObject>
// eslint-disable-next-line import/no-duplicates
import { format } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import { enUS, ptBR } from 'date-fns/locale';
type Row = GanttBarObject & {
  barBeginDate: Date | string;
  barEndDate: Date | string;
  labelColumn: string;
};
export type PrecisionGantt =
  | 'hour'
  | 'day'
  | 'date'
  | 'week'
  | 'month'
  | undefined;
export type TaskTest = {
  id: number;
  name: string;
  startDate: Date | string;
  finalDate: Date | string;
};
export type History = {
  id: number;
  title: string;
  status: string;
  description: Obj;
  finish_at: Date | string;
  organization: string;
  position: number;
  start_at: Date | string;
  type: string;
  updateAt: Date | string;
};
export type Epic = {
  id: number;
  title: string;
  tasks?: History[];
  status_type: string;
};

export type Sprint = {
  id: number;
  title: string;
  start_at: Date | string;
  end_at: Date | string;
  epics?: Epic[];
  kanban: {
    kanban_columns: {
      title: string;
      id: string;
      position: string;
      status_type: string;
      kanban_column_tasks: {
        tasks: History[];
      }[];
    }[];
  };
};

interface GanttChartProps {
  precision: PrecisionGantt;
  startDate: Date | string;
  endDate: Date | string;
  sprints: Sprint[];
}
const props = defineProps<GanttChartProps>();

const { locale } = useI18n();

const rows = computed(() => {
  const rows: Row[] = [];
  props.sprints.forEach((sprint) => {
    rows.push({
      barBeginDate: sprint.start_at,
      barEndDate: sprint.end_at,
      labelColumn: sprint.title,
      ganttBarConfig: {
        id: `sprint-${sprint.id}`,
        label: sprint.title,
      },
    });
    sprint.epics?.forEach((epics) => {
      rows.push({
        barBeginDate: sprint.start_at,
        barEndDate: sprint.end_at,
        labelColumn: epics.title,
        ganttBarConfig: {
          id: `sprint-${sprint.id}-history-${epics.id}`,
          label: epics.title,
        },
      });
      epics.tasks?.forEach((story) => {
        rows.push({
          barBeginDate: story.start_at,
          barEndDate: story.finish_at,
          labelColumn: story.title,
          ganttBarConfig: {
            id: `sprint-${sprint.id}-history-${story.id}-epic-${story.id}`,
            label: story.title,
          },
        });
        // epic.tasks.forEach((task) => {
        //   rows.push({
        //     barBeginDate: task.startDate,
        //     barEndDate: task.finalDate,
        //     labelColumn: task.name,
        //     ganttBarConfig: {
        //       id: `sprint-${sprint.id}-history-${history.id}-epic-${epic.id}-task-${task.id}`,
        //       label: task.name,
        //     },
        //   });
        // });
      });
    });
  });
  return rows;
});
// const createRow = (
//   beginDate: Date | string,
//   endDate: Date | string,
//   label: string,
//   id: string,
// ): Row => ({
//   barBeginDate: beginDate,
//   barEndDate: endDate,
//   labelColumn: label,
//   ganttBarConfig: {
//     id,
//     immobile: true,
//   },
// });

// const processHierarchy = (
//   items: any[],
//   baseId: string,
//   startDate: Date | string,
//   endDate: Date | string,
//   rows: Row[],
// ) => {
//   items.forEach((item) => {
//     const itemId = `${baseId}-${item.id}`;
//     rows.push(createRow(startDate, endDate, item.name, itemId));

//     if (item.historys) {
//       processHierarchy(item.historys, itemId, startDate, endDate, rows);
//     }

//     if (item.epics) {
//       processHierarchy(item.epics, itemId, startDate, endDate, rows);
//     }

//     if (item.tasks) {
//       item.tasks.forEach((task) => {
//         rows.push(
//           createRow(
//             task.startDate,
//             task.finalDate,
//             task.name,
//             `${itemId}-task-${task.id}`,
//           ),
//         );
//       });
//     }
//   });
// };

// const rows = computed(() => {
//   const result: Row[] = [];

//   props.sprints.forEach((sprint) => {
//     result.push(
//       createRow(
//         sprint.start_at,
//         sprint.end_at,
//         sprint.title,
//         `sprint-${sprint.id}`,
//       ),
//     );
//     processHierarchy(
//       sprint.historys || [],
//       `sprint-${sprint.id}`,
//       sprint.startDate,
//       sprint.finalDate,
//       result,
//     );
//   });

//   return result;
// });
const width = computed(() => {
  if (props.precision === 'day') {
    return '4000px';
  }
  return '1500px';
});
function formatToMonthYear(date: Date) {
  return format(date, 'LLLL', {
    locale: locale.value === 'pt' ? ptBR : enUS,
  });
}
function formatToDay(date: Date) {
  // dd (EEEEEE) => 03 (seg)
  return format(date, 'dd', {
    locale: locale.value === 'pt' ? ptBR : enUS,
  });
}
</script>

<style scoped lang="scss">
.max-w-200 {
  max-width: 200px;
}
:deep(.g-gantt-bar) {
  border-radius: 8px !important;
  color: rgb(var(--v-theme-white));
  background: rgb(var(--v-theme-secondary-0));
}
:deep(.g-gantt-row) {
  &:hover .g-gantt-bar {
    filter: brightness(0.9) !important;
  }
}

:deep(.g-gantt-row > .g-gantt-row-bars-container) {
  border-top: 0 !important;
  border-bottom: 1px solid rgb(var(--v-theme-gray-100));
}
:deep(.g-label-column) {
  border-right: 1px solid rgb(var(--v-theme-gray-100));
}
:deep(.g-grid-container > .g-grid-line:first-of-type) {
  border-left: 0 !important;
}
:deep(.g-label-column-row) {
  border-top: 1px solid rgb(var(--v-theme-gray-100));
}
:deep(.g-label-column-row:last-child),
:deep(.g-gantt-row:last-child),
:deep(.g-timeunits-container:first-child) {
  border-bottom: 1px solid rgb(var(--v-theme-gray-100));
}

:deep(.g-timeaxis),
:deep(.g-label-column-header) {
  height: 90px;
  min-height: 90px;
}
:deep(.g-gantt-row:nth-child(even)) {
  background-color: rgba(var(--v-theme-gray-blue), 0.8);
}
:global(.g-gantt-tooltip) {
  padding: 4px 8px;
  background: rgb(var(--v-theme-gray-900)) !important;
}
:global(.g-gantt-tooltip-color-dot) {
  background: rgb(var(--v-theme-secondary-0)) !important;
}
:global(.g-gantt-tooltip:before) {
  border-bottom-color: rgb(var(--v-theme-gray-900)) !important;
}
:deep(.g-upper-timeunit:not(:last-child)) {
  border-right: 1px solid rgb(var(--v-theme-gray-100));
}
:deep(.g-grid-current-time-marker) {
  border: 1px solid rgb(var(--v-theme-secondary-0), 1) !important;
}

:deep(.g-gantt-chart) {
  min-width: max-content;
  // overflow-x: scroll !important;
}
:deep(.labels-in-column) {
  display: grid;
  grid-template-columns: 1fr auto;
  overflow-x: scroll !important;
}
:deep(.g-label-column) {
  z-index: 10;
  position: sticky;
  left: 0;
  top: 0;
}
:deep(.g-gantt-rows-container) {
  position: relative;
  max-height: 500px;
  overflow-y: scroll;
  direction: rtl;
}
// :deep(.g-gantt-row) {
//   width: auto !important;
// }
</style>
