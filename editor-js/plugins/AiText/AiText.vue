<template>
  <div class="ce-ia-wrapper">
    <div
      v-if="answers.length"
      class="ia-container-answer bg-gray-blue pa-4 rounded-lg text-gray-800"
    >
      <v-window v-model="activeAnswer" class="flex-grow-1">
        <v-window-item v-for="(answer, i) in answers" :key="i">
          <p class="ia-text-generated" :class="{ active: i === activeAnswer }">
            {{ answer }}
          </p>
        </v-window-item>
      </v-window>
      <div v-if="answers.length > 1" class="w-100 d-flex gap-1 align-center">
        <alex-custom-button
          variant="text"
          class="ml-auto"
          icon="mdi-chevron-left"
          :disabled="activeAnswer === 0"
          @click="prevAnswer"
        />
        <span class="h-fit">{{ activeAnswer + 1 }}/{{ answers.length }}</span>
        <alex-custom-button
          variant="text"
          icon="mdi-chevron-right"
          :disabled="activeAnswer === answers.length - 1"
          @click="nextAnswer"
        />
      </div>
    </div>
    <alex-inputs-text-field
      v-model="text"
      name="ia-text"
      hide-details
      :prepend-inner-icon="isGenerating ? 'mdi-robot-love' : 'mdi-robot'"
      class="w-100"
      :class="{ 'is-generating': isGenerating }"
      :readonly="isGenerating"
      :placeholder="placeholder"
      @keyup.enter="getAICompletion"
    >
      <template #append-inner>
        <alex-custom-button
          text="Parar"
          prepend-icon="mdi-close"
          variant="secondary"
          size="small"
          :class="{ 'is-generating-button': !isGenerating }"
          @click="onStopGetting"
        />
        <v-icon
          class="send-button"
          :class="{
            'is-generating-button': isGenerating,
            'send-button-disabled': !text,
          }"
          @click="getAICompletion"
        >
          mdi-arrow-up-bold-box</v-icon
        >
      </template>
    </alex-inputs-text-field>
    <div v-if="answers.length && !isGenerating" class="ia-text-controls">
      <alex-custom-button
        text="Cancelar"
        prepend-icon="mdi-close"
        variant="secondary"
        size="small"
        @click="onCancel"
      />
      <alex-custom-button
        text="Gerar novamente"
        prepend-icon="mdi-replay"
        variant="secondary"
        size="small"
        @click="onReSend"
      />
      <alex-custom-button
        text="Aceitar resposta"
        prepend-icon="mdi-check"
        size="small"
        @click="onSave"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlexThemeColors } from '@/config/themes';
interface IaTextProps {
  placeholder?: string;
  onSend: (content: string) => Promise<string[]>;
  onCancel: () => void;
  onStop: () => void;
  onSave?: () => void;
}
defineEmits(['cancel']);
const text = ref<null | string>(null);
const isGenerating = ref(false);
const answers = ref<string[]>([]);
const activeAnswer = ref(0);
const firstValue = ref<string | null>(null);
const props = withDefaults(defineProps<IaTextProps>(), {
  placeholder: 'Peça para a IA escrever algo...',
  onSave: undefined,
});
const onReSend = async () => {
  isGenerating.value = true;
  try {
    if (!firstValue.value) return;
    const response = await props.onSend(firstValue.value);
    answers.value = [...answers.value, ...response];
  } catch (error) {
  } finally {
    isGenerating.value = false;
  }
};
const getAICompletion = async () => {
  if (!text.value) return;
  isGenerating.value = true;
  firstValue.value = text.value;
  text.value = 'A IA está pensando...';
  try {
    const response = await props.onSend(firstValue.value);
    answers.value = [...answers.value, ...response];
    text.value = firstValue.value;
  } catch (error) {
  } finally {
    isGenerating.value = false;
  }
};
const nextAnswer = () => {
  const nextAnswerValue = activeAnswer.value + 1;
  if (nextAnswerValue < answers.value.length) {
    activeAnswer.value = nextAnswerValue;
  }
};
const prevAnswer = () => {
  const nextAnswerValue = activeAnswer.value - 1;
  if (nextAnswerValue > -1) {
    activeAnswer.value = nextAnswerValue;
  }
};
const onStopGetting = () => {
  props.onStop();
  text.value = null;
};
const isGeneratingColor = {
  color: AlexThemeColors['secondary-0'],
  outline: AlexThemeColors['secondary-0'],
};
</script>

<style scoped lang="scss">
.ce-ia-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ia-text-controls {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
}
.send-button {
  cursor: pointer;
}
.send-button-disabled {
  opacity: 0.4 !important;
  pointer-events: none;
}
.is-generating :deep(.v-field) {
  outline: 2px solid v-bind('isGeneratingColor.outline');
  .v-field__prepend-inner i {
    color: v-bind('isGeneratingColor.color') !important;
  }
  input {
    color: v-bind('isGeneratingColor.color') !important;
  }
}
.is-generating-button {
  display: none;
}
:global(.ce-ia-text[contenteditable='true']) {
  outline: 0px solid transparent;
}
.ia-container-answer {
  display: flex;
  flex-direction: column;
  min-height: 100px;
}
.h-fit {
  height: fit-content;
}

:deep(.is-generating .v-field--dirty > .v-field__field > .v-field__input) {
  color: v-bind('isGeneratingColor.color') !important;
}
.ia-text-generated {
  white-space: pre-wrap;
}
</style>
