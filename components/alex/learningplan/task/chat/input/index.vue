<template>
  <div class="task-chat-input pt-3 bg-white border-top-1 border-gray-100">
    <v-slide-x-reverse-transition hide-on-leave group>
      <div
        v-if="!isRecording"
        key="task-chat-input"
        class="task-chat-container"
      >
        <alex-learningplan-task-submission-menu
          location="top"
          :submissions="[]"
        >
          <template #activator="{ props: submission }"
            ><alex-custom-button
              icon="mdi-text-box-outline"
              variant="text"
              v-bind="submission"
          /></template>
        </alex-learningplan-task-submission-menu>
        <alex-inputs-text-field
          v-model="text"
          name="chat"
          class="w-100"
          density="comfortable"
          hide-details
          placeholder="Digite alguma mensagem"
        />
        <alex-custom-button
          icon="mdi-microphone"
          variant="text"
          @click="handleRecord"
        />
      </div>
      <div v-else key="task-chat-recording" class="task-chat-container">
        <alex-custom-button
          icon="mdi-trash-can-outline"
          variant="text"
          @click="handleDelete"
        />
        <v-slide-x-reverse-transition hide-on-leave group>
          <div v-if="paused" class="task-chat-audio-player">
            <alex-learningplan-task-audio
              :src="srcAudio"
              :default-max-time="duration"
            />
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
              @click="handlePause"
            />
          </div>
        </v-slide-x-reverse-transition>
      </div>
    </v-slide-x-reverse-transition>
    <alex-custom-button icon="mdi-send" @click="handleSubmit" />
  </div>
</template>

<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core';
import { differenceInMilliseconds } from 'date-fns';
import { wait } from '~/utils';

const isRecording = ref(false);
const recorder = ref<MediaRecorder | null>();
const paused = ref(false);
const time = ref(0);
const audio = ref<Blob | null>(null);
const emits = defineEmits({
  submit: ({ audio, text }: { audio?: Blob | null; text: string }) => ({
    audio,
    text,
  }),
});
const { pause, resume } = useIntervalFn(
  () => {
    time.value = time.value + 1;
  },
  1000,
  { immediate: false },
);
const startTime = ref<Date | null>(null);
const duration = ref(0);
const text = ref('');
const formatTime = computed(() =>
  new Date(1000 * time.value).toISOString().slice(14, 19),
);
const srcAudio = computed(() => {
  if (audio.value) {
    return URL.createObjectURL(audio.value);
  }
  return '';
});

const toggleIsRecording = () => {
  isRecording.value = !isRecording.value;
};

const record = async () => {
  time.value = 0;
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });

  const options = { mimeType: 'audio/webm' };
  recorder.value = new MediaRecorder(stream, options);

  recorder.value.addEventListener('dataavailable', (e) => {
    if (e.data.size > 0) {
      audio.value = e.data;
    }
  });
  recorder.value.start();
};
const stop = async (deleteAudio = false) => {
  if (!recorder.value) return;
  pause();
  recorder.value.stop();
  await wait(100);
  if (deleteAudio) {
    audio.value = null;
  }
};

const handleRecord = async () => {
  await record();
  startTime.value = new Date();
  toggleIsRecording();
  resume();
};
const handlePause = () => {
  stop();
  if (startTime.value) {
    const durationValue =
      differenceInMilliseconds(new Date(), startTime.value) / 1000;
    duration.value = durationValue;
  }
  paused.value = true;
};
const handleDelete = async () => {
  await stop(true);
  toggleIsRecording();
  paused.value = false;
  recorder.value = null;
};
const handleSubmit = async () => {
  isRecording.value = false;
  await stop();
  emits('submit', { audio: audio.value, text: text.value });
  resetValues();
};

const resetValues = () => {
  text.value = '';
  audio.value = null;
  paused.value = false;
  isRecording.value = false;
};
</script>

<style scoped lang="scss">
.task-chat-input {
  gap: 0.25rem;
  overflow: hidden;
}
.task-chat-input,
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

@keyframes breathing {
  to {
    opacity: 0.15;
  }
  from {
    opacity: 1;
  }
}
</style>
