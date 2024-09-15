<script setup lang="tsx">
import { DataSet } from 'vis-data/peer';
import { Timeline, type TimelineTimeAxisScaleType, type TimelineGroup, type TimelineItem } from 'vis-timeline/peer';
import { onMounted, onUnmounted, ref } from 'vue';

enum GroupType {
  Sprint = 'sprint',
}

enum ItemType {
  Epic = 'epic',
  Story = 'story',
  Task = 'task',
}

enum ViewType {
  Day = 'day',
  Week = 'week',
  Month = 'month',
}

export type Item = {
  id: string;
  type: ItemType;
  label: string;
  startDate: Date | string;
  endDate: Date | string;
  children?: Item[];
};

export type Sprint = {
  id: string;
  label: string;
  startDate: Date | string;
  endDate: Date | string;
};

const props = withDefaults(defineProps<{ items: Item[]; sprints: Sprint[] }>(), {
  items: () => [],
  sprints: () => [],
});

const timelineRef = ref<HTMLElement | null>(null);
const currentView = ref(ViewType.Month);

let timeline: Timeline | null = null;

const isEpic = (item: Item) => item.type === ItemType.Epic;
const isStory = (item: Item) => item.type === ItemType.Story;
const toDateStr = (date: Date | string) => (typeof date === 'string' ? date : date.toISOString());

const initGroups: TimelineGroup[] = [{ id: GroupType.Sprint, content: 'Sprints' }];

const initItems = computed<TimelineItem[]>(() => {
  return props.sprints.map((sprint) => ({
    id: sprint.id,
    type: 'range',
    group: GroupType.Sprint,
    className: 'sprint',
    content: sprint.label,
    title: sprint.label,
    start: toDateStr(sprint.startDate),
    end: toDateStr(sprint.endDate),
  }));
});

const [groups, items] = (function parseItems(arr: Item[], parentId?: string) {
  const groups: TimelineGroup[] = [];
  const items: TimelineItem[] = [];

  for (const item of arr) {
    const isGroup = isEpic(item) || isStory(item);

    if (isGroup) {
      groups.push({
        id: item.id,
        content: item.label,
        nestedGroups: isEpic(item) ? item.children?.filter(isStory).map((v) => v.id) : undefined,
      });
    }

    items.push({
      id: item.id,
      type: isGroup ? 'background' : undefined,
      group: isGroup ? item.id : parentId!,
      className: item.type,
      content: item.label,
      title: item.label,
      start: toDateStr(item.startDate),
      end: toDateStr(item.endDate),
    });

    if (item.children?.length) {
      const [childGroups, childItems] = parseItems(item.children, item.id);
      groups.push(...childGroups);
      items.push(...childItems);
    }
  }

  return [groups, items];
})(props.items);

const resize = () => {
  if (timeline && timelineRef.value) {
    timeline.setOptions({
      height: timelineRef.value.clientHeight,
      width: timelineRef.value.clientWidth,
    });
  }
};

const getMinMaxDates = (items: TimelineItem[]) => {
  const dates = items.flatMap((item) => {
    const start = item.start ? new Date(item.start).getTime() : null;
    const end = item.end ? new Date(item.end).getTime() : null;
    return [start, end].filter((date) => date !== null) as number[];
  });

  return {
    minDate: new Date(Math.min(...dates)).toISOString(),
    maxDate: new Date(Math.max(...dates)).toISOString(),
  };
};

const { minDate, maxDate } = getMinMaxDates([...initItems.value, ...items]);

const changeView = (view: ViewType) => {
  if (!timeline) return;

  currentView.value = view;

  let zoomMin: number;
  let zoomMax: number;
  let timeAxis: { scale: TimelineTimeAxisScaleType; step: number };

  switch (view) {
    case 'day':
      zoomMin = 24 * 60 * 60 * 1000; // 1 day
      zoomMax = 7 * 24 * 60 * 60 * 1000; // 7 days
      timeAxis = { scale: 'day', step: 1 };
      break;
    case 'week':
      zoomMin = 7 * 24 * 60 * 60 * 1000; // 1 week
      zoomMax = 4 * 7 * 24 * 60 * 60 * 1000; // 4 weeks
      timeAxis = { scale: 'week', step: 1 };
      break;
    case 'month':
      zoomMin = 30 * 24 * 60 * 60 * 1000; // ~1 month
      zoomMax = 4 * 30 * 24 * 60 * 60 * 1000; // ~4 months
      timeAxis = { scale: 'month', step: 1 };
      break;
    default:
      throw new Error(`Invalid view type: ${view}`);
  }

  const currentRange = timeline.getWindow();
  const centerDate = new Date((currentRange.start.getTime() + currentRange.end.getTime()) / 2);

  timeline.setOptions({ zoomMin, zoomMax, timeAxis });

  let range: number;

  switch (view) {
    case 'day':
      range = 7 * 24 * 60 * 60 * 1000; // 1 week
      break;
    case 'week':
      range = 30 * 24 * 60 * 60 * 1000; // ~1 month
      break;
    case 'month':
      range = 3 * 30 * 24 * 60 * 60 * 1000; // ~3 months (quarter)
      break;
    default:
      throw new Error(`Invalid view type: ${view}`);
  }

  const start = new Date(centerDate.getTime() - range / 2);
  const end = new Date(centerDate.getTime() + range / 2);

  timeline.setWindow(start, end, { animation: true });
};

const initialize = () => {
  if (!timelineRef.value) return;

  timeline = new Timeline(
    timelineRef.value,
    new DataSet([...initItems.value, ...items] as never),
    new DataSet([...initGroups, ...groups]),
    {
      autoResize: false,
      end: maxDate,
      start: minDate,
      groupHeightMode: 'fixed',
      horizontalScroll: true,
      maxHeight: 500,
      minHeight: 300,
      moveable: true,
      orientation: 'top',
      stack: true,
      verticalScroll: true,
      zoomable: true,
      zoomKey: 'ctrlKey',
      editable: {
        add: false,
        overrideItems: false,
        remove: false,
        updateGroup: false,
        updateTime: false,
      },
      zoomMin: 30 * 24 * 60 * 60 * 1000, // ~1 month (default view)
      zoomMax: 4 * 30 * 24 * 60 * 60 * 1000, // ~4 months (default view)
      timeAxis: {
        scale: 'month',
        step: 1,
      },
      format: {
        minorLabels: {
          day: 'D',
          week: 'W',
          month: 'MMM',
        },
        majorLabels: {
          day: 'MMMM YYYY',
          week: 'MMMM YYYY',
          month: 'YYYY',
        },
      },
    },
  );

  changeView(ViewType.Month);

  timeline.on('remove', (event) => {
    event.preventDefault();
  });

  timeline.on('move', (event) => {
    if (event.oldGroup !== event.newGroup) {
      event.preventDefault();
    }
  });

  window.addEventListener('resize', resize);
  setTimeout(resize, 300);
};

onMounted(() => {
  initialize();
});

onUnmounted(() => {
  window.removeEventListener('resize', resize);
  timeline?.destroy();
});
</script>

<template>
  <div>
    <div class="tw-mb-4 tw-flex tw-gap-2">
      <button
        v-for="view in ['day', 'week', 'month']"
        :key="view"
        :class="[
          'tw-px-4 tw-py-2 tw-rounded',
          currentView === view ? 'tw-bg-blue-500 tw-text-white' : 'tw-bg-gray-200',
        ]"
        @click="changeView(view as ViewType)"
      >
        {{ view.charAt(0).toUpperCase() + view.slice(1) }}
      </button>
    </div>
    <div ref="timelineRef"></div>
  </div>
</template>

<style lang="scss">
@import 'vis-timeline/styles/vis-timeline-graph2d.css';

.vis-label:first-child,
.vis-group:first-child {
  @apply tw-h-[40px] #{!important};
}

.vis-item {
  @apply tw-border-slate-300;
  border-radius: 5px;
  font-size: 12px;
}

.vis-item.sprint {
  @apply tw-bg-yellow-300 tw-font-semibold tw-top-[5px] #{!important};
}

.vis-panel.vis-center,
.vis-panel.vis-left,
.vis-panel.vis-right {
  overflow: hidden;
}

.vis-group,
.vis-label {
  @apply tw-border-slate-300 #{!important};
}

.vis-group-level-0,
.vis-nested-group {
  @apply tw-border-none;
}

.vis-nested-group,
.vis-inner {
  @apply tw-pl-4 #{!important};
}

.vis-inner {
  @apply tw-max-w-[250px] tw-text-sm #{!important};
}

.vis-item-overflow {
  @apply tw-flex;
}

.vis-item-content-sprint,
.vis-item-content {
  @apply tw-truncate tw-whitespace-nowrap tw-overflow-hidden tw-w-full;
}
</style>
