<template>
  <v-snackbar
    v-if="data"
    class="snackbar"
    v-model="data.show"
    :color="currentColor"
    top
    :timeout="timeout"
    data-testid="snackbar"
  >
    <v-row justify="space-between" align="center" class="py-4 pl-4 pr-8">
      <v-row justify="start" align="center">
        <v-icon v-if="color === 'green' || color === '#26BF6B'">mdi-check-circle-outline</v-icon>
        <v-icon v-else>mdi-close-circle-outline</v-icon>
        <span class="text-white font-weight-bold">{{ currentMessage }}</span>
      </v-row>
      <v-icon class="close" size="x-small" @click="onClose" role="close-btn"
        >mdi-close</v-icon
      >
    </v-row>
    <div class="lowbar w-100" />
  </v-snackbar>
  <v-snackbar
    v-else
    class="snackbar"
    v-model="show"
    :color="currentColor"
    top
    :timeout="timeout"
    data-testid="snackbar"
  >
    <v-row justify="space-between" align="center" class="py-4 pl-4 pr-8">
      <v-row justify="start" align="center">
        <v-icon v-if="color === 'green' || color === '#26BF6B'">mdi-check-circle-outline</v-icon>
        <v-icon v-else>mdi-close-circle-outline</v-icon>
        <span class="text-white font-weight-bold">{{ currentMessage }}</span>
      </v-row>
      <v-icon class="close" size="x-small" @click="onClose" role="close-btn"
        >mdi-close</v-icon
      >
    </v-row>
    <div class="lowbar w-100" />
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

const timeout = 5000;

const currentColor = computed(() =>
  data?.value?.color ? data.value.color : color.value ? color.value : '#26bf6b',
);

const currentMessage = computed(() =>
  data?.value?.message
    ? data.value.message
    : message.value
    ? message.value
    : 'done',
);

const { data } = toRefs(props);

const onClose = () => {
  if (data) if (data.value) data.value.show = false;
  show.value = false;
};
</script>
<style scoped lang="scss">
.lowbar {
  position: absolute;
  bottom: 0px;
  left: 0px;
  background-color: white;
  border-end-end-radius: 8px;
  height: 4px;
}
.snackbar {
  display: inline-flex;
  min-width: 300px;
  max-width: 600px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  border-radius: 8px;

  box-shadow:
    0px 4px 4px 0px rgba(0, 0, 0, 0.1),
    0px 0px 2px 0px rgba(0, 0, 0, 0.1);
}
span {
  margin-left: 10px;
  color: var(--Principais-Branco, #fff);

  font-family: Sen;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 135%; /* 18.9px */
  letter-spacing: 0.28px;
}

.close {
  position: absolute;
  top: 16px;
  right: 16px;

  color: white;
}
</style>
