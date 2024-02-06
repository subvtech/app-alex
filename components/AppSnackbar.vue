<template>
  <v-snackbar
    v-if="currentShow"
    v-model="currentShow"
    class="snackbar"
    :color="currentColor"
    :timeout="timeSpan"
    location="bottom right"
    data-testid="snackbar"
    @update:model-value="updateModelValue"
  >
    <v-row justify="space-between" align="end" class="py-4 pl-4 pr-8 relative">
      <v-row justify="start" align="center">
        <v-icon :color="countdown ? currentColor : 'white'">{{
          iconName
        }}</v-icon>
        <span class="text-white font-weight-bold">{{ currentMessage }}</span>
      </v-row>
      <v-icon class="close" size="x-small" role="close-btn" @click="onClose"
        >mdi-close</v-icon
      >
    </v-row>
    <div v-if="countdown" class="w-100 bg-white lowbar">
      <div
        class="bar h-100"
        :class="startTimer ? 'w-100' : ''"
        :style="`transition: width ${timeSpan}ms linear; background-color: ${currentColor}`"
      />
    </div>
  </v-snackbar>
</template>

<script setup lang="ts">
export interface AppSnackbarComponentType {
  data?: {
    show: boolean;
    color: string;
    message: string;
  };
  countdown?: boolean;
}
const messageStore = useMessageStore();

const { show, message, color } = storeToRefs(messageStore);

const { timeoutId, stopTimeout, timeSpan, startTimer, setStartTimer } =
  useTimeout(5000);

const props = withDefaults(defineProps<AppSnackbarComponentType>(), {
  data: () => ({
    show: false,
    color: 'green',
    message: 'done',
  }),
  countdown: false,
});

const { data } = toRefs(props);

const iconName = computed(() => {
  let name = '';
  switch (currentColor.value) {
    case 'red':
      name = 'mdi-close-circle';
      break;
    case 'green':
      name = 'mdi-check-circle';
      break;
    case 'warning':
      name = 'mdi-alert-circle';
      break;
    case 'blue':
      name = 'mdi-information';
      break;
    case 'gray':
      name = 'mdi-view-dashboard';
      break;
  }
  if (props.countdown) name += '-outline';
  return name;
});

const updateModelValue = (newValue) => {
  if (data?.value) data.value.show = newValue;
  show.value = newValue;
  setStartTimer(true);
};

const currentShow = computed(() =>
  data?.value?.show ? data.value.show : show.value,
);

const currentColor = computed(() =>
  data?.value?.color ? data.value.color : color.value ? color.value : 'green',
);

const currentMessage = computed(() =>
  data?.value?.message
    ? data.value.message
    : message.value
    ? message.value
    : 'done',
);

onUnmounted(() => {
  stopTimeout();
});

const onClose = () => {
  if (data?.value) data.value.show = false;
  show.value = false;
  stopTimeout();
};

watch(currentShow, () => {
  timeoutId.value = setTimeout(() => {
    setStartTimer(!startTimer.value);
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

.relative {
  position: relative;
}

.bar {
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
  top: 4px;
  right: 8px;
  color: white;
}
</style>
