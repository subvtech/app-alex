<template>
  <div class="tw-p-4 tw-py-0 tw-rounded-lg border-1 border-gray-100">
    <div
      class="tw-flex-fill tw-h-0 tw-py-1 tw-rounded-b-lg"
      :class="selectedColor"
    ></div>
    <div class="tw-flex tw-align-center tw-mt-1 tw-py-4 tw-px-0">
      <input
        v-model="titleRef"
        type="text"
        class="flex-1-1 text-h5 tw-text-gray-800 tw-border-none tw-outline-none tw-min-h-[30px] tw-hover:tw-bg-gray-100"
        @focus="toggleEdit"
        @blur="toggleEdit"
      />
      <span
        v-if="!isEditing"
        class="tw-flex tw-items-center tw-justify-center tw-pt-[1px] tw-bg-gray-100 tw-rounded-lg tw-h-7 tw-w-6"
        >{{ quantity }}</span
      >
      <!-- <template v-else>
        <p class="flex-1-1 text-h5 tw-text-gray-800" @click="toggleEdit">
          {{ title }}
        </p>
        <span
          v-if="isEditing"
          class="tw-flex tw-items-center tw-justify-center tw-pt-[1px] tw-bg-gray-100 tw-rounded-lg tw-h-7 tw-w-6"
          >{{ quantity }}</span
        >
      </template> -->
    </div>
  </div>
</template>

<script setup lang="ts">
interface ColumnHeader {
  title: string;
  quantity?: number;
  color?: 'orange' | 'green' | 'blue' | 'gray';
  edit?: boolean;
}
const props = withDefaults(defineProps<ColumnHeader>(), {
  edit: false,
  color: 'gray',
  quantity: 0,
});
const titleRef = ref(props.title);
const isEditing = ref(props.edit);
const colors = {
  orange: ' bg-warning-0',
  gray: ' bg-gray-300',
  blue: ' bg-info-0',
  green: ' bg-success-0',
};
const selectedColor = computed(() => colors[props.color] || colors.gray);
const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};
</script>

<style scoped></style>
