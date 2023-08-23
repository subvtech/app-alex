<template>
  <v-alert border="bottom" colored-border type="warning" elevation="2">
    <div class="text-h5">
      {{ warningBlock.title }}
    </div>
    {{ warningBlock.message }}
  </v-alert>
</template>

<script setup lang="ts">
const props = defineProps({
  warningBlock: {
    required: true,
    type: Object,
  },
});
const { warningBlock } = toRefs(props);
</script>
