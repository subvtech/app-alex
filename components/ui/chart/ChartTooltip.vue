<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

defineProps<{
  title?: string;
  data: {
    name: string;
    color: string;
    value: any;
  }[];
}>();
</script>

<template>
  <Card class="tw-text-sm">
    <CardHeader v-if="title" class="tw-p-3 tw-border-b">
      <CardTitle>
        {{ title }}
      </CardTitle>
    </CardHeader>
    <CardContent class="tw-p-3 tw-min-w-[180px] tw-flex tw-flex-col tw-gap-1">
      <div
        v-for="(item, key) in data"
        :key="key"
        class="tw-flex tw-justify-between"
      >
        <div class="tw-flex tw-items-center">
          <span class="tw-w-2.5 tw-h-2.5 tw-mr-2">
            <svg width="100%" height="100%" viewBox="0 0 30 30">
              <path
                d=" M 15 15 m -14, 0 a 14,14 0 1,1 28,0 a 14,14 0 1,1 -28,0"
                :stroke="item.color"
                :fill="item.color"
                stroke-width="1"
              />
            </svg>
          </span>
          <span>{{ item.name }}</span>
        </div>
        <span class="tw-font-semibold tw-ml-4">{{ item.value }}</span>
      </div>
    </CardContent>
  </Card>
</template>
