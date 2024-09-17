<script setup lang="tsx">
import { DataSet } from 'vis-data/peer';
import {
  Timeline,
  type TimelineItem,
  type TimelineTimeAxisScaleType,
  type TimelineGroup as VisTimelineGroup,
} from 'vis-timeline/peer';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

interface TimelineGroup extends VisTimelineGroup {
  treeLevel?: number;
}

enum GroupType {
  Sprint = 'sprint',
}

enum ItemType {
  Epic = 'epic',
  Story = 'story',
  Task = 'standard',
}

enum ViewType {
  Day = 'day',
  Week = 'week',
  Month = 'month',
}

export interface GanttInstance extends ComponentPublicInstance {
  changeView(view: ViewType): void;
  changeToCurrentDate(): void;
}

export type Item = {
  id: string;
  title: string;
  organization: ItemType;
  start_at: Date | string;
  finish_at: Date | string;
  tasks?: Item[];
};

export type Sprint = {
  id: string;
  title: string;
  start_at: Date | string;
  end_at: Date | string;
};

type Props = {
  view?: ViewType;
  items?: Item[];
  sprints?: Sprint[];
  maxHeight?: number;
};

const props = withDefaults(defineProps<Props>(), {
  maxHeight: 450,
  view: ViewType.Month,
  items: () => [],
  sprints: () => [],
});

const timelineRef = ref<HTMLElement | null>(null);

let timeline: Timeline | null = null;

const toDateStr = (date?: Date | string | null) => (typeof date === 'string' ? date : date?.toISOString() || '');

const initGroups: TimelineGroup[] = [{ id: GroupType.Sprint, content: 'Sprints' }];

const initItems = computed<TimelineItem[]>(() => {
  return props.sprints.map((sprint) => ({
    id: `sprint-${sprint.id}`,
    type: 'range',
    group: GroupType.Sprint,
    className: 'sprint',
    content: sprint.title,
    title: sprint.title,
    start: toDateStr(sprint.start_at),
    end: toDateStr(sprint.end_at),
  }));
});

const dataSet = computed(() => {
  function parse(arr: Item[], level = 0): [TimelineGroup[], TimelineItem[]] {
    const groups: TimelineGroup[] = [];
    const items: TimelineItem[] = [];

    const getId = (item: Item) => `${item.organization}-${item.id}`;

    for (const item of arr) {
      const itemId = getId(item);

      groups.push({
        id: itemId,
        content: item.title,
        className: item.organization,
        nestedGroups: item.tasks?.length ? item.tasks.map(getId) : undefined,
        treeLevel: level,
      });

      items.push({
        id: itemId,
        type: 'range',
        group: itemId,
        className: item.organization,
        content: item.title,
        title: item.title,
        start: toDateStr(item.start_at),
        end: toDateStr(item.finish_at),
      });

      if (item.tasks?.length) {
        const [childGroups, childItems] = parse(item.tasks, level + 1);
        groups.push(...childGroups);
        items.push(...childItems);
      }
    }

    return [groups, items];
  }

  return parse(props.items);
});

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

const { minDate, maxDate } = getMinMaxDates([...initItems.value, ...dataSet.value[1]]);

const daysToMs = (days: number) => days * 24 * 60 * 60 * 1000;

const getViewSettings = (view: ViewType) => {
  switch (view) {
    case ViewType.Day:
      return {
        zoomMin: daysToMs(1), // 1 day
        zoomMax: daysToMs(7), // 1 week
        timeAxis: { scale: 'day' as TimelineTimeAxisScaleType, step: 1 },
        range: daysToMs(7), // 1 week
      };
    case ViewType.Week:
      return {
        zoomMin: daysToMs(7), // 1 week
        zoomMax: daysToMs(28), // 4 weeks
        timeAxis: { scale: 'week' as TimelineTimeAxisScaleType, step: 1 },
        range: daysToMs(30), // ~1 month
      };
    case ViewType.Month:
      return {
        zoomMin: daysToMs(30), // ~1 month
        zoomMax: daysToMs(120), // ~4 months
        timeAxis: { scale: 'month' as TimelineTimeAxisScaleType, step: 1 },
        range: daysToMs(90), // ~3 months (quarter)
      };
    default:
      throw new Error(`Invalid view type: ${view}`);
  }
};

const changeView = (view: ViewType) => {
  if (!timeline) return;

  const { range, ...options } = getViewSettings(view);
  timeline.setOptions(options);

  const currentRange = timeline.getWindow();
  const centerDate = new Date((currentRange.start.getTime() + currentRange.end.getTime()) / 2);
  const start = new Date(centerDate.getTime() - range / 2);
  const end = new Date(centerDate.getTime() + range / 2);
  timeline.setWindow(start, end, { animation: true });
};

const changeToCurrentDate = () => {
  if (!timeline) return;

  const currentDate = new Date();
  const { range } = getViewSettings(props.view);
  const start = new Date(currentDate.getTime() - range / 2);
  const end = new Date(currentDate.getTime() + range / 2);
  timeline.setWindow(start, end, { animation: true });
};

watch(() => props.view, changeView);

onMounted(() => {
  if (!timelineRef.value) return;

  timeline = new Timeline(
    timelineRef.value,
    new DataSet([...initItems.value, ...dataSet.value[1]] as never),
    new DataSet([...initGroups, ...dataSet.value[0]]),
    {
      end: maxDate,
      start: minDate,
      groupHeightMode: 'fixed',
      horizontalScroll: true,
      verticalScroll: true,
      maxHeight: props.maxHeight,
      minHeight: 300,
      moveable: true,
      orientation: 'top',
      stack: true,
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

  timeline.on('remove', (evt) => evt.preventDefault());
  timeline.on('move', (evt) => evt.oldGroup !== evt.newGroup && evt.preventDefault());
  timelineRef.value.addEventListener('wheel', (evt) => evt.preventDefault(), { passive: false }); // https://stackoverflow.com/a/70581384/2528550
  window.addEventListener('resize', resize);
  setTimeout(resize, 300);
});

onUnmounted(() => {
  window.removeEventListener('resize', resize);
  timelineRef.value?.removeEventListener('wheel', (evt) => evt.stopPropagation());
  timeline?.destroy();
});

defineExpose({ changeView, changeToCurrentDate });
</script>

<template>
  <div ref="timelineRef"></div>
</template>

<style lang="scss">
@import 'vis-timeline/styles/vis-timeline-graph2d.css';

.vis-label:first-child,
.vis-group:first-child {
  @apply tw-h-[40px] #{!important};
}

.vis-item {
  @apply tw-rounded-md tw-text-sm tw-border-[1px] tw-border-solid #{!important};
}

.vis-item.sprint {
  @apply tw-bg-amber-100 tw-border-amber-300 tw-font-semibold tw-top-[5px] #{!important};
}

.vis-item.epic {
  @apply tw-bg-purple-100/80 tw-border-purple-200 #{!important};
}

.vis-item.story {
  @apply tw-bg-blue-100/80 tw-border-blue-200 #{!important};
}

.vis-item.standard {
  @apply tw-bg-cyan-100 tw-border-cyan-200 #{!important};
}

.vis-panel.vis-center,
.vis-panel.vis-left,
.vis-panel.vis-right {
  @apply tw-overflow-hidden;
  -webkit-overflow-scrolling: touch;
}

.vis-group,
.vis-label,
.vis-panel,
.vis-timeline {
  @apply tw-border-slate-200 #{!important};
}

.vis-nesting-group::before {
  @apply tw-content-['\203A'] tw-w-auto #{!important};

  &.expanded {
    @apply tw-rotate-90 #{!important};
  }
}

.vis-group-level-0 {
  @apply tw-pl-4 #{!important};

  &.vis-nesting-group {
    @apply tw-pl-2 #{!important};
  }
}

.vis-group-level-1 {
  @apply tw-bg-slate-50 tw-pl-8 #{!important};

  &.vis-nesting-group {
    @apply tw-pl-6 #{!important};
  }
}

.vis-group-level-2 {
  @apply tw-bg-slate-200/70 tw-pl-12 #{!important};
}

.vis-inner {
  @apply tw-max-w-[250px] tw-pl-2 tw-text-sm #{!important};
}

.vis-item-overflow {
  @apply tw-flex;
}

.vis-item-content-sprint,
.vis-item-content {
  @apply tw-truncate tw-whitespace-nowrap tw-overflow-hidden tw-w-full;
}
</style>
