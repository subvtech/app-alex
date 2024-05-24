<template>
  <div class="flex flex-col overflow-hidden">
    <v-scroll-y-reverse-transition hide-on-leave group>
      <alex-learningplan-task-chat-input-attached
        v-if="attachedMessage || attachedSubmission"
        class="w-100"
        :message="attachedMessage"
        :submission="attachedSubmission"
        @click:close="handleCloseAttached"
      />
    </v-scroll-y-reverse-transition>

    <div class="task-chat-input border-top-1 border-gray-100 relative">
      <v-slide-x-reverse-transition hide-on-leave group>
        <alex-learningplan-task-chat-input-recording
          v-if="isRecording"
          key="task-chat-recording"
          :paused="isPaused"
          :src="src"
          :time="time"
          :duration="duration"
          @click:delete="handleDelete"
          @click:pause="handlePause"
        />
        <div v-else key="task-chat-input" class="task-chat-container">
          <alex-learningplan-task-submission-menu
            location="top"
            :submissions="submissions"
            @click:select-submission="handleSelectSubmission"
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
      </v-slide-x-reverse-transition>
      <alex-custom-button icon="mdi-send" @click="handleSubmit" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface InputProps {
  submissions?: AttachedSubmission[];
}

withDefaults(defineProps<InputProps>(), { submissions: () => [] });
const emits = defineEmits({
  submit: ({ audio, text }: { audio?: Blob | null; text: string }) => ({
    audio,
    text,
  }),
});
const text = ref('');

// Audio manipulation
const {
  audio,
  isPaused,
  isRecording,
  duration,
  time,
  src,
  handleDelete,
  handlePause,
  handleRecord,
  stop,
} = UseRecording();

// Attached
const attachedMessage = ref<Message | undefined>({
  date: new Date(),
  id: 1,
  user: { name: 'jorge' },
  content: {
    text: 'complicado moreno',
  },
});
const attachedSubmission = ref<AttachedSubmission>();
const handleCloseAttached = () => {
  attachedMessage.value = undefined;
  attachedSubmission.value = undefined;
};
const handleSelectSubmission = (submission: AttachedSubmission) => {
  attachedMessage.value = undefined;
  attachedSubmission.value = submission;
};

// Submit Data
const handleSubmit = async () => {
  isRecording.value = false;
  await stop();
  emits('submit', { audio: audio.value, text: text.value });
  attachedMessage.value = {
    date: new Date(),
    id: 1,
    user: { name: 'jorge' },
    content: {
      text: text.value,
    },
  };
  resetValues();
};

const resetValues = () => {
  text.value = '';
  audio.value = null;
  isPaused.value = false;
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

@keyframes breathing {
  to {
    opacity: 0.15;
  }
  from {
    opacity: 1;
  }
}
</style>
