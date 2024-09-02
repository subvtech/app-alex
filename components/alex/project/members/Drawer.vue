<template>
  <v-navigation-drawer
    :model-value="modelValue"
    location="right"
    temporary
    floating
    scrim="transparent"
    sticky
    :width="380"
    class="py-6 rounded-s-lg"
    @update:model-value="handleChange"
  >
    <div class="d-flex flex-column ga-4 tw-h-full tw-w-full bg-white">
      <div class="d-flex align-center ga-4 px-4">
        <p class="text-h4 flex-fill">
          {{ title }}
        </p>
        <alex-custom-button
          icon="mdi-close"
          variant="text"
          size="small"
          flat
          @click="handleChange(false)"
        />
      </div>

      <hr class="mb-2" />

      <div class="d-flex flex-column h-100 px-4 gap-4">
        <alex-inputs-select
          v-for="(filter, index) in filters"
          :key="index"
          v-model="selected[index]"
          :name="filter.label"
          :items="filter.items"
          :placeholder="filter.placeholder"
          clearable
          density="comfortable"
          hide-details
          :label="filter.label"
        />
      </div>
      <hr />

      <div class="d-flex ga-1 px-4">
        <alex-custom-button
          class="flex-1-1"
          variant="secondary"
          size="large"
          @click="clearFilters"
          >{{ $t('components.learningPlan.drawer.clean') }}</alex-custom-button
        >
        <alex-custom-button class="flex-1-1" size="large" @click="filterOut">{{
          $t('components.learningPlan.drawer.filter')
        }}</alex-custom-button>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
export interface FilterItemProps {
  items: string[];
  label: string;
  placeholder: string;
}

interface Filter {
  modelValue: boolean;
  kanbanFilter?: boolean;
  filters: FilterItemProps[];
  title: string;
}

const props = withDefaults(defineProps<Filter>(), {
  modelValue: false,
  filters: () => [],
  kanbanFilter: false,
});

const selected = ref<string | null[]>(props.filters.map(() => null));

const emits = defineEmits(['update:modelValue', 'filter']);

const handleChange = (value: boolean) => {
  emits('update:modelValue', value);
};

const filterOut = () => {
  emits('filter', selected.value);
};

const clearFilters = () => {
  selected.value = props.filters.map(() => null);

  emits('filter', {});
};
</script>

<style></style>
