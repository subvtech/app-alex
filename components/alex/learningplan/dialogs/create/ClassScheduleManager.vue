<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-4">
      <p class="text-h5 text-gray-800">
        {{ titleHeader }}
      </p>
      <slot
        name="action-button"
        :click-action-button="clickActionButton"
        :on-submit="onSubmit"
      />
    </div>
    <div
      v-if="!showItens"
      class="d-flex flex-column align-center justify-center gap-2"
    >
      <v-img width="150px" height="120px" :src="img" />
      <div>
        <h2 class="text-body-2 text-gray-800 max-w-200 text-center">
          {{ title }}
        </h2>
        <p class="text-body-5 text-gray-800 max-w-200 text-center">
          {{ subtitle }}
        </p>
      </div>
    </div>
    <div v-else class="d-flex flex-column gap-2">
      <slot name="items" />
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends { id: number }">
type ClassScheduleProps = {
  titleHeader: string;
  title: string;
  subtitle: string;
  img: string;
  showItens?: boolean;
};
const { showItens = false } = defineProps<ClassScheduleProps>();
const data = defineModel<T | null>('data');
const model = defineModel<T[]>({ required: true });
const clickActionButton = () => {
  data.value = null;
};
const onSubmit = (value: T) => {
  if (!data.value) {
    data.value = null;
    model.value.push(value);
    return;
  }
  const updatedData = model.value.map((item) => {
    if (item.id === value.id) {
      return value;
    }
    return item;
  });
  model.value = updatedData;
};
</script>

<style scoped>
.max-w-200 {
  max-width: 200px;
}
</style>
