<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

type Item = {
  id: string;
  type: 'epic' | 'story' | 'task';
  label: string;
  startDate: Date | string;
  endDate: Date | string;
  children?: Item[];
};

type Sprint = {
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

let timeline: vis.Timeline | null = null;

const isEpic = (item: Item) => item.type === 'epic';
const isStory = (item: Item) => item.type === 'story';
const toString = (date: Date | string) => (typeof date === 'string' ? date : date.toISOString());

const initGroups: vis.TimelineGroup[] = [{ id: 'sprints', content: 'Sprints' }];

const initItems = computed<vis.TimelineItem[]>(() => {
  return props.sprints.map((sprint) => ({
    id: sprint.id,
    type: 'range',
    group: 'sprints',
    className: 'sprint',
    content: sprint.label,
    start: toString(sprint.startDate),
    end: toString(sprint.endDate),
  }));
});

const [groups, items] = (function parseItems(
  arr: Item[],
  parentId?: string,
): [vis.TimelineGroup[], vis.TimelineItem[]] {
  const groups: vis.TimelineGroup[] = [];
  const items: vis.TimelineItem[] = [];

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
      start: toString(item.startDate),
      end: toString(item.endDate),
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

const getMinMaxDates = (items: vis.TimelineItem[]) => {
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

const initialize = () => {
  if (!timelineRef.value) return;

  timeline = new vis.Timeline(
    timelineRef.value,
    new vis.DataSet([...initItems.value, ...items]),
    new vis.DataSet([...initGroups, ...groups]),
    {
      stack: true,
      start: minDate,
      end: maxDate,
      groupHeightMode: 'fixed',
      editable: {
        add: false, // don't allow adding new items
        updateTime: false, // don't allow changing item duration
        updateGroup: false, // don't allow changing item's group
        remove: false, // don't allow removing items
        overrideItems: false,
      },
      margin: {
        item: 10,
        axis: 5,
      },
      orientation: 'top',
      format: {
        minorLabels: {
          day: 'D',
          month: 'MMM',
        },
        majorLabels: {
          day: 'MMMM YYYY',
          month: 'YYYY',
        },
      },
      height: '100%',
      autoResize: false,
      verticalScroll: true,
      horizontalScroll: true,
      zoomKey: 'ctrlKey',
      moveable: true,
      zoomable: true,
      maxHeight: 600,
      minHeight: 300,
    },
  );

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
  <div ref="timelineRef"></div>
</template>

<style>
.vis-item {
  border-radius: 5px;
  font-size: 12px;
}

.vis-item.epic {
  background-color: #f0f0f0;
}

.vis-item.story {
  background-color: #e6f3ff;
}

.vis-item.task {
  background-color: #ffe6e6;
}

.vis-item.sprint {
  background-color: #ffeb3b;
  color: #000;
  font-weight: bold;
  text-align: center;
}

.vis-timeline {
  border: 1px solid #bfbfbf;
  font-family: Arial, sans-serif;
  overflow: hidden; /* Prevent scrollbars */
}

.vis-panel.vis-center,
.vis-panel.vis-left,
.vis-panel.vis-right {
  overflow: hidden; /* Prevent scrollbars in panels */
}

.vis-labelset .vis-label {
  white-space: nowrap; /* Prevent line breaks in labels */
}
</style>
