<template>
  <div class="text-center">
    <div
      class="d-flex align-center justify-center text-center rounded-lg tw-w-[120px] tw-h-[150px] tw-cursor-pointer overflow-hidden"
      :class="
        selected ? 'blue-cover tw-border-2 !tw-border-[#00B7CC]' : 'border'
      "
      @click="emit('select', id)"
    >
      <img v-if="coverUrl" :src="coverUrl" class="tw-select-none" />
      <p v-else class="text-h3 text-gray-600">{{ getInitials(title) }}</p>
    </div>

    <p
      class="pt-1 text-body-6 text-gray-800 tw-truncate tw-cursor-pointer"
      @click="emit('select', id)"
    >
      {{ title }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface DocumentProps {
  id: number;
  title: string;
  coverUrl?: string;
  selected: true;
}

defineProps<DocumentProps>();

const emit = defineEmits(['select']);
</script>

<style scoped>
.blue-cover {
  position: relative;
}

.blue-cover:after {
  content: '';

  position: absolute;
  left: 0;
  top: 0;

  width: 100%;
  height: 100%;

  transition: background-color 0.5s ease-out;

  /* secondary-0 */
  background: rgba(0, 183, 204, 0.15);
}
</style>
