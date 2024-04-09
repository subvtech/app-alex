<template>
  <div class="ce-ia-text">
    <div
      v-if="generatedText"
      class="ia-text-generated bg-gray-blue pa-4 rounded-lg text-gray-800"
    >
      {{ generatedText }}
    </div>
    <alex-inputs-text-field
      v-model="value"
      name="ia-text"
      hide-details
      prepend-inner-icon="mdi-lightbulb-on"
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
          @click="onCancel"
        />
        <v-icon
          class="send-button"
          :class="{
            'is-generating-button': isGenerating,
            'send-button-disabled': !value,
          }"
          @click="getAICompletion"
        >
          mdi-arrow-up-bold-box</v-icon
        >
      </template>
    </alex-inputs-text-field>
    <div v-if="generatedText && !isGenerating" class="ia-text-controls">
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
        @click="reSend"
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
  onSend: (content: string) => Promise<string>;
  onSave?: () => void;
  reSend?: () => Promise<string>;
  onCancel?: () => void;
}
defineEmits(['send']);
const value = ref<null | string>(null);
const isGenerating = ref(false);
const generatedText = ref<null | string>(null);
const props = withDefaults(defineProps<IaTextProps>(), {
  placeholder: 'Peça para a IA escrever algo...',
  reSend: undefined,
  onCancel: undefined,
  onSave: undefined,
});
const getAICompletion = async () => {
  if (!value.value) return;
  isGenerating.value = true;
  const oldValue = value.value;
  value.value = 'A IA está pensando...';
  try {
    const response = await props.onSend(oldValue);
    generatedText.value = response;
    value.value = oldValue;
  } catch (error) {
  } finally {
    isGenerating.value = false;
  }
};
const isGeneratingColor = {
  color: AlexThemeColors['secondary-0'],
  outline: AlexThemeColors['secondary-0'],
};
</script>

<style scoped lang="scss">
.ce-ia-text {
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
</style>
