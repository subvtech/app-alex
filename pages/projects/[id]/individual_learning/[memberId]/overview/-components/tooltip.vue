<script setup lang="ts">
defineProps<{
  title?: string;
  index: string;
  data: {
    name: string;
    color: string;
    value: any;
  }[];
}>();
</script>

<template>
  <Card class="tw-max-w-[250px]">
    <CardContent class="p-3 min-w-[180px] d-flex flex-column gap-1 align-center justify-center">
      <template v-for="(item, key) in data" :key="key">
        <div v-if="item.name === 'percentage'" class="d-lex align-center justify-center">
          <div class="d-flex align-center justify-center pa-2">
            <div class="tw-min-h-2 tw-min-w-2 tw-mr-[5px] bg-secondary-0 tw-rounded-[3px]" />
            <span class="text-body-5 ellipsis lines-1 mr-1 break-words tw-max-w-[200px]">
              {{ title }}
            </span>
            <span class="text-body-5 ml-1 font-weight-bold">{{ item.value }}%</span>
          </div>
        </div>
      </template>
    </CardContent>
  </Card>
</template>
