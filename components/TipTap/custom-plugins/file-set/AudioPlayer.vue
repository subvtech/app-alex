<template>
  <div class="audio-player d-flex align-center ga-3 rounded-lg pa-2 pr-3">
    <audio
      ref="audioRef"
      :src="src"
      preload="metadata"
      @loadedmetadata="updateDuration"
      @durationchange="updateDuration"
      @timeupdate="currentTime = audioRef?.currentTime || 0"
      @play="isPlaying = true"
      @pause="isPlaying = false"
      @ended="isPlaying = false"
      @error="emit('error')"
    ></audio>
    <v-btn
      class="audio-player__toggle flex-shrink-0"
      color="primary"
      icon
      size="small"
      elevation="0"
      :aria-label="
        isPlaying ? t('components.editorjs.fileSet.audio.pause') : t('components.editorjs.fileSet.audio.play')
      "
      @click="togglePlay"
    >
      <v-icon :icon="isPlaying ? 'mdi-pause' : 'mdi-play'" size="22"></v-icon>
    </v-btn>
    <div class="audio-player__track d-flex flex-column flex-grow-1 min-w-0">
      <input
        class="audio-player__range"
        type="range"
        min="0"
        :max="hasDuration ? duration : 0"
        step="0.01"
        :value="currentTime"
        :disabled="!hasDuration"
        :style="{ '--progress': `${progress}%` }"
        :aria-label="t('components.editorjs.fileSet.audio.seek')"
        :aria-valuetext="`${formatTime(currentTime)} / ${formatTime(duration)}`"
        @input="seek"
      />
      <span class="text-body-5 text-gray-500 mt-1">
        {{ isPlaying || currentTime > 0 ? formatTime(currentTime) : formatTime(duration) }}
      </span>
    </div>
    <button
      type="button"
      class="audio-player__speed flex-shrink-0 text-body-5 rounded-pill"
      :aria-label="t('components.editorjs.fileSet.audio.speed')"
      @click="cycleSpeed"
    >
      {{ speed }}x
    </button>
    <div class="d-flex align-center flex-shrink-0">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  src: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['error']);
const { t } = useI18n();

const speeds = [1, 1.5, 2];
const audioRef = ref<HTMLAudioElement>();
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const speed = ref(1);

const hasDuration = computed(() => Number.isFinite(duration.value) && duration.value > 0);
const progress = computed(() => (hasDuration.value ? Math.min((currentTime.value / duration.value) * 100, 100) : 0));

const updateDuration = () => {
  duration.value = audioRef.value?.duration || 0;
};

const togglePlay = () => {
  const audio = audioRef.value;
  if (!audio) return;
  if (audio.paused) {
    audio.play().catch(() => emit('error'));
  } else {
    audio.pause();
  }
};

const seek = (event: Event) => {
  const audio = audioRef.value;
  if (!audio || !hasDuration.value) return;
  const value = Number((event.target as HTMLInputElement).value);
  audio.currentTime = value;
  currentTime.value = value;
};

const cycleSpeed = () => {
  const next = speeds[(speeds.indexOf(speed.value) + 1) % speeds.length];
  speed.value = next;
  if (audioRef.value) {
    audioRef.value.playbackRate = next;
  }
};

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60);
  return `${minutes}:${rest.toString().padStart(2, '0')}`;
};
</script>

<style scoped>
.audio-player {
  max-width: 420px;
  background-color: var(--Cinza-Cinza-50, #f5f6f7);
  border: 1px solid var(--Cinza-Cinza-100, #ebedef);
}

.audio-player__range {
  --progress: 0%;
  width: 100%;
  height: 16px;
  margin: 0;
  background: transparent;
  cursor: pointer;
  appearance: none;
}

.audio-player__range:disabled {
  cursor: default;
}

.audio-player__range::-webkit-slider-runnable-track {
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(
    to right,
    rgb(var(--v-theme-primary)) var(--progress),
    var(--Cinza-Cinza-200, #d2d6da) var(--progress)
  );
}

.audio-player__range::-webkit-slider-thumb {
  width: 12px;
  height: 12px;
  margin-top: -4px;
  border: 0;
  border-radius: 50%;
  background: rgb(var(--v-theme-primary));
  appearance: none;
}

.audio-player__range::-moz-range-track {
  height: 4px;
  border-radius: 2px;
  background: var(--Cinza-Cinza-200, #d2d6da);
}

.audio-player__range::-moz-range-progress {
  height: 4px;
  border-radius: 2px;
  background: rgb(var(--v-theme-primary));
}

.audio-player__range::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border: 0;
  border-radius: 50%;
  background: rgb(var(--v-theme-primary));
}

.audio-player__range:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

.audio-player__speed {
  min-width: 40px;
  padding: 2px 8px;
  font-weight: 600;
  color: var(--Cinza-Cinza-800, #3b4249);
  background-color: var(--Cinza-Cinza-200, #d2d6da);
}
</style>
