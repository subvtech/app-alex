<script setup lang="ts">
import type { BulletLegendItemInterface } from '@unovis/ts';
import { VisTooltip } from '@unovis/vue';
import { type Component, createApp } from 'vue';
import { ChartTooltip } from '.';

const props = withDefaults(
  defineProps<{
    selector: string;
    index: string;
    items?: BulletLegendItemInterface[];
    valueFormatter?: (tick: number, i?: number, ticks?: number[]) => string;
    customTooltip?: Component;
  }>(),
  {
    valueFormatter: (tick: number) => `${tick}`,
  },
);

// Use weakmap to store reference to each datapoint for Tooltip
const wm = new WeakMap();
function template(d: any, i: number, elements: (HTMLElement | SVGElement)[]) {
  const data = d?.data && typeof d.data === 'object' ? d.data : d;
  const label = data?.[props.index];
  const valueEntry = Object.entries(data ?? {}).find(
    ([key, value]) => key !== props.index && (typeof value === 'number' || typeof value === 'string'),
  );
  const value = valueEntry?.[1] ?? '';

  if (wm.has(data)) {
    return wm.get(data);
  }

  const style = elements[i] ? getComputedStyle(elements[i]) : undefined;
  const legendReference = props.items?.find((item) => item.name === label);
  const componentDiv = document.createElement('div');
  const TooltipComponent = props.customTooltip ?? ChartTooltip;
  const tooltipProps: Record<string, unknown> = { title: label };
  tooltipProps.data = [
    {
      name: label,
      value: props.valueFormatter(value),
      color: legendReference?.color ?? style?.fill ?? 'transparent',
    },
  ];
  createApp(TooltipComponent, tooltipProps).mount(componentDiv);
  wm.set(data, componentDiv.innerHTML);
  return componentDiv.innerHTML;
}
</script>

<template>
  <VisTooltip
    :horizontal-shift="20"
    :vertical-shift="20"
    :triggers="{
      [selector]: template,
    }"
  />
</template>
