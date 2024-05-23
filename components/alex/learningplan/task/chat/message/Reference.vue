<template>
  <div
    class="reference bg-gray-blue px-3 py-2 rounded-lg border-1 border-gray-100"
  >
    <h6 class="text-body-6 text-gray-600">{{ user.name }}</h6>
    <p v-if="content?.audio" class="text-body-5 text-gray-400">Áudio</p>
    <p v-else class="text-body-5 text-gray-400 ellipsis lines-1">
      {{ content?.text }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { Message } from '@/models/simple/message';
type ReferenceProps = Pick<Message, 'content' | 'id' | 'user'>;
defineProps<ReferenceProps>();
</script>

<style scoped lang="scss">
.reference:hover {
  cursor: pointer;
  background: rgb(var(--v-theme-gray-100)) !important;
}
.reference:active {
  background: rgb(var(--v-theme-gray-200)) !important;
}
</style>
