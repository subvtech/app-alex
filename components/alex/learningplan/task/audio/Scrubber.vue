<template>
  <div
    ref="scrubber"
    class="scrubber"
    @mousedown="scrubbing = true"
    @mouseup="scrubbing = false"
    @click="getCoordinates"
    @mousemove="handleMouseMove"
    @mouseleave="scrubbing = false"
  >
    <div class="scrubber-slide-container">
      <div
        class="scrubber-slide"
        :style="{
          right: `${slidePosition}%`,
        }"
      >
        <div class="scrubber-slide-ball"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ScrubberProps {
  max?: number;
  playing: boolean;
  duration: number;
}
const props = withDefaults(defineProps<ScrubberProps>(), { max: 100 });
const currentTime = defineModel<number>({ required: true });
const ended = defineModel<boolean>('ended', { required: true });
const pendingValue = ref(0);
const scrubbing = ref(false);
const scrubber = ref<HTMLDivElement | null>(null);

const slidePosition = computed(() => {
  const maxCurrent =
    currentTime.value > props.duration ? props.duration : currentTime.value;
  if (ended.value) return calcPercentage(props.duration);
  return calcPercentage(maxCurrent);
});

const calcPercentage = (current: number) =>
  Math.max(100 - (current / props.max) * 100, 0);

const setTransition = (value: boolean) => {
  if (!scrubber.value) return;
  if (value) {
    scrubber.value.classList.add('scrubber-transition');
    return;
  }
  scrubber.value.classList.remove('scrubber-transition');
};
watch(
  () => props.playing,
  () => {
    if (!scrubber.value) return;
    if (!props.playing) {
      setTransition(false);
      return;
    }
    setTransition(false);
    setTimeout(() => {
      setTransition(true);
    }, 100);
  },
);
watch(ended, () => {
  if (ended.value) {
    setTransition(false);
  }
});

const getCoordinates = (e: MouseEvent) => {
  if (!scrubber.value) return;
  ended.value = false;
  const coordinates = scrubber.value.getBoundingClientRect();
  const x = e.clientX - coordinates.left;
  const width = coordinates.width;
  const progress = Math.max(0, Math.min(1, x / width));
  pendingValue.value = progress * props.max;
  currentTime.value = pendingValue.value;
};
const handleMouseMove = (e: MouseEvent) => {
  if (scrubbing.value) {
    getCoordinates(e);
  }
};
</script>
<style scoped>
.scrubber {
  position: relative;
  user-select: none;
  border-radius: 8px;
  cursor: pointer;
  padding-top: 4px;
  padding-bottom: 4px;
}
.scrubber-time:hover {
  opacity: 1;
}
.opacity-100 {
  opacity: 1 !important;
}
.scrubber-slide-container {
  position: relative;
  border-radius: 8px;
  width: 100%;
  height: 6px;
  background-color: rgb(var(--v-theme-gray-200));
  color: rgb(var(--v-theme-secondary--0));
}
.scrubber-slide {
  position: absolute;
  border-radius: 8px;
  left: 0;
  top: 50%;
  height: 100%;
  transform: translateY(-50%);
  background-color: rgb(var(--v-theme-secondary-0));
}
.scrubber.scrubber-transition .scrubber-slide {
  transition: all 260ms linear;
}

.scrubber-slide-container:hover {
  height: 8px;
}

.scrubber-slide-ball {
  width: 12px;
  border-radius: 99px;
  cursor: pointer;
  aspect-ratio: 1;
  background-color: rgb(var(--v-theme-secondary-0));
  position: absolute;
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 200;
  transition: all 1ms ease-in;
}
.scrubber-slide-container:hover .scrubber-slide-ball {
  width: 14px;
}
.scrubber-slide-container:active .scrubber-slide-ball,
.scrubber-slide-ball:active {
  outline: 3px solid rgb(0, 183, 204, 0.5);
}
</style>
