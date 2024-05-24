<template>
  <div class="task-chat-container">
    <alex-custom-button
      icon="mdi-trash-can-outline"
      variant="text"
      @click="$emit('click:delete')"
    />
    <v-slide-x-reverse-transition hide-on-leave group>
      <div v-if="paused" class="task-chat-audio-player">
        <alex-learningplan-task-audio :src="src" :default-max-time="duration" />
      </div>
      <div v-else class="task-chat-container">
        <div class="audio-ball"></div>
        <div class="audio-timer">{{ formatTime }}</div>
        <div class="audio-container-line">
          <div class="audio-line"></div>
        </div>
        <alex-custom-button
          icon="mdi-pause"
          variant="text"
          @click="$emit('click:pause')"
        />
      </div>
    </v-slide-x-reverse-transition>
  </div>
</template>

<script setup lang="ts">
interface RecordingProps {
  src: string;
  duration: number;
  paused?: boolean;
  time: number;
}
const props = defineProps<RecordingProps>();
defineEmits(['click:pause', 'click:delete']);
const formatTime = computed(() =>
  new Date(1000 * props.time).toISOString().slice(14, 19),
);
</script>

<style scoped lang="scss">
.task-chat-container {
  width: 100%;
  display: flex;
  gap: 0.25rem;
  align-items: center;
  justify-content: center;
}

.audio-line {
  width: 100%;
  border: 1px dashed rgb(var(--v-theme-gray-100));
}
.audio-container-line {
  display: flex;
  align-items: center;
  width: 100%;
  height: 48px;
}
.audio-ball {
  width: 8px;
  border-radius: 999px;
  aspect-ratio: 1;
  background-color: rgb(var(--v-theme-error-0));
  animation: breathing infinite alternate 800ms;
  opacity: 1;
}
.task-chat-audio-player,
.task-chat-recording {
  width: 100%;
}
.task-chat-recording {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 1rem;
}

.audio-container {
  width: 100%;
  display: flex;
  align-items: center;
  height: 48px;
}
</style>
