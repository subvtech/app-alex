<template>
  <v-alert :type="alertType" border="start">
    <div v-html="alertBlock.message"></div>
  </v-alert>
</template>

<script setup lang="ts">
const props = defineProps({
  alertBlock: {
    required: true,
    type: Object,
  },
});

const { alertBlock } = toRefs(props);
let alertType = computed(() => {
  if (['warning', 'success', 'info'].includes(alertBlock.value.type)) {
    return alertBlock.value.type;
  } else if (alertBlock.value.type === 'danger') {
    return 'error';
  } else {
    return 'info';
  }
});
</script>
