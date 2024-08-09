import { useIntervalFn } from '@vueuse/core';
import { differenceInMilliseconds } from 'date-fns';

export function UseRecording() {
  const isRecording = ref(false);
  const recorder = ref<MediaRecorder | null>();
  const isPaused = ref(false);
  const time = ref(0);
  const audio = ref<Blob | null>(null);
  const { pause, resume } = useIntervalFn(
    () => {
      time.value = time.value + 1;
    },
    1000,
    { immediate: false },
  );
  const startRecordingTime = ref<Date | null>(null);
  const duration = ref(0);
  const src = computed(() => {
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
    if (startRecordingTime.value) {
      const durationValue =
        differenceInMilliseconds(new Date(), startRecordingTime.value) / 1000;
      duration.value = durationValue;
    }
    await wait(100);
    if (deleteAudio) {
      audio.value = null;
    }
  };
  const handleRecord = async () => {
    await record();
    startRecordingTime.value = new Date();
    toggleIsRecording();
    resume();
  };
  const handlePause = () => {
    stop();
    if (startRecordingTime.value) {
      const durationValue =
        differenceInMilliseconds(new Date(), startRecordingTime.value) / 1000;
      duration.value = durationValue;
    }
    isPaused.value = true;
  };
  const handleDelete = async () => {
    await stop(true);
    toggleIsRecording();
    isPaused.value = false;
    recorder.value = null;
  };
  return {
    isRecording,
    isPaused,
    audio,
    startRecordingTime,
    time,
    duration,
    handleDelete,
    handlePause,
    handleRecord,
    src,
    stop,
  };
}
