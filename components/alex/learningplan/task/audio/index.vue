<template>
  <div class="audio-container">
    <alex-custom-button
      :icon="`mdi-${playing ? 'pause' : 'play'}`"
      variant="text"
      color="secondary-0"
      @click="togglePlay"
    />
    <p class="audio-time text-gray-300 text-body-5">
      {{ maxTime }}
    </p>
    <alex-learningplan-task-audio-scrubber
      v-model="currentTime"
      v-model:ended="ended"
      :playing="playing"
      :max="durationOrDefault"
      :duration="durationOrDefault"
      class="w-100 mr-4"
    />
    <audio ref="audio">
      <source :src="src" type="audio/webm" />
    </audio>
  </div>
</template>

<script setup lang="ts">
import { useMediaControls } from '@vueuse/core';

interface AudioPlayer {
  src: string;
  defaultMaxTime?: number;
}
const props = withDefaults(defineProps<AudioPlayer>(), {
  defaultMaxTime: 0,
});
const audio = ref<HTMLAudioElement>();

const { playing, currentTime, duration, ended } = useMediaControls(audio, {
  src: props.src,
  document,
});
const togglePlay = () => {
  if (ended.value) {
    ended.value = false;
    currentTime.value = 0;
  }
  playing.value = !playing.value;
};
function formatDuration(seconds: number) {
  if (seconds === Infinity) {
    return;
  }
  return new Date(1000 * seconds).toISOString().slice(15, 19);
}

const durationOrDefault = computed(() =>
  duration.value !== Infinity ? duration.value : props.defaultMaxTime,
);

const maxTime = computed(() => formatDuration(durationOrDefault.value));
</script>

<style scoped>
.time-tooltip {
  position: absolute;
  transform: translateX(50%);
  bottom: 0;
  z-index: 2001;
  border-radius: 0.25rem;
  background-color: rgb(var(--v-theme-gray-800));
  color: rgb(var(--v-theme-white));
  margin-bottom: 4px;
  padding: 0.5rem;
}
.audio-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
