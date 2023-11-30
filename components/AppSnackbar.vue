<template>
  <v-snackbar
    v-if="data"
    v-model="data.show"
    :color="data.color ?? color"
    top
    timeout="5000"
    data-testid="snackbar"
  >
    <v-row justify="space-between" align="center" class="pa-2">
      <span class="text-white font-weight-bold">{{
        data.message ?? message
      }}</span>
      <v-btn
        role="close-btn"
        variant="elevated"
        :style="`color: ${color}`"
        @click="data.show = false"
        >Fechar</v-btn
      >
    </v-row>
  </v-snackbar>
  <v-snackbar
    v-else
    v-model="show"
    :color="color"
    top
    timeout="5000"
    data-testid="snackbar"
  >
    <v-row justify="space-between" align="center" class="pa-2">
      <span class="text-white font-weight-bold">{{ message }}</span>
      <v-btn
        role="close-btn"
        variant="elevated"
        :style="`color: ${color}`"
        @click="show = false"
        >Fechar</v-btn
      >
    </v-row>
  </v-snackbar>
</template>

<script setup lang="ts">
const messageStore = useMessageStore();

const { show, message, color } = storeToRefs(messageStore);

const props = defineProps({
  data: {
    type: Object as PropType<{ show: boolean; color: string; message: string }>,
  },
});

const { data } = toRefs(props);
</script>
