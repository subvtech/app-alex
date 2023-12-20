<template>
  <v-snackbar
    v-if="currentShow"
    class="snackbar"
    v-model="currentShow"
    @update:model-value="updateModelValue"
    :color="currentColor"
    :timeout="timeout"
    location="bottom right"
    data-testid="snackbar"
  >
    <v-row justify="space-between" align="end" class="py-4 pl-4 pr-8">
      <v-row justify="start" align="center">
        <v-icon v-if="currentColor === 'green' || color === '#26BF6B'"
          >mdi-check-circle-outline</v-icon
        >
        <v-icon v-else>mdi-close-circle-outline</v-icon>
        <span class="text-white font-weight-bold">{{ currentMessage }}</span>
      </v-row>
      <v-icon class="close" size="x-small" @click="onClose" role="close-btn"
        >mdi-close</v-icon
      >
    </v-row>
    <div class="w-100 bg-white lowbar">
      <div
        class="bar h-100"
        :class="startTimer ? 'w-100' : ''"
        :style="`transition: width ${timeout}ms linear`"
      />
    </div>
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

const timeout = ref(5000);
const startTimer = ref(false);

const updateModelValue = (newValue) => {
  if (data?.value) data.value.show = newValue;
  show.value = newValue;
  startTimer.value = true;
};

const currentShow = computed(() =>
  data?.value?.show ? data.value.show : show.value,
);

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

const onClose = () => {
  if (data?.value) data.value.show = false;
  show.value = false;
  startTimer.value = false;
};

watch(currentShow, () => {
  setTimeout(() => {
    startTimer.value = !startTimer.value;
  }, 10);
  
});
</script>
<style scoped lang="scss">
.lowbar {
  border-end-end-radius: 8px;
  margin-top: 45px;
  bottom: 0px;
  left: 0px;
  height: 4px;
  background-color: white;
  position: absolute;
}

.bar {
  background-color: blue;
  width: 0%;
}
.snackbar {
  display: inline-flex;
  min-width: 300px;
  flex-direction: column-reverse;
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
