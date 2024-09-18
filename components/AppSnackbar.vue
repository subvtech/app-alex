<template>
  <v-snackbar
    v-if="currentShow"
    v-model="currentShow"
    class="snackbar"
    :color="currentFill ? currentColor : 'white'"
    :timeout="timeSpan"
    location="bottom right"
    data-testid="snackbar"
    content-class="pa-4 pr-8 d-flex"
    @update:model-value="updateModelValue"
  >
    <div>
      <v-row justify="start" align="center" class="ga-5">
        <v-icon :color="countdown || !currentFill ? currentColor : 'white'">{{
          iconName
        }}</v-icon>
        <p
          class="text-body-4 max-w-138"
          :class="currentFill ? 'text-white' : 'text-gray-800'"
        >
          {{ currentMessage }}
        </p>
      </v-row>
      <v-icon
        :color="currentFill ? 'white' : 'gray-600'"
        class="close"
        size="16px"
        role="close-btn"
        @click="onClose"
        >mdi-close</v-icon
      >
    </div>
    <div v-if="currentCountdown" class="w-100 lowbar">
      <div
        class="bar h-100"
        :class="[
          currentFill ? 'opacity-80' : '',
          `bg-${currentColor}`,
          timeRunning ? 'w-100' : '',
        ]"
        :style="`transition: width ${timeSpan}ms linear; background-color: ${currentColor}`"
      />
    </div>
  </v-snackbar>
</template>

<script setup lang="ts">
const messageStore = useMessageStore();

const { show, message, color, fill, showCountdown } = storeToRefs(messageStore);

const { stopTimeout, timeSpan, timeRunning } = useTimeout(5000);

const props = defineProps({
  data: {
    type: Object as PropType<{
      show: boolean;
      color: string;
      message: string;
      fill: boolean;
    }>,
  },
  countdown: {
    type: Boolean,
    default: false,
  },
});

const { data } = toRefs(props);

const iconName = computed(() => {
  let name = '';
  switch (currentColor.value) {
    case 'error':
    case 'red':
      name = 'mdi-close-circle-outline';
      break;
    case 'green':
    case 'success':
      name = 'mdi-check-circle';
      break;
    case 'warning':
      name = 'mdi-alert-circle-outline';
      break;
    case 'blue':
    case 'info':
      name = 'mdi-information-outline';
      break;
    case 'gray':
    case 'custom':
      name = 'mdi-view-dashboard';
      break;
  }
  return name;
});

const updateModelValue = (newValue) => {
  if (data?.value) data.value.show = newValue;
  show.value = newValue;
  timeRunning.value = true;
};

const currentShow = computed(() => data?.value?.show || show.value);

const currentColor = computed(() =>
  data?.value?.color ? data.value.color : color.value ? color.value : 'green',
);

const currentCountdown = computed(() =>
  props.countdown
    ? props.countdown
    : showCountdown.value !== undefined
    ? showCountdown.value
    : false,
);

const currentFill = computed(() =>
  data?.value?.fill
    ? data.value.fill
    : fill.value !== undefined
    ? fill.value
    : true,
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
</script>
<style scoped lang="scss">
.lowbar {
  border-end-end-radius: 8px;
  margin-top: 45px;
  bottom: 0px;
  left: 0px;
  height: 4px;
  position: absolute;
}

.bar {
  width: 0%;
}
.snackbar {
  display: inline-flex;
  min-width: 300px;
  padding: 16px !important;
  flex-direction: column-reverse;
  justify-content: end;
  align-items: flex-start;
  border-radius: 8px;

  box-shadow:
    0px 4px 4px 0px rgba(0, 0, 0, 0.1),
    0px 0px 2px 0px rgba(0, 0, 0, 0.1);
}

.opacity-80 {
  opacity: 0.8;
}

.close {
  position: absolute;
  top: 8px;
  right: 8px;
}
</style>
